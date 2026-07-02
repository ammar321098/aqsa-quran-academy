// app/data/user/get-teacher.ts

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getTeacher() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) return null;

  const teacher = await prisma.teacherProfile.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  return teacher ?? null;
}
