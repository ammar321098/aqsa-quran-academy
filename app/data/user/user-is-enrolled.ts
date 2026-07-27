import "server-only";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { requireUser } from "./require-user";

export async function checkIfCourseBought(courseId: string): Promise<boolean> {
  const user = await requireUser();

  if (!user) return false;

  const enrollment = await prisma.enrolment.findUnique({
    where: {
      courseId_userId: {
        courseId,
        userId: user.id,
      },
    },
    select: {
      status: true,
    },
  });

  return enrollment?.status === "Active" ? true : false;
}

export async function checkIfClassroomEnrolled(
  classroomId: string,
): Promise<boolean> {
  const user = await requireUser();

  if (!user) return false;

  const userId = user.id;

  // Check ClassroomMember first
  const member = await prisma.classroomMember.findUnique({
    where: { classroomId_userId: { classroomId, userId } },
    select: { status: true },
  });

  if (member?.status === "APPROVED") return true;

  // Optionally also check enrolment table (for paid classroom)
  const enrolment = await prisma.enrolment.findUnique({
    where: { classroomId_userId: { classroomId, userId } },
    select: { status: true },
  });

  return enrolment?.status === "Active" ? true : false;
}
