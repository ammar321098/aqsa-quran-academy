import { requireAdminOrTeacher } from "@/app/data/admin/require-admin-or-teacher";
import { getSubmissionForGrading } from "@/app/data/admin/get-submission-for-grading";
import { SubmissionGradingView } from "./_components/SubmissionGradingView";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { notFound } from "next/navigation";

export default async function AdminSubmissionGradingPage({
  params,
}: {
  params: Promise<{ quizId: string; userId: string }>;
}) {
  await requireAdminOrTeacher();
  const { quizId, userId } = await params;
  const data = await getSubmissionForGrading(quizId, userId);

  if (!data) notFound();

  return (
    <div className="space-y-6 px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/admin/quiz/${quizId}/results`}
          className={buttonVariants({ variant: "outline", size: "icon-sm" })}
        >
          <ArrowLeftIcon className="size-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            Grade: {data.student.name || data.student.email || "Student"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {data.quiz.title} · {data.student.email || "—"}
            {data.student.rollNumber && ` · Roll: ${data.student.rollNumber}`}
          </p>
        </div>
      </div>
      <div className="h-px bg-border" />

      <SubmissionGradingView data={data} />
    </div>
  );
}
