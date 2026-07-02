import { prisma } from "@/lib/db";
import { ClassroomMemberStatus, UserRole } from "@prisma/client";

export async function adminGetClassroomMembers(classroomId: string) {
  const members = await prisma.classroomMember.findMany({
    where: {
      classroomId,
    },
    include: {
      user: {
        select: {
          id: true,
          image: true,
          rollNumber: true,
          role: true,
          teacherProfile: {
            select: {
              fullName: true,
            },
          },
          studentProfile: {
            select: {
              fullName: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const teachers = members
    .filter((m) => m.user.role === UserRole.teacher)
    .map((m) => ({
      id: m.user.id,
      name: m.user.teacherProfile?.fullName ?? "Unnamed Teacher",
      photo: m.user.image,
      status: m.status,
    }));

  const students = members
    .filter((m) => m.user.role === UserRole.student)
    .map((m) => ({
      id: m.user.id,
      name: m.user.studentProfile?.fullName ?? "Unnamed Student",
      rollNumber: m.user?.rollNumber ?? "-",
      photo: m.user.image,
      status: m.status,
    }));

  return {
    teachers,
    students,
  };
}
