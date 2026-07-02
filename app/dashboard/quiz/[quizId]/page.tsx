// app/dashboard/quiz/[quizId]/page.tsx (Server Component)
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import QuizDashboardPage from "./_componnents/QuizDashboardPage";

export default async function Page({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = await params;

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    select: { title: true, googleFormUrl: true },
  });

  if (!quiz) return notFound();

  return (
    <QuizDashboardPage
      quizId={quizId}
      title={quiz.title}
      googleFormUrl={quiz.googleFormUrl}
    />
  );
}
