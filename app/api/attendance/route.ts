import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";

// fetch attendance of perticular date
export async function GET(req: Request) {
  const user = await requireUser();
  const { searchParams } = new URL(req.url);
  const classId = searchParams.get("classId")!;
  const date = new Date(searchParams.get("date")!);

  if (!user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const attendance = await prisma.attendance.findUnique({
    where: { classId_date: { classId, date } },
    include: { records: true },
  });

  return Response.json(attendance);
}

// post attendance of perticular date
export async function POST(req: Request) {
  const { classId, date, records } = await req.json();

  const attendance = await prisma.attendance.upsert({
    where: { classId_date: { classId, date: new Date(date) } },
    update: {},
    create: { classId, date: new Date(date) },
  });

  await Promise.all(
    records.map((r: any) =>
      prisma.attendanceRecord.upsert({
        where: {
          attendanceId_studentId: {
            attendanceId: attendance.id,
            studentId: r.studentId,
          },
        },
        update: { status: r.status },
        create: {
          attendanceId: attendance.id,
          studentId: r.studentId,
          status: r.status,
        },
      }),
    ),
  );

  return Response.json({ success: true });
}
