import { getQuizzesForTeacher } from "@/app/data/teacher/get-quizzes";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const quiz = await getQuizzesForTeacher(id);

    return NextResponse.json(quiz);
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
