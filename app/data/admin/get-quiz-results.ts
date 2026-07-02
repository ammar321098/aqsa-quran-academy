import "server-only";
import { prisma } from "@/lib/db";
import { requireAdminOrTeacher } from "./require-admin-or-teacher";

export async function getQuizResults(quizId: string) {
  await requireAdminOrTeacher();

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    select: {
      id: true,
      title: true,
      type: true,
      totalMarks: true,
      showCorrect: true,
      course: { select: { title: true } },
      chapter: { select: { title: true } },
    },
  });

  if (!quiz) return null;

  const results = await prisma.quizResult.findMany({
    where: { quizId },
    orderBy: { obtainedMarks: "desc" },
    select: {
      id: true,
      obtainedMarks: true,
      totalMarks: true,
      createdAt: true,
      student: {
        select: {
          id: true,
          name: true,
          email: true,
          rollNumber: true,
        },
      },
    },
  });

  return {
    quiz: {
      id: quiz.id,
      title: quiz.title,
      type: quiz.type,
      totalMarks: quiz.totalMarks,
      courseTitle: quiz.course?.title ?? null,
      chapterTitle: quiz.chapter?.title ?? null,
      showCorrect: quiz.showCorrect,
    },
    results,
  };
}
