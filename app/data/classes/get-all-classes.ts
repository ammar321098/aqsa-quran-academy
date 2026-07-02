import "server-only";
import { prisma } from "@/lib/db";

export async function getAllClasses() {
  // await new Promise((resolve) => setTimeout(resolve, 2000));

  return prisma.classroom.findMany({
    where: {
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
      createdAt: true,
      teacher: {
        select: {
          id: true,
          image: true,
          teacherProfile: {
            select: {
              id: true,
              fullName: true,
            },
          },
        },
      },
      department: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export type PublicCourseType = NonNullable<
  Awaited<ReturnType<typeof getAllClasses>>[number]
>;
