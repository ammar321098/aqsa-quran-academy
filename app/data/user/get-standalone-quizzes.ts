import "server-only";
import { prisma } from "@/lib/db";

export async function getStandaloneQuizzes() {
  if (!prisma.quiz?.findMany) {
    return [];
  }
  try {
    return await prisma.quiz.findMany({
      where: {
        type: "STANDALONE",
        isPublished: true,
      },
      select: {
        id: true,
        title: true,
        smallDescription: true,
        thumbnailKey: true,
        googleFormUrl: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export type StandaloneQuizItem = Awaited<
  ReturnType<typeof getStandaloneQuizzes>
>[number];
