import { prisma } from "@/lib/db";

export async function getNonMemberStudents(classroomId: string) {
  return prisma.user.findMany({
    where: {
      isStudent: true,
      classroomMembers: {
        none: {
          classroomId,
        },
      },
    },
    select: {
      id: true,
      rollNumber: true,
      image: true,
      studentProfile: {
        select: {
          fullName: true,
        },
      },
    },
  });
}
