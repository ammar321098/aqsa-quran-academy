// lib/get-roll-session.ts
"use server";

import { cache } from "react";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

// Use select instead of include - only fetch fields we need (lighter query)
// cache() deduplicates calls within the same request (e.g. layout + data fetchers)
export const getRollSession = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("roll_session")?.value;

  if (!token) return null;

  const session = await prisma.session.findFirst({
    where: {
      token,
      expiresAt: { gt: new Date() },
    },
    select: {
      id: true,
      userId: true,
      token: true,
      expiresAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          rollNumber: true,
          image: true,
          role: true,
          studentProfile: { select: { fullName: true } },
          teacherProfile: { select: { fullName: true } },
        },
      },
    },
  });

  return session;
});
