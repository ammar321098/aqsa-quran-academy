"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchema";
import { JSONContent } from "@tiptap/react";
import { tiptapToPlainText } from "@/lib/tiptapToPlainText";

export async function CreateCourse(
  data: CourseSchemaType
): Promise<ApiResponse> {
  const session = await requireAdmin();

  try {
    if (!session) {
      return {
        status: "error",
        message: "User not authenticated",
      };
    }
    const validation = courseSchema.safeParse(data);

    const json: JSONContent = JSON.parse(validation.data?.description || "");
    const plainTextDescription = tiptapToPlainText(json);

    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid form data",
      };
    }

    await prisma.course.create({
      data: {
        userId: session?.user.id as string,
        ...validation.data,
      },
    });

    return {
      status: "success",
      message: "Course created successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to create course",
    };
  }
}
