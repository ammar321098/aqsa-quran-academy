import "server-only";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { prisma } from "@/lib/db";

/** Use for quiz creation: allows both admin and teacher. */
export const requireAdminOrTeacher = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role === "admin") {
    return { user: { id: session.user.id } };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, isTeacher: true, teacherProfile: true },
  });

  if (!user?.isTeacher || !user.teacherProfile) {
    redirect("/not-admin");
  }

  return { user: { id: user.id } };
});
