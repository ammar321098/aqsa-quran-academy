"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createDepartment(formData: FormData) {
  const name = formData.get("name") as string;
  const code = formData.get("code") as string;

  if (!name || !code) {
    return { success: false, message: "All fields are required" };
  }

  const exists = await prisma.department.findFirst({
    where: {
      OR: [{ name }, { code }],
    },
  });

  if (exists) {
    return { success: false, message: "Department already exists" };
  }

  await prisma.department.create({
    data: {
      name,
      code: code.toUpperCase(),
    },
  });

  revalidatePath("/admin/department");
  return { success: true, message: "Department created successfully" };
}

export async function deleteDepartment(departmentId: number) {
  // 1. Check if students exist
  const studentsCount = await prisma.studentProfile.count({
    where: {
      user: {
        departmentId,
      },
    },
  });

  if (studentsCount > 0) {
    return {
      success: false,
      message: "Cannot delete department. Students are assigned to it",
    };
  }

  // 2. Safe to delete
  await prisma.department.delete({
    where: { id: departmentId },
  });

  // 3. Refresh list
  revalidatePath("/admin/departments");

  return { success: true, message: "Department deleted successfully" };
}
