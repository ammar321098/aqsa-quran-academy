import { prisma } from "@/lib/db";
import { requireUser } from "@/app/data/user/require-user";

export async function getEnrolledClassesWithAttendance() {
  const user = await requireUser();

  // Get all classes the user is enrolled in
  const enrolledClasses = await prisma.classroomMember.findMany({
    where: { userId: user.id, status: "APPROVED" },
    include: {
      classroom: {
        include: {
          teacher: { include: { teacherProfile: true } },
        },
      },
    },
  });

  const classIds = enrolledClasses.map((e) => e.classroomId);

  if (classIds.length === 0) return [];

  // Aggregate attendance records per class
  const attendanceRecords = await prisma.attendanceRecord.groupBy({
    by: ["studentId", "attendanceId", "status"] as const,
    where: {
      studentId: user.id,
      attendance: { classId: { in: classIds } },
    },
    _count: { status: true },
  });

  // Map attendance records to class-level summaries
  const classAttendanceMap: Record<
    string,
    { present: number; absent: number; leave: number }
  > = {};

  for (const record of attendanceRecords) {
    const attendance = await prisma.attendance.findUnique({
      where: { id: record.attendanceId },
      select: { classId: true },
    });

    if (!attendance) continue;

    const classId = attendance.classId;

    if (!classAttendanceMap[classId]) {
      classAttendanceMap[classId] = { present: 0, absent: 0, leave: 0 };
    }

    if (record.status === "PRESENT")
      classAttendanceMap[classId].present += record._count.status;
    if (record.status === "ABSENT")
      classAttendanceMap[classId].absent += record._count.status;
    if (record.status === "LEAVE")
      classAttendanceMap[classId].leave += record._count.status;
  }

  // Return final data
  return enrolledClasses.map((e) => ({
    classroom: e.classroom,
    attendanceSummary: classAttendanceMap[e.classroomId] ?? {
      present: 0,
      absent: 0,
      leave: 0,
    },
  }));
}
