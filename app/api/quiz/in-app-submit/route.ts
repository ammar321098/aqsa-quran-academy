import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireUser } from "@/app/data/user/require-user";

type AnswerPayload = Record<string, string | string[]>;

export async function POST(req: Request) {
  const user = await requireUser();
  const { quizId, answers } = (await req.json()) as {
    quizId: string;
    answers: AnswerPayload;
  };

  if (!quizId || !answers) {
    return Response.json(
      { error: "quizId and answers required" },
      { status: 400 },
    );
  }

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    select: {
      id: true,
      type: true,
      courseId: true,
      classroomId: true,
      googleFormUrl: true,
      totalMarks: true,
      questions: {
        orderBy: { position: "asc" },
        include: { options: true },
      },
    },
  });

  if (!quiz) return Response.json({ error: "Quiz not found" }, { status: 404 });
  if (quiz.googleFormUrl) {
    return Response.json(
      { error: "This is a Google Form quiz" },
      { status: 400 },
    );
  }

  // Check enrollment for standalone
  if (quiz.type === "STANDALONE") {
    const enrolment = await prisma.quizEnrolment.findUnique({
      where: { quizId_userId: { quizId, userId: user.id } },
    });
    if (!enrolment) {
      return Response.json(
        { error: "Enroll in this quiz first" },
        { status: 403 },
      );
    }
  } else if (quiz.courseId) {
    const enrolled = await prisma.enrolment.findFirst({
      where: { userId: user.id, courseId: quiz.courseId },
    });
    if (!enrolled) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }
  } else if (quiz.classroomId) {
    const enrolled = await prisma.enrolment.findFirst({
      where: { userId: user.id, classroomId: quiz.classroomId },
    });
    if (!enrolled) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }
  } else {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const existingSubmission = await prisma.quizSubmission.findUnique({
    where: { quizId_userId: { quizId, userId: user.id } },
  });
  if (existingSubmission) {
    return Response.json(
      { error: "Already attempted", obtainedMarks: null },
      { status: 409 },
    );
  }

  let rawObtained = 0;
  let totalChoiceQuestions = 0;

  for (const q of quiz.questions) {
    const hasOptions =
      q.questionType === "SINGLE_CHOICE" ||
      q.questionType === "MULTIPLE_CHOICE";
    if (!hasOptions) continue;

    totalChoiceQuestions += 1;
    const correctOptionIds = q.options
      .filter((o) => o.isCorrect)
      .map((o) => o.id);

    const userAnswer = answers[q.id];
    if (!userAnswer) continue;

    if (q.questionType === "SINGLE_CHOICE") {
      const selected =
        typeof userAnswer === "string" ? userAnswer : userAnswer[0];
      if (correctOptionIds.length === 1 && selected === correctOptionIds[0]) {
        rawObtained += 1;
      }
    } else {
      const selected = Array.isArray(userAnswer)
        ? userAnswer
        : [userAnswer as string];
      const correctSet = new Set(correctOptionIds);
      const selectedSet = new Set(selected);
      if (
        correctSet.size === selectedSet.size &&
        [...correctSet].every((id) => selectedSet.has(id))
      ) {
        rawObtained += 1;
      }
    }
  }

  const totalMarksForResult =
    quiz.totalMarks && quiz.totalMarks >= 1
      ? quiz.totalMarks
      : totalChoiceQuestions;
  const obtainedMarksForResult =
    quiz.totalMarks && quiz.totalMarks >= 1 && totalChoiceQuestions > 0
      ? Math.round((rawObtained / totalChoiceQuestions) * quiz.totalMarks)
      : rawObtained;

  // Ensure plain JSON-serializable object for Prisma Json field
  const answersToStore = JSON.parse(
    JSON.stringify(answers),
  ) as Prisma.InputJsonValue;

  await prisma.$transaction([
    prisma.quizSubmission.create({
      data: { quizId, userId: user.id, answers: answersToStore },
    }),
    prisma.quizResult.create({
      data: {
        quizId,
        studentId: user.id,
        totalMarks: totalMarksForResult,
        obtainedMarks: obtainedMarksForResult,
        classroomId: null,
      },
    }),
  ]);

  return Response.json({
    success: true,
    obtainedMarks: obtainedMarksForResult,
    totalMarks: totalMarksForResult,
  });
}
