import "server-only";
import { prisma } from "@/lib/db";

export async function getSuccessStats() {
  const [studentsEnrolled, coursesOffered, teachersCount] = await Promise.all([
    // Users with at least one enrolment (course or classroom)
    prisma.user.count({
      where: {
        enrolment: { some: {} },
      },
    }),
    // Published courses
    prisma.course.count({
      where: { status: "Published" },
    }),
    // Users who are teachers (isTeacher = true)
    prisma.user.count({
      where: { isTeacher: true },
    }),
  ]);

  return {
    studentsEnrolled,
    coursesOffered,
    teachersCount,
  };
}
