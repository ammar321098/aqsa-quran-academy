import "server-only";
import { prisma } from "@/lib/db";

export async function getAllCourses() {
  return prisma.course.findMany({
    where: {
      status: "Published",
    },
    select: {
      id: true,
      title: true,
      slug: true,
      fileKey: true,
      duration: true,
      level: true,
      category: true,
      smallDescription: true,
      price: true,
      isFree: true,
      isFeatured: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export type PublicCourseType = NonNullable<
  Awaited<ReturnType<typeof getAllCourses>>[number]
>;
