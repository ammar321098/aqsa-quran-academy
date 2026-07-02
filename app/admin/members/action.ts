"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getMembersData() {
  try {
    // Fetch students
    const students = await prisma.user.findMany({
      where: { role: "student" },
      select: {
        id: true,
        name: true,
        image: true,
        rollNumber: true,
        studentProfile: {
          select: { fullName: true },
        },
      },
      orderBy: { name: "asc" },
    });

    // Fetch teachers
    const teachers = await prisma.user.findMany({
      where: { role: "teacher" },
      select: {
        id: true,
        name: true,
        image: true,
        teacherProfile: {
          select: { fullName: true },
        },
      },
      orderBy: { name: "asc" },
    });

    // Format data
    const formattedStudents = students.map((s) => ({
      id: s.id,
      name: s.name ?? s.studentProfile?.fullName ?? "User",
      image: s.image ?? null,
      rollNumber: s.rollNumber ?? null,
      fullName: s.studentProfile?.fullName ?? s.name ?? "User",
    }));

    const formattedTeachers = teachers.map((t) => ({
      id: t.id,
      name: t.name ?? t.teacherProfile?.fullName ?? "User",
      image: t.image ?? null,
      fullName: t.teacherProfile?.fullName ?? t.name ?? "User",
    }));

    return { students: formattedStudents, teachers: formattedTeachers };
  } catch (error) {
    console.error("Error fetching members:", error);
    return { students: [], teachers: [] };
  }
}

export async function deleteMember(userId: string) {
  try {
    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath("/admin/members");

    return { success: true };
  } catch (error) {
    console.error("Delete Member Error:", error);
    return { success: false };
  }
}
