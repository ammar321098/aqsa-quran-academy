import { prisma } from "@/lib/db";
import { requireUser } from "@/app/data/user/require-user";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireUser();

  if (!user || user.role === "user" || user.role === "student") {
    return new Response(JSON.stringify([]), { status: 200 });
  }

  // Must await params because Next.js passes it as a Promise
  const { id } = await params;

  const quizzes = await prisma.quiz.findMany({
    where: {
      type: "CLASSROOM",
      classroomPost: {
        is: {
          classroomId: id,
        },
      },
    },
    select: { id: true, title: true },
  });

  return new Response(JSON.stringify(quizzes), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
