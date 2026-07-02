"use server";

import { prisma } from "@/lib/db";
import { requireAdminOrTeacher } from "@/app/data/admin/require-admin-or-teacher";
import { revalidatePath } from "next/cache";

export async function toggleQuizShowCorrect(quizId: string) {
  await requireAdminOrTeacher();

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    select: { showCorrect: true },
  });

  if (!quiz) throw new Error("Quiz not found");

  const updated = await prisma.quiz.update({
    where: { id: quizId },
    data: { showCorrect: !quiz.showCorrect },
    select: { showCorrect: true },
  });

  revalidatePath(`/admin/quiz/${quizId}/results`);

  return updated.showCorrect; // return new value
}