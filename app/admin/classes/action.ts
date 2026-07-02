// app/admin/classes/actions/create-classroom.ts
"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { ApiResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { ClassroomMemberStatus, UserRole } from "@prisma/client";

export async function createClassroom(data: {
  name: string;
  slug: string;
}): Promise<ApiResponse> {
  const session = await requireAdmin();

  if (!session) {
    return { status: "error", message: "Unauthorized" };
  }

  const existing = await prisma.classroom.findUnique({
    where: { slug: data.slug },
  });

  if (existing) {
    return {
      status: "error",
      message: "Class with this slug already exists",
    };
  }

  await prisma.$transaction(async (tx) => {
    const classroom = await tx.classroom.create({
      data: {
        title: data.name,
        slug: data.slug,
        price: 0,
        isFree: true,
        teacherId: session.user.id,
      },
    });

    // Add teacher as classroom member
    await tx.classroomMember.create({
      data: {
        classroomId: classroom.id,
        userId: session.user.id,
        status: ClassroomMemberStatus.APPROVED,
      },
    });
  });

  revalidatePath("/admin/classes");
  return { status: "success", message: "Class created successfully" };
}

export async function deleteClassroom(
  classroomId: string,
): Promise<ApiResponse> {
  const session = await requireAdmin();

  if (!session) {
    return {
      status: "error",
      message: "Unauthorized",
    };
  }

  try {
    // Optional: ensure classroom exists
    const classroom = await prisma.classroom.findUnique({
      where: { id: classroomId },
    });

    if (!classroom) {
      return {
        status: "error",
        message: "Class not found",
      };
    }

    await prisma.classroom.delete({
      where: { id: classroomId },
    });

    // Revalidate admin page
    revalidatePath("/admin/classes");

    return {
      status: "success",
      message: "Class deleted successfully",
    };
  } catch (error) {
    console.error("Delete classroom error:", error);
    return {
      status: "error",
      message: "Failed to delete class",
    };
  }
}
