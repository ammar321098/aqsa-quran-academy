"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { classroomSchema, ClassroomSchemaType } from "@/lib/zodSchema";
import { ClassroomMemberStatus, UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function editClassroom(data: ClassroomSchemaType, id: string) {
  const user = await requireAdmin();
  if (!user) {
    return { status: "error", message: "User not authenticated" };
  }

  const result = classroomSchema.safeParse(data);
  if (!result.success) {
    return { status: "error", message: "Invalid data" };
  }

  const existingClassroom = await prisma.classroom.findUnique({
    where: { id },
  });

  if (!existingClassroom) {
    return { status: "error", message: "Classroom not found" };
  }

  await prisma.$transaction(async (tx) => {
    // Update classroom
    await tx.classroom.update({
      where: { id },
      data: {
        title: result.data.title,
        slug: result.data.slug,
        description: result.data.description,
        price: result.data.price,
        isFree: result.data.isFree,
        status: result.data.status,
        teacherId: result.data.teacherId,
        isActive: result.data.isActive ?? true,
        departmentId: result.data.departmentId,
      },
    });

    // ALWAYS ensure teacher exists as ClassroomMember
    await tx.classroomMember.upsert({
      where: {
        classroomId_userId: {
          classroomId: id,
          userId: result.data.teacherId,
        },
      },
      update: {
        status: ClassroomMemberStatus.APPROVED,
      },
      create: {
        classroomId: id,
        userId: result.data.teacherId,
        status: ClassroomMemberStatus.APPROVED,
      },
    });

    // If teacher changed → remove old teacher(s)
    if (
      existingClassroom.teacherId &&
      existingClassroom.teacherId !== result.data.teacherId
    ) {
      await tx.classroomMember.deleteMany({
        where: {
          classroomId: id,
          userId: existingClassroom.teacherId,
        },
      });
    }
  });

  return {
    status: "success",
    message: "Classroom updated successfully",
  };
}

export async function adminVerifyStudent(
  studentId: string,
  classroomId: string,
) {
  // Update the ClassroomMember status to APPROVED
  const updated = await prisma.classroomMember.update({
    where: { classroomId_userId: { classroomId, userId: studentId } },
    data: { status: "APPROVED" }, // or APPROVED if your enum has it
  });

  // Revalidate classroom page (optional)
  revalidatePath(`/admin/classes/edit/${classroomId}`);

  return updated;
}

export async function addStudentToClass(
  studentId: string,
  classroomId: string,
) {
  await prisma.$transaction([
    prisma.classroomMember.create({
      data: {
        classroomId,
        userId: studentId,
        status: "APPROVED",
      },
    }),

    prisma.enrolment.create({
      data: {
        classroomId,
        userId: studentId,
        amount: 0,
        status: "Active",
      },
    }),
  ]);

  revalidatePath(`/classrooms/${classroomId}`);
}
