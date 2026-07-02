"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function createCourseCategory(name: string): Promise<ApiResponse> {
  await requireAdmin();

  const trimmed = name.trim();
  if (!trimmed) {
    return { status: "error", message: "Category name is required." };
  }

  try {
    const existing = await prisma.courseCategory.findUnique({
      where: { name: trimmed },
    });
    if (existing) {
      return { status: "error", message: "A category with this name already exists." };
    }

    await prisma.courseCategory.create({
      data: { name: trimmed },
    });

    revalidatePath("/admin/course-categories");
    revalidatePath("/admin/courses");
    revalidatePath("/admin/courses/create");
    return { status: "success", message: "Category created." };
  } catch (e) {
    console.error("createCourseCategory:", e);
    return { status: "error", message: "Failed to create category." };
  }
}

export async function deleteCourseCategory(id: string): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const cat = await prisma.courseCategory.findUnique({ where: { id } });
    if (!cat) {
      return { status: "error", message: "Category not found." };
    }
    const usedBy = await prisma.course.count({
      where: { category: cat.name },
    });
    if (usedBy > 0) {
      return { status: "error", message: "Cannot delete: some courses use this category." };
    }

    await prisma.courseCategory.delete({ where: { id } });
    revalidatePath("/admin/course-categories");
    revalidatePath("/admin/courses");
    return { status: "success", message: "Category deleted." };
  } catch (e) {
    console.error("deleteCourseCategory:", e);
    return { status: "error", message: "Failed to delete category." };
  }
}
