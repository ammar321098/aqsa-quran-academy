"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { lessonSchema, LessonSchemaType } from "@/lib/zodSchema";

export async function updateLesson(
  values: LessonSchemaType,
  lessonId: string
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const result = lessonSchema.safeParse(values);
    if (!result) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        title: result.data?.name,
        description: result.data?.description,
        thumbnailKey: result.data?.thumbnailKey,
        videoSource: result.data?.videoSource,
        videoKey:
          result.data?.videoSource === "UPLOAD" ? result.data?.videoKey : "",
        embedUrl:
          result.data?.videoSource === "EMBED" ? result.data?.embedUrl : null,
      },
    });

    return {
      status: "success",
      message: "Course updated successsfully",
    };
  } catch {
    return {
      status: "error",
      message: "Faild to update lesson",
    };
  }
}
