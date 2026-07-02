import "server-only";

import { requireAdmin } from "./require-admin";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export async function adminGetClassroom(id: string) {
  // Ensure admin authentication
  await requireAdmin();

  // Fetch classroom with teacher info
  const data = await prisma.classroom.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      price: true,
      isFree: true,
      status: true,
      teacherId: true,
      departmentId: true,
      teacher: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      isActive: true,
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

export type AdminClassroomSingularType = Awaited<
  ReturnType<typeof adminGetClassroom>
>;
