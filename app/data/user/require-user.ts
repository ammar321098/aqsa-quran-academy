import "server-only";
import { cache } from "react";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getRollSession } from "@/lib/get-roll-session";
import { prisma } from "@/lib/db";

export const requireUser = cache(async () => {
  let userId: string | null = null;

  // Better auth
  const authSession = await auth.api.getSession({
    headers: await headers(),
  });

  if (authSession?.user?.id) {
    userId = authSession.user.id;
  }

  // Roll session
  if (!userId) {
    const rollSession = await getRollSession();
    if (rollSession?.user?.id) {
      userId = rollSession.user.id;
    }
  }

  if (!userId) {
    redirect("/login");
  }

  // Always fetch Prisma user
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      studentProfile: true,
      teacherProfile: true,
      department: true,
    },
  });

  if (!user) redirect("/login");

  return user;
});
