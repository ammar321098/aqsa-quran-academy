import { InAppQuizSchemaType, TeacherQuizSchemaType } from "@/lib/zodSchema";

export function mapQuizToInAppForm(
  quiz: any,
): InAppQuizSchemaType & { id: string } {
  return {
    id: quiz.id,
    title: quiz.title ?? "",
    type: quiz.type ?? "CHAPTER",
    courseId: quiz.courseId ?? "",
    chapterId: quiz.chapterId ?? "",
    slug: quiz.slug ?? "",
    smallDescription: quiz.smallDescription ?? "",
    description: quiz.description ?? "",
    thumbnailKey: quiz.thumbnailKey ?? "",
    totalMarks: quiz.totalMarks ?? undefined,
    isPublished: Boolean(quiz.isPublished),

    questions:
      quiz.questions?.map((q: any) => ({
        text: q.text,
        questionType: q.questionType,
        options:
          q.options?.map((o: any) => ({
            text: o.text,
            isCorrect: o.isCorrect,
          })) ?? [],
      })) ?? [],
  };
}

export function mapTeacherQuizToForm(
  quiz: any,
): TeacherQuizSchemaType & { id: string } {
  return {
    id: quiz.id,
    title: quiz.title ?? "",
    classroomId: quiz.classroomId ?? "",
    slug: quiz.slug ?? "",
    smallDescription: quiz.smallDescription ?? "",
    description: quiz.description ?? "",
    thumbnailKey: quiz.thumbnailKey ?? "",
    totalMarks: quiz.totalMarks ?? undefined,
    isPublished: Boolean(quiz.isPublished),

    questions:
      quiz.questions?.map((q: any) => ({
        text: q.text ?? "",
        questionType: q.questionType,
        options:
          q.options?.map((o: any) => ({
            text: o.text ?? "",
            isCorrect: Boolean(o.isCorrect),
          })) ?? [],
      })) ?? [],
  };
}
