import { prisma } from "@/lib/db";
import { requireUser } from "@/app/data/user/require-user";

export async function POST(req: Request) {
  const user = await requireUser();
  const { quizId } = await req.json();

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
  });

  if (!quiz) return new Response("Quiz not found", { status: 404 });

  // Enrollment check
  const enrolled = await prisma.enrolment.findFirst({
    where: {
      userId: user.id,
      courseId: quiz.courseId,
    },
  });

  if (!enrolled) return new Response("Forbidden", { status: 403 });

  // Already attempted?
  const alreadyTaken = await prisma.quizSubmission.findUnique({
    where: {
      quizId_userId: {
        quizId,
        userId: user.id,
      },
    },
  });

  if (alreadyTaken) {
    return new Response("Already attempted", { status: 409 });
  }

  // Create submission BEFORE redirect
  await prisma.quizSubmission.create({
    data: {
      quizId,
      userId: user.id,
    },
  });

  return Response.json({
    redirectUrl: quiz.googleFormUrl,
  });
}
