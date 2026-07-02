// app/data/user/get-student.ts

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getStudent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) return null;

  const student = await prisma.studentProfile.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  return student ?? null;
}
