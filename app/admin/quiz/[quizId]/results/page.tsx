import { requireAdminOrTeacher } from "@/app/data/admin/require-admin-or-teacher";
import { getQuizResults } from "@/app/data/admin/get-quiz-results";
import { QuizResultsTable } from "./_components/QuizResultsTable";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { ShowCorrectButton } from "./_components/ShowCorrectButton";

export default async function AdminQuizResultsPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  await requireAdminOrTeacher();
  const { quizId } = await params;
  const data = await getQuizResults(quizId);

  if (!data) notFound();

  return (
    <div className="space-y-6 px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/quiz"
          className={buttonVariants({ variant: "outline", size: "icon-sm" })}
        >
          <ArrowLeftIcon className="size-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            Quiz results: {data.quiz.title}
          </h1>
          <p className="text-muted-foreground text-sm">
            {data.quiz.type === "STANDALONE"
              ? "Standalone quiz"
              : data.quiz.courseTitle
                ? `${data.quiz.courseTitle}${data.quiz.chapterTitle ? ` / ${data.quiz.chapterTitle}` : ""}`
                : "Course quiz"}{" "}
            · {data.results.length} submission
            {data.results.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
      <div className="h-px bg-border" />
      <div className="flex justify-end mb-4">
        <ShowCorrectButton
          quizId={data.quiz.id}
          initialState={data.quiz.showCorrect}
        />
      </div>

      <QuizResultsTable quiz={data.quiz} results={data.results} />
    </div>
  );
}
