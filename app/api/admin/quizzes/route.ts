import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const quizzes = await prisma.quiz.findMany({
    orderBy: { createdAt: "desc" },
    where: {
      type: { not: "CLASSROOM" }, // exclude classroom quizzes
    },
    select: {
      id: true,
      title: true,
      googleFormUrl: true,
      type: true,
      isPublished: true,
      createdAt: true,
      courseId: true,
      chapterId: true,
      course: { select: { id: true, title: true } },
      chapter: { select: { id: true, title: true } },
    },
  });

  return NextResponse.json(quizzes);
}