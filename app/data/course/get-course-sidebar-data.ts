import "server-only";
import { requireUser } from "../user/require-user";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export async function getCourseSidebarData(slug: string) {
  const session = await requireUser();

  const course = await prisma.course.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      fileKey: true,
      duration: true,
      level: true,
      category: true,
      slug: true,
      smallDescription: true,

      // Chapters
      chapters: {
        orderBy: { position: "asc" },
        select: {
          id: true,
          title: true,
          position: true,
          lessons: {
            orderBy: { position: "asc" },
            select: {
              id: true,
              title: true,
              position: true,
              description: true,
              lessonProgress: {
                where: { userId: session.id },
                select: { completed: true, lessonId: true, id: true },
              },
            },
          },

          // Chapter-level quizzes
          quizzes: {
            where: { isPublished: true, type: "CHAPTER" },
            select: {
              id: true,
              title: true,
              googleFormUrl: true,
              quizSubmissions: {
                where: { userId: session.id },
                select: { id: true },
              },
            },
          },
        },
      },

      // Course-level quizzes
      quizzes: {
        where: { isPublished: true, type: "COURSE" },
        select: {
          id: true,
          title: true,
          googleFormUrl: true,
          quizSubmissions: {
            where: { userId: session.id },
            select: { id: true },
          },
        },
      },
    },
  });

  if (!course) notFound();

  // Check enrollment
  const enrollment = await prisma.enrolment.findUnique({
    where: { courseId_userId: { courseId: course.id, userId: session.id } },
  });

  if (!enrollment || enrollment.status !== "Active") {
    return notFound();
  }

  return { course };
}

// Type helper
export type CourseSidebarDataType = Awaited<
  ReturnType<typeof getCourseSidebarData>
>;
