import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { requireAdminOrTeacher } from "@/app/data/admin/require-admin-or-teacher";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ quizId: string; userId: string }> }
) {
  await requireAdminOrTeacher();
  const { quizId, userId } = await params;

  if (!quizId || !userId) {
    return NextResponse.json(
      { error: "Quiz ID and user ID required" },
      { status: 400 }
    );
  }

  const { questionMarks } = (await req.json()) as {
    questionMarks: Record<string, number>;
  };

  if (!questionMarks || typeof questionMarks !== "object") {
    return NextResponse.json(
      { error: "questionMarks object required" },
      { status: 400 }
    );
  }

  const submission = await prisma.quizSubmission.findUnique({
    where: { quizId_userId: { quizId, userId } },
  });

  if (!submission) {
    return NextResponse.json(
      { error: "Submission not found" },
      { status: 404 }
    );
  }

  const sanitized: Record<string, number> = {};
  for (const [k, v] of Object.entries(questionMarks)) {
    const n = typeof v === "number" ? v : Number(v);
    if (!Number.isNaN(n) && n >= 0) {
      sanitized[k] = n;
    }
  }

  const obtainedMarks = Object.values(sanitized).reduce((a, b) => a + b, 0);

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    select: { totalMarks: true },
  });

  const totalMarks =
    quiz?.totalMarks && quiz.totalMarks >= 1
      ? quiz.totalMarks
      : Object.keys(sanitized).length;

  await prisma.$transaction([
    prisma.quizSubmission.update({
      where: { id: submission.id },
      data: { questionMarks: sanitized as object },
    }),
    prisma.quizResult.upsert({
      where: {
        quizId_studentId: { quizId, studentId: userId },
      },
      create: {
        quizId,
        studentId: userId,
        totalMarks,
        obtainedMarks,
        classroomId: null,
      },
      update: {
        totalMarks,
        obtainedMarks,
      },
    }),
  ]);

  return NextResponse.json({
    success: true,
    obtainedMarks,
    totalMarks,
  });
}
