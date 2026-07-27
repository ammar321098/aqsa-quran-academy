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

    // Validate data first
    const validation = courseSchema.safeParse(data);
    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid form data",
      };
    }

    const { slug } = validation.data;

    // Check if a course with the same slug already exists
    const existingCourse = await prisma.course.findUnique({
      where: { slug },
    });

    if (existingCourse) {
      return {
        status: "error",
        message: "A course with this slug already exists",
      };
    }

    // Convert tiptap JSON to plain text (optional)
    const json: JSONContent = JSON.parse(validation.data.description || "");

    const { needsToWorkOn, ...rest } = validation.data;
    await prisma.course.create({
      data: {
        userId: session.user.id,
        ...rest,
        needsToWorkOn: needsToWorkOn ?? null,
        description: JSON.stringify(json), // keep JSON
      },
    });

    return {
      status: "success",
      message: "Course created successfully",
    };
  } catch (error) {
    console.error("CreateCourse error:", error);
    return {
      status: "error",
      message: "Failed to create course",
    };
  }
}
