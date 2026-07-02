import "server-only";

import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export async function getPublicClassById(classroomId: string) {
  const classroom = await prisma.classroom.findUnique({
    where: {
      id: classroomId,
      status: "Published",
    },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      price: true,
      isFree: true,
      isActive: true,
      teacher: {
        select: {
          id: true,
          image: true,
          teacherProfile: { select: { fullName: true } },
        },
      },
      department: { select: { name: true } },
    },
  });

  if (!classroom) notFound();

  return classroom;
}
