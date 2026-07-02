import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/app/data/user/require-user";

export async function GET() {
  const user = await requireUser();

  if (!user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const classrooms = await prisma.classroom.findMany({
    where: {
      enrolment: {
        some: {
          userId: user.id,
        },
      },
    },
    select: {
      id: true,
      title: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(classrooms);
}
