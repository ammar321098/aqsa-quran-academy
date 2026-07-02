import "server-only";
import { requireUser } from "./require-user";
import { prisma } from "@/lib/db";

export async function getStudentQuizEnrolments() {
  const user = await requireUser();

  const quizEnrolment = (prisma as { quizEnrolment?: { findMany: typeof prisma.quizEnrolment.findMany } }).quizEnrolment;
  if (!quizEnrolment?.findMany) {
    // Prisma client was not regenerated after adding QuizEnrolment. Run: pnpm prisma generate
    return [];
  }

  return quizEnrolment.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      quizId: true,
      createdAt: true,
      quiz: {
        select: {
          id: true,
          title: true,
          googleFormUrl: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export type StudentQuizEnrolmentItem = Awaited<
  ReturnType<typeof getStudentQuizEnrolments>
>[number];
