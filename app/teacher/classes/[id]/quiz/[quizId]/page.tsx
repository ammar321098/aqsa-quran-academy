import { getQuizForEdit } from "@/app/data/admin/get-quiz";
import CommingSoon from "@/components/general/CommingSoon";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TeacherClassQuizForm } from "../_components/TeacherQuizForm";
import { mapTeacherQuizToForm } from "@/app/data/admin/mapper";

export default async function TeacherQuizEditPage({
  params,
}: {
  params: Promise<{ quizId: string; id: string }>;
}) {
  const { id } = await params;
  const { quizId } = await params;
  const quiz = await getQuizForEdit(quizId);
  if (!quiz) return notFound();

  const isInAppQuiz = quiz.questions.length > 0;

  return (
    <div className="px-4 lg:px-6 space-y-6">
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Link
            href={`/teacher/classes/${id}/quiz`}
            className={buttonVariants({
              variant: "outline",
              size: "icon-sm",
            })}
          >
            <ArrowLeftIcon className="size-4" />
          </Link>
          <h1 className="text-2xl">Edit Quiz</h1>
        </div>
      </div>
      {isInAppQuiz ? (
        <TeacherClassQuizForm
          initialData={mapTeacherQuizToForm(quiz)}
          classroomId={id}
        />
      ) : (
        <CommingSoon />
      )}
    </div>
  );
}
