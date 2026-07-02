import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const user = await requireUser();
  const { searchParams } = new URL(req.url);

  const classId = searchParams.get("classId");
  const month = Number(searchParams.get("month")); // 1–12
  const year = Number(searchParams.get("year"));

  if (!classId || !month || !year) {
    return NextResponse.json([]);
  }

  const start = new Date(year, month - 1, 1, 0, 0, 0);
  const end = new Date(year, month, 0, 23, 59, 59);

  const data = await prisma.attendanceRecord.findMany({
    where: {
      studentId: user.id,
      attendance: {
        classId,
        date: {
          gte: start,
          lte: end,
        },
      },
    },
    include: {
      attendance: {
        select: {
          date: true,
        },
      },
    },
    orderBy: {
      attendance: {
        date: "asc",
      },
    },
  });

  const result = data.map((r) => ({
    date: r.attendance.date,
    status: r.status,
  }));

  return NextResponse.json(result);
}
