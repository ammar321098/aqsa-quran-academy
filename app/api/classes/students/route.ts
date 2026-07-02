import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/app/data/user/require-user";

export async function GET(req: Request) {
  const user = await requireUser();
  const { searchParams } = new URL(req.url);
  const classroomId = searchParams.get("classroomId");
  try {
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!classroomId) {
      return NextResponse.json(
        { error: "Class ID is required" },
        { status: 400 },
      );
    }

    const students = await prisma.user.findMany({
      where: {
        enrolment: {
          some: {
            classroomId: classroomId,
          },
        },
        isStudent: true,
      },
      select: {
        id: true,
        name: true,
        rollNumber: true,
        studentProfile: true,
      },
      orderBy: {
        rollNumber: "asc",
      },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 },
    );
  }
}
