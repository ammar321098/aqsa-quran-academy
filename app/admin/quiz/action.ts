"use server";

import { prisma } from "@/lib/db";
import { requireAdminOrTeacher } from "@/app/data/admin/require-admin-or-teacher";
import { ApiResponse } from "@/lib/types";
import {
  quizSchema,
  QuizSchemaType,
  inAppQuizSchema,
  InAppQuizSchemaType,
} from "@/lib/zodSchema";
import { revalidatePath } from "next/cache";

export async function CreateQuiz(data: QuizSchemaType): Promise<ApiResponse> {
  const session = await requireAdminOrTeacher();

  if (!session) {
    return {
      status: "error",
      message: "Unauthorized",
    };
  }

  const validation = quizSchema.safeParse(data);

  if (!validation.success) {
    return {
      status: "error",
      message: "Invalid quiz data",
    };
  }

  const {
    title,
    googleFormUrl,
    type,
    courseId,
    chapterId,
    slug,
    smallDescription,
    description,
    thumbnailKey,
    totalMarks,
  } = validation.data;

  if (type === "CHAPTER" && !chapterId) {
    return {
      status: "error",
      message: "Chapter is required for chapter quiz",
    };
  }

  const isStandalone = type === "STANDALONE";
  const slugValue =
    isStandalone && slug?.trim() ? slug.trim().toLowerCase() : null;

  if (isStandalone && slugValue) {
    const existing = await prisma.quiz.findUnique({
      where: { slug: slugValue },
    });
    if (existing) {
      return {
        status: "error",
        message:
          "A quiz with this slug already exists. Choose a different slug.",
      };
    }
  }

  try {
    await prisma.quiz.create({
      data: {
        title,
        slug: slugValue,
        googleFormUrl,
        type,
        courseId: isStandalone ? null : (courseId ?? null),
        chapterId: type === "CHAPTER" ? (chapterId ?? null) : null,
        smallDescription: isStandalone ? (smallDescription ?? null) : null,
        description: isStandalone ? (description ?? null) : null,
        thumbnailKey: isStandalone ? (thumbnailKey ?? null) : null,
        totalMarks: totalMarks ?? null,
        isPublished: true,
      },
    });

    return {
      status: "success",
      message: "Quiz created successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "Failed to create quiz",
    };
  }
}

export async function CreateInAppQuiz(
  data: InAppQuizSchemaType,
): Promise<ApiResponse> {
  await requireAdminOrTeacher();

  const validation = inAppQuizSchema.safeParse(data);
  if (!validation.success) {
    const issues = "issues" in validation.error ? validation.error.issues : [];
    const message =
      (issues as { message: string }[]).map((e) => e.message).join(". ") ||
      "Invalid data";
    return { status: "error", message };
  }

  const {
    title,
    type,
    courseId,
    chapterId,
    slug,
    questions,
    smallDescription,
    description,
    thumbnailKey,
    totalMarks,
    isPublished,
  } = validation.data;
  if (type === "CHAPTER" && !chapterId) {
    return { status: "error", message: "Chapter is required for chapter quiz" };
  }

  const isStandalone = type === "STANDALONE";
  const slugValue =
    isStandalone && slug?.trim() ? slug.trim().toLowerCase() : null;

  if (isStandalone && slugValue) {
    const existing = await prisma.quiz.findUnique({
      where: { slug: slugValue },
    });
    if (existing) {
      return {
        status: "error",
        message:
          "A quiz with this slug already exists. Choose a different slug.",
      };
    }
  }

  try {
    const courseConnect =
      !isStandalone && courseId ? { connect: { id: courseId } } : undefined;
    const chapterConnect =
      type === "CHAPTER" && chapterId
        ? { connect: { id: chapterId } }
        : undefined;
    await prisma.quiz.create({
      data: {
        title,
        slug: slugValue,
        googleFormUrl: null,
        type,
        ...(courseConnect && { course: courseConnect }),
        ...(chapterConnect && { chapter: chapterConnect }),
        smallDescription: isStandalone ? (smallDescription ?? null) : null,
        description: isStandalone ? (description ?? null) : null,
        thumbnailKey: isStandalone ? (thumbnailKey ?? null) : null,
        totalMarks: totalMarks ?? null,
        isPublished: isPublished ?? false,
        questions: {
          create: questions.map((q, qIndex) => {
            const hasOptions =
              q.questionType === "SINGLE_CHOICE" ||
              q.questionType === "MULTIPLE_CHOICE";
            const options = hasOptions
              ? q.options.filter((o) => o.text.trim().length > 0)
              : [];
            return {
              text: q.text,
              position: qIndex,
              questionType: q.questionType,
              options: {
                create: options.map((o, oIndex) => ({
                  text: o.text,
                  isCorrect: o.isCorrect,
                  position: oIndex,
                })),
              },
            };
          }),
        },
      },
    });
    return { status: "success", message: "Quiz created successfully" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Failed to create quiz" };
  }
}

export async function deleteQuiz(quizId: string) {
  try {
    await prisma.quiz.delete({
      where: { id: quizId },
    });

    revalidatePath("/admin/quizzes");

    return { status: "success", message: "Quiz deleted successfully" };
  } catch (error) {
    return { status: "error", message: "Failed to delete quiz" };
  }
}

export async function toggleQuizStatus(quizId: string) {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      select: { isPublished: true },
    });

    if (!quiz) {
      return { status: "error", message: "Quiz not found" };
    }

    await prisma.quiz.update({
      where: { id: quizId },
      data: { isPublished: !quiz.isPublished },
    });

    revalidatePath("/admin/quizzes");

    return {
      status: "success",
      message: quiz.isPublished ? "Quiz moved to Inactive" : "Quiz Published",
    };
  } catch {
    return { status: "error", message: "Failed to update status" };
  }
}

// Check if any submissions exist
async function hasSubmissions(quizId: string) {
  const count = await prisma.quizSubmission.count({
    where: { quizId },
  });
  return count > 0;
}

//  UPDATE ANY QUIZ
export async function UpdateQuiz(id: string, data: QuizSchemaType) {
  // Check if any student has submitted this quiz
  const submitted = await hasSubmissions(id);
  if (submitted) {
    return {
      status: "error",
      message: "Students already submitted this quiz. Do not update it.",
    };
  }

  // Normalize empty strings and type logic
  const normalized = { ...data };
  normalized.courseId = normalized.courseId || undefined;
  normalized.chapterId = normalized.chapterId || undefined;

  if (normalized.type === "STANDALONE") {
    normalized.courseId = undefined;
    normalized.chapterId = undefined;
  }

  if (normalized.type === "COURSE") {
    normalized.chapterId = undefined;
  }

  if (normalized.type === "CHAPTER" && !normalized.courseId) {
    throw new Error("Chapter quiz must have a courseId");
  }

  await prisma.quiz.update({
    where: { id },
    data: normalized,
  });

  return { status: "success", message: "Quiz updated successfully" };
}

//   UPDATE IN-APP QUIZ
export async function UpdateInAppQuiz(id: string, data: InAppQuizSchemaType) {
  const submitted = await hasSubmissions(id);
  if (submitted) {
    return {
      status: "error",
      message: "Students already submitted this quiz. Do not update it.",
    };
  }

  const validation = inAppQuizSchema.safeParse(data);
  if (!validation.success) {
    return { status: "error", message: "Invalid quiz data" };
  }

  const normalized = validation.data;

  if (normalized.type === "STANDALONE") {
    normalized.courseId = undefined;
    normalized.chapterId = undefined;
  }
  if (normalized.type === "COURSE") normalized.chapterId = undefined;
  if (normalized.type === "CHAPTER" && !normalized.courseId) {
    throw new Error("Chapter quiz must have a courseId");
  }

  try {
    await prisma.$transaction(async (tx) => {

      /*   Update Quiz   */
      await tx.quiz.update({
        where: { id },
        data: {
          title: normalized.title,
          type: normalized.type,
          totalMarks: normalized.totalMarks ?? null,
          slug: normalized.slug ?? null,
          smallDescription: normalized.smallDescription ?? null,
          description: normalized.description ?? null,
          thumbnailKey: normalized.thumbnailKey ?? null,
          isPublished: !!normalized.isPublished,
          course: normalized.courseId
            ? { connect: { id: normalized.courseId } }
            : { disconnect: true },
          chapter: normalized.chapterId
            ? { connect: { id: normalized.chapterId } }
            : { disconnect: true },
        },
      });

      /*   Delete old   */
      await tx.quizQuestion.deleteMany({
        where: { quizId: id },
      });

      /*   Prepare Questions   */
      const questionData = normalized.questions.map((q, index) => ({
        quizId: id,
        text: q.text,
        position: index,
        questionType: q.questionType,
      }));

      await tx.quizQuestion.createMany({
        data: questionData,
      });

      /*  Fetch inserted questions (single query)  */
      const insertedQuestions = await tx.quizQuestion.findMany({
        where: { quizId: id },
        orderBy: { position: "asc" },
        select: { id: true, position: true },
      });

      /*   Prepare Options   */
      const optionRows: any[] = [];

      normalized.questions.forEach((q, qIndex) => {
        if (
          q.questionType === "SINGLE_CHOICE" ||
          q.questionType === "MULTIPLE_CHOICE"
        ) {
          const dbQuestion = insertedQuestions[qIndex];

          q.options
            .filter((o) => o.text.trim().length > 0)
            .forEach((o, oIndex) => {
              optionRows.push({
                questionId: dbQuestion.id,
                text: o.text,
                isCorrect: o.isCorrect,
                position: oIndex,
              });
            });
        }
      });

      if (optionRows.length > 0) {
        await tx.quizOption.createMany({
          data: optionRows,
        });
      }
    });

    return { status: "success", message: "Quiz updated successfully" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Failed to update quiz" };
  }
}
