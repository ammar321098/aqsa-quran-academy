// server/teacher.ts
import { prisma } from "@/lib/db";

export async function getQuizzesByClassroom(classroomId: string) {
  return prisma.quiz.findMany({
    where: { classroomPost: { classroomId } },
    select: { id: true, title: true },
  });
}

export async function getStudentsByClassroom(classroomId: string) {
  const members = await prisma.classroomMember.findMany({
    where: { classroomId, status: "APPROVED" },
    select: {
      user: { select: { id: true, name: true, rollNumber: true } },
    },
  });

  return members.map((m) => m.user);
}
