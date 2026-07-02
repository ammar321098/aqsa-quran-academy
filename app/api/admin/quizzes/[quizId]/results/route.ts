import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { requireAdminOrTeacher } from "@/app/data/admin/require-admin-or-teacher";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ quizId: string }> }
) {
  await requireAdminOrTeacher();
  const { quizId } = await params;

  if (!quizId) {
    return NextResponse.json({ error: "Quiz ID required" }, { status: 400 });
  }

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    select: {
      id: true,
      title: true,
      type: true,
      totalMarks: true,
      course: { select: { title: true } },
      chapter: { select: { title: true } },
    },
  });

  if (!quiz) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }

  const results = await prisma.quizResult.findMany({
    where: { quizId },
    orderBy: { obtainedMarks: "desc" },
    select: {
      id: true,
      obtainedMarks: true,
      totalMarks: true,
      createdAt: true,
      student: {
        select: {
          id: true,
          name: true,
          email: true,
          rollNumber: true,
        },
      },
    },
  });

  return NextResponse.json({
    quiz: {
      id: quiz.id,
      title: quiz.title,
      type: quiz.type,
      totalMarks: quiz.totalMarks,
      courseTitle: quiz.course?.title ?? null,
      chapterTitle: quiz.chapter?.title ?? null,
    },
    results,
  });
}
