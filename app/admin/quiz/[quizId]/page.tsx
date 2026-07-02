import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { InAppQuizForm } from "../_components/InAppQuizForm";
import { mapQuizToInAppForm } from "@/app/data/admin/mapper";
import { getQuizForEdit } from "@/app/data/admin/get-quiz";
import { getAllCourses } from "@/app/data/course/get-all-courses";
import { GoogleFormQuizForm } from "../_components/GoogleQuizForm";

export default async function QuizEditPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = await params;
  const quiz = await getQuizForEdit(quizId);
  if (!quiz) return notFound();

  const isInAppQuiz = quiz.questions.length > 0;

  // fetch courses for GoogleFormQuizForm
  const courses = await getAllCourses();

  const googleQuizData = {
    id: quiz.id,
    title: quiz.title,
    googleFormUrl: quiz.googleFormUrl ?? "",
    type: quiz.type,
    totalMarks: quiz.totalMarks ?? undefined,
    courseId: quiz.courseId ?? "",
    chapterId: quiz.chapterId ?? "",
    slug: quiz.slug ?? "",
    smallDescription: quiz.smallDescription ?? "",
    description: quiz.description ?? "",
    thumbnailKey: quiz.thumbnailKey ?? "",
  };

  return (
    <div className="px-4 lg:px-6 space-y-6">
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Link
            href="/admin/quiz"
            className={buttonVariants({ variant: "outline", size: "icon-sm" })}
          >
            <ArrowLeftIcon className="size-4" />
          </Link>
          <h1 className="text-2xl font-semibold">Edit Quiz — {quiz.title}</h1>
        </div>
      </div>

      {isInAppQuiz ? (
        <InAppQuizForm initialData={mapQuizToInAppForm(quiz)} />
      ) : (
        <GoogleFormQuizForm initialData={googleQuizData} courses={courses} />
      )}
    </div>
  );
}
