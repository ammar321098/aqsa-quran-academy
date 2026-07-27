// app/dashboard/quiz/[quizId]/page.tsx (Server Component)
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { requireUser } from "@/app/data/user/require-user";
import QuizDashboardPage from "./_componnents/QuizDashboardPage";
import InAppQuizTake from "./_componnents/InAppQuizTake";
import QuizSubmittedView from "./_componnents/QuizSubmittedView";

export default async function Page({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const user = await requireUser();
  const { quizId } = await params;

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    select: {
      title: true,
      googleFormUrl: true,
      showCorrect: true,
      questions: {
        orderBy: { position: "asc" },
        include: {
          options: { orderBy: { position: "asc" } },
        },
      },
    },
  });

  if (!quiz) return notFound();

  // Google Form quiz - use existing flow
  if (quiz.googleFormUrl) {
    return (
      <QuizDashboardPage
        quizId={quizId}
        title={quiz.title}
        googleFormUrl={quiz.googleFormUrl}
      />
    );
  }

  // In-app quiz
  if (!quiz.questions?.length) {
    return (
      <div className="min-h-screen p-6">
        <h1 className="text-2xl font-bold mb-6">{quiz.title}</h1>
        <p className="text-muted-foreground">This quiz has no questions yet.</p>
      </div>
    );
  }

  // Check if user already submitted
  const [submission, quizResult] = await Promise.all([
    prisma.quizSubmission.findUnique({
      where: { quizId_userId: { quizId, userId: user.id } },
      select: { answers: true },
    }),
    prisma.quizResult.findUnique({
      where: {
        quizId_studentId: { quizId, studentId: user.id },
      },
      select: { obtainedMarks: true, totalMarks: true },
    }),
  ]);

  if (submission && quizResult) {
    const raw = submission.answers;
    const answers: Record<string, string | string[]> =
      raw && typeof raw === "object" && !Array.isArray(raw)
        ? (raw as Record<string, string | string[]>)
        : {};

    return (
      <div className="min-h-screen p-6">
        <QuizSubmittedView
          title={quiz.title}
          questions={quiz.questions}
          answers={answers}
          obtainedMarks={quizResult.obtainedMarks}
          totalMarks={quizResult.totalMarks}
          showCorrect={quiz.showCorrect}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <InAppQuizTake
        quizId={quizId}
        title={quiz.title}
        questions={quiz.questions}
      />
    </div>
  );
}
