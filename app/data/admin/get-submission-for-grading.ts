import "server-only";
import { prisma } from "@/lib/db";
import { requireAdminOrTeacher } from "./require-admin-or-teacher";

export async function getSubmissionForGrading(quizId: string, userId: string) {
  await requireAdminOrTeacher();

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    select: {
      id: true,
      title: true,
      totalMarks: true,
      questions: {
        orderBy: { position: "asc" },
        include: { options: { orderBy: { position: "asc" } } },
      },
    },
  });

  if (!quiz) return null;

  const [submission, quizResult, student] = await Promise.all([
    prisma.quizSubmission.findUnique({
      where: { quizId_userId: { quizId, userId } },
      select: { id: true, answers: true, questionMarks: true },
    }),
    prisma.quizResult.findUnique({
      where: { quizId_studentId: { quizId, studentId: userId } },
      select: { obtainedMarks: true, totalMarks: true },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, rollNumber: true },
    }),
  ]);

  if (!submission || !quizResult || !student) return null;

  const rawAnswers = submission.answers;
  const answers: Record<string, string | string[]> =
    rawAnswers &&
    typeof rawAnswers === "object" &&
    !Array.isArray(rawAnswers)
      ? (rawAnswers as Record<string, string | string[]>)
      : {};

  const rawMarks = submission.questionMarks;
  const questionMarks: Record<string, number> =
    rawMarks && typeof rawMarks === "object" && !Array.isArray(rawMarks)
      ? (rawMarks as Record<string, number>)
      : {};

  return {
    quiz: {
      id: quiz.id,
      title: quiz.title,
      totalMarks: quiz.totalMarks,
      questions: quiz.questions,
    },
    student: {
      id: student.id,
      name: student.name,
      email: student.email,
      rollNumber: student.rollNumber,
    },
    submission: {
      id: submission.id,
      answers,
      questionMarks,
    },
    quizResult: {
      obtainedMarks: quizResult.obtainedMarks,
      totalMarks: quizResult.totalMarks,
    },
  };
}
