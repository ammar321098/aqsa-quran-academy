"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function enrollInQuizAction(quizId: string): Promise<ApiResponse> {
  try {
    const user = await requireUser();

    if (!user.isStudent || !user.studentProfile) {
      return {
        status: "error",
        message: "Please complete your student profile to enroll in quizzes.",
      };
    }

    const quiz = await prisma.quiz.findFirst({
      where: { id: quizId, type: "STANDALONE", isPublished: true },
    });

    if (!quiz) {
      return { status: "error", message: "Quiz not found or not available for enrollment." };
    }

    await prisma.quizEnrolment.upsert({
      where: {
        quizId_userId: { quizId, userId: user.id },
      },
      update: {},
      create: {
        quizId,
        userId: user.id,
      },
    });

    revalidatePath("/dashboard/quizzes");
    revalidatePath(`/dashboard/quizzes/${quizId}`);
    revalidatePath(`/quizzes/${quizId}`);
    revalidatePath("/dashboard");
    return { status: "success", message: "Enrolled in quiz successfully." };
  } catch (e) {
    console.error("enrollInQuizAction:", e);
    const message =
      process.env.NODE_ENV === "development" && e instanceof Error
        ? `Failed to enroll: ${e.message}`
        : "Failed to enroll in quiz.";
    return { status: "error", message };
  }
}
