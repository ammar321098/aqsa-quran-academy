import { requireStudent } from "@/app/data/user/requireStudent";
import { getStandaloneQuizzes } from "@/app/data/user/get-standalone-quizzes";
import { EmptyState } from "@/components/general/EmptyState";
import { QuizCard } from "./_components/QuizCard";

export default async function DashboardQuizzesPage() {
  await requireStudent();

  const quizzes = await getStandaloneQuizzes();

  return (
    <div className="space-y-6 px-4 lg:px-6">
      <div>
        <h1 className="text-3xl font-bold text-primary tracking-tight">
          Quizzes
        </h1>
        <p className="text-muted-foreground">
          Enroll in standalone quizzes and take them when you’re ready.
        </p>
      </div>

      <div className="h-px bg-border my-4" />

      {quizzes.length === 0 ? (
        <EmptyState
          title="No quizzes available"
          description="There are no standalone quizzes to enroll in yet."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      )}
    </div>
  );
}
