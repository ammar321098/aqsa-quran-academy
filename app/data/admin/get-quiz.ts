import { prisma } from "@/lib/db";

export async function getQuizForEdit(quizId: string) {
  return prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: {
        include: {
          options: true,
        },
      },
    },
  });
}
