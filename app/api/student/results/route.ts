import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/app/data/user/require-user";

export async function GET(req: Request) {
  try {
    const user = await requireUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const classroomId = searchParams.get("classroomId");

    if (!classroomId) {
      return NextResponse.json(
        { error: "classroomId is required" },
        { status: 400 },
      );
    }

    const classroom = await prisma.classroom.findUnique({
      where: { id: classroomId },
      select: {
        posts: {
          select: {
            quizes: {
              select: {
                id: true,
                title: true,
                quizResults: {
                  where: { studentId: user.id },
                  select: {
                    obtainedMarks: true,
                    totalMarks: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!classroom) {
      return NextResponse.json([], { status: 200 });
    }

    const results = classroom.posts.flatMap((post) =>
      post.quizes.map((q) => ({
        quizId: q.id,
        quizTitle: q.title,
        obtainedMarks: q.quizResults[0]?.obtainedMarks ?? 0,
        totalMarks: q.quizResults[0]?.totalMarks ?? 0,
      })),
    );

    return NextResponse.json(results);
  } catch (error) {
    console.error("Student results API error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
