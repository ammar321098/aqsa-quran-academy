"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { ApiResponse } from "@/lib/types";
import { quizSchema, QuizSchemaType } from "@/lib/zodSchema";

export async function CreateQuiz(data: QuizSchemaType): Promise<ApiResponse> {
  const session = await requireAdmin();

  if (!session) {
    return {
      status: "error",
      message: "Unauthorized",
    };
  }

  const validation = quizSchema.safeParse(data);

  if (!validation.success) {
    return {
      status: "error",
      message: "Invalid quiz data",
    };
  }

  const { title, googleFormUrl, type, courseId, chapterId } = validation.data;

  if (type === "CHAPTER" && !chapterId) {
    return {
      status: "error",
      message: "Chapter is required for chapter quiz",
    };
  }

  try {
    await prisma.quiz.create({
      data: {
        title,
        googleFormUrl,
        type,
        courseId,
        chapterId: type === "CHAPTER" ? chapterId : null,
        isPublished: true,
      },
    });

    return {
      status: "success",
      message: "Quiz created successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "Failed to create quiz",
    };
  }
}
