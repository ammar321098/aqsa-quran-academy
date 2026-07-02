import "server-only";

import { getOptionalUser } from "./get-optional-user";
import { prisma } from "@/lib/db";

export async function checkIfCourseBoughtOptional(
  courseId: string
): Promise<boolean> {
  const user = await getOptionalUser();
  if (!user) return false;

  const enrollment = await prisma.enrolment.findUnique({
    where: {
      courseId_userId: { courseId, userId: user.id },
    },
    select: { status: true },
  });

  return enrollment?.status === "Active";
}

export async function checkIfClassroomEnrolledOptional(
  classroomId: string
): Promise<boolean> {
  const user = await getOptionalUser();
  if (!user) return false;

  const member = await prisma.classroomMember.findUnique({
    where: { classroomId_userId: { classroomId, userId: user.id } },
    select: { status: true },
  });

  if (member?.status === "APPROVED") return true;

  const enrolment = await prisma.enrolment.findUnique({
    where: { classroomId_userId: { classroomId, userId: user.id } },
    select: { status: true },
  });

  return enrolment?.status === "Active";
}

export async function getQuizEnrollmentStatusOptional(quizId: string): Promise<{
  isEnrolled: boolean;
  hasSubmitted: boolean;
} | null> {
  const user = await getOptionalUser();
  if (!user) return null;

  try {
    const [enrolment, submission] = await Promise.all([
      prisma.quizEnrolment.findUnique({
        where: { quizId_userId: { quizId, userId: user.id } },
        select: { id: true },
      }),
      prisma.quizSubmission.findUnique({
        where: { quizId_userId: { quizId, userId: user.id } },
        select: { id: true },
      }),
    ]);

    return {
      isEnrolled: !!enrolment,
      hasSubmitted: !!submission,
    };
  } catch {
    return { isEnrolled: false, hasSubmitted: false };
  }
}
