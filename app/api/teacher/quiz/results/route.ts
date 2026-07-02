// app/api/teacher/quiz/results/route.ts
import { prisma } from "@/lib/db";
import { requireUser } from "@/app/data/user/require-user";

export async function POST(req: Request) {
  try {
    const user = await requireUser();

    // Only teachers/admins allowed
    if (!user || (user.role !== "teacher" && user.role !== "admin")) {
      return new Response("Unauthorized", { status: 403 });
    }

    // Expect data = [{ quizId, classroomId, studentId, totalMarks, obtainedMarks }]
    const data = await req.json();

    if (!Array.isArray(data) || data.length === 0) {
      return new Response("Invalid data", { status: 400 });
    }

    const quizExists = await prisma.quiz.findUnique({
      where: { id: data[0].quizId }, // assuming all rows are same quiz
    });

    if (!quizExists) {
      return new Response(JSON.stringify({ error: "Quiz does not exist" }), {
        status: 400,
      });
    }

    const validStudentIds = await prisma.classroomMember.findMany({
      where: { classroomId: data[0].classroomId },
      select: { userId: true },
    });

    const validIds = validStudentIds.map((s) => s.userId);

    for (const r of data) {
      if (!validIds.includes(r.studentId)) {
        return new Response(
          JSON.stringify({ error: `Student ${r.studentId} not in classroom` }),
          { status: 400 },
        );
      }
    }

    const operations = data.map((r: any) =>
      prisma.quizResult.upsert({
        where: {
          quizId_studentId: {
            quizId: r.quizId,
            studentId: r.studentId,
          },
        },
        update: {
          obtainedMarks: r.obtainedMarks,
          totalMarks: r.totalMarks,
          classroomId: r.classroomId,
        },
        create: {
          quizId: r.quizId,
          studentId: r.studentId,
          classroomId: r.classroomId,
          obtainedMarks: r.obtainedMarks,
          totalMarks: r.totalMarks,
        },
      }),
    );

    await prisma.$transaction(operations);

    return new Response(
      JSON.stringify({ message: "Quiz results saved successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("Error saving quiz results:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
