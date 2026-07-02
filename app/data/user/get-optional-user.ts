import "server-only";
import { cache } from "react";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getRollSession } from "@/lib/get-roll-session";
import { prisma } from "@/lib/db";

/**
 * Returns the current user if logged in, null otherwise.
 * Does NOT redirect - use for public pages that work for both guests and logged-in users.
 */
export const getOptionalUser = cache(async () => {
  let userId: string | null = null;

  const authSession = await auth.api.getSession({
    headers: await headers(),
  });

  if (authSession?.user?.id) {
    userId = authSession.user.id;
  }

  if (!userId) {
    const rollSession = await getRollSession();
    if (rollSession?.user?.id) {
      userId = rollSession.user.id;
    }
  }

  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      studentProfile: true,
      teacherProfile: true,
      department: true,
    },
  });

  return user;
});
