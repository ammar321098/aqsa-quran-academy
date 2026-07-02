import "server-only";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { getRollSession } from "@/lib/get-roll-session";

export async function getClassroomEnrollmentStatuses(
  classroomIds: string[]
): Promise<Record<string, boolean>> {
  const authSession = await auth.api.getSession({
    headers: await headers(),
  });

  let userId: string | null = authSession?.user?.id ?? null;
  if (!userId) {
    const rollSession = await getRollSession();
    userId = rollSession?.user?.id ?? null;
  }

  if (!userId || classroomIds.length === 0) {
    return Object.fromEntries(classroomIds.map((id) => [id, false]));
  }

  const members = await prisma.classroomMember.findMany({
    where: {
      classroomId: { in: classroomIds },
      userId,
      status: "APPROVED",
    },
    select: { classroomId: true },
  });

  const enrolments = await prisma.enrolment.findMany({
    where: {
      classroomId: { in: classroomIds },
      userId,
      status: "Active",
    },
    select: { classroomId: true },
  });

  const enrolledIds = new Set([
    ...members.map((m) => m.classroomId),
    ...enrolments.map((e) => e.classroomId),
  ]);

  return Object.fromEntries(
    classroomIds.map((id) => [id, enrolledIds.has(id)])
  );
}
