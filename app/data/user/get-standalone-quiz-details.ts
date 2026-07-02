import "server-only";
import { prisma } from "@/lib/db";

export async function getStandaloneQuizDetails(quizId: string) {
  if (!prisma.quiz?.findUnique) return null;
  try {
    return await prisma.quiz.findUnique({
      where: {
        id: quizId,
        type: "STANDALONE",
        isPublished: true,
      },
      select: {
        id: true,
        title: true,
        smallDescription: true,
        description: true,
        thumbnailKey: true,
        googleFormUrl: true,
        createdAt: true,
        _count: { select: { questions: true } },
      },
    });
  } catch {
    return null;
  }
}
