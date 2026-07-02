import { prisma } from "@/lib/db";
import { requireUser } from "./require-user";

export async function getEnrolledCourses() {
  const user = await requireUser();

  const data = await prisma.enrolment.findMany({
    where: { userId: user.id, status: "Active" },
    select: {
      course: {
        select: {
          id: true,
          title: true,
          smallDescription: true,
          fileKey: true,
          level: true,
          slug: true,
          duration: true,
          price: true,
          category: true,
          // Chapters
          chapters: {
            select: {
              id: true,
              title: true,
              position: true,
              lessons: {
                select: {
                  id: true,
                  title: true,
                  description: true,
                  position: true,
                  lessonProgress: {
                    where: { userId: user.id },
                    select: { id: true, completed: true, lessonId: true },
                  },
                },
              },
              quizzes: {
                select: {
                  id: true,
                  title: true,
                  googleFormUrl: true,
                  quizSubmissions: {
                    where: { userId: user.id },
                    select: { id: true },
                  },
                },
              },
            },
          },
          quizzes: {
            select: {
              id: true,
              title: true,
              googleFormUrl: true,
              quizSubmissions: {
                where: { userId: user.id },
                select: { id: true },
              },
            },
          },
        },
      },
    },
  });

  // Normalize to empty arrays if quizzes are null/undefined
  const normalizedData = data.map((item: any) => ({
    course: {
      ...item.course,
      quizzes: item.course.quizzes || [],
      chapters: item.course.chapters.map((ch: any) => ({
        ...ch,
        quizzes: ch.quizzes || [],
      })),
    },
  }));

  return normalizedData;
}

export type EnrolledCourseType = Awaited<ReturnType<typeof getEnrolledCourses>>[0];
