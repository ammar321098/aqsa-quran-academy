"use server";

import {
  TeacherQuizSchemaType,
  InAppQuizSchemaType,
  inAppQuizSchema,
  teacherQuizSchema,
} from "@/lib/zodSchema";
import { ApiResponse } from "@/lib/types";
import { prisma } from "@/lib/db";
import { requireTeacher } from "@/app/data/user/require-teacher";
import { Truck } from "lucide-react";

export async function CreateTeacherClassQuiz(
  data: TeacherQuizSchemaType & { type: "CLASSROOM" },
) {
  const session = await requireTeacher();

  // Normalize totalMarks to number | null
  const totalMarks =
    typeof data.totalMarks === "string"
      ? parseInt(data.totalMarks, 10) || null
      : (data.totalMarks ?? null);

  // Make sure classroomId and type are properly set
  if (!data.classroomId) {
    throw new Error("classroomId is required for CLASSROOM quizzes");
  }

  const quiz = await prisma.quiz.create({
    data: {
      title: data.title,
      type: "CLASSROOM", // explicitly set
      classroomId: data.classroomId, // must be non-null
      isPublished: true,

      slug: data.slug ?? null,
      smallDescription: data.smallDescription ?? null,
      description: data.description ?? null,
      thumbnailKey: data.thumbnailKey ?? null,
      totalMarks,
      googleFormUrl: data.googleFormUrl ?? null,

      courseId: null,
      chapterId: null,
    },
  });

  return { status: "success", message: "Quiz created", quiz };
}

/**
 * Create a classroom-specific quiz (Google Form or in-app with questions)
 */
export async function CreateTeacherClassQuizWithQuestions(
  data: TeacherQuizSchemaType &
    Partial<InAppQuizSchemaType> & { type: "CLASSROOM" },
): Promise<ApiResponse> {
  const session = await requireTeacher();
  if (!session) return { status: "error", message: "Unauthorized" };

  if (!data.classroomId) {
    return {
      status: "error",
      message: "classroomId is required for CLASSROOM quizzes",
    };
  }

  const totalMarks =
    typeof data.totalMarks === "string"
      ? parseInt(data.totalMarks, 10) || null
      : (data.totalMarks ?? null);

  // If questions are provided, validate them
  let questionsToCreate: typeof data.questions = [];
  if (data.questions && data.questions.length > 0) {
    const validation = inAppQuizSchema.safeParse(data);
    if (!validation.success) {
      const issues =
        "issues" in validation.error ? validation.error.issues : [];
      const message =
        (issues as { message: string }[]).map((e) => e.message).join(". ") ||
        "Invalid questions";
      return { status: "error", message };
    }
    questionsToCreate = validation.data.questions;
  }

  try {
    const quiz = await prisma.quiz.create({
      data: {
        title: data.title,
        type: "CLASSROOM",
        classroomId: data.classroomId,
        slug: data.slug ?? null,
        smallDescription: data.smallDescription ?? null,
        description: data.description ?? null,
        thumbnailKey: data.thumbnailKey ?? null,
        totalMarks,
        googleFormUrl: data.googleFormUrl ?? null,
        isPublished: data.isPublished ?? false,
        questions: questionsToCreate.length
          ? {
              create: questionsToCreate.map((q, qIndex) => {
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
            }
          : undefined,
      },
    });

    return {
      status: "success",
      message: "Classroom quiz created successfully",
    };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Failed to create classroom quiz" };
  }
}

// Check if any submissions exist
async function hasSubmissions(quizId: string) {
  const count = await prisma.quizSubmission.count({
    where: { quizId },
  });
  return count > 0;
}

export async function UpdateTeacherClassQuizWithQuestions(
  id: string,
  data: TeacherQuizSchemaType & { type: "CLASSROOM" },
) {
  const submitted = await hasSubmissions(id);

  if (submitted) {
    return {
      status: "error",
      message: "Students already submitted this quiz. Do not update it.",
    };
  }

  const validation = teacherQuizSchema.safeParse(data);

  if (!validation.success) {
    return { status: "error", message: "Invalid quiz data" };
  }

  const normalized = validation.data;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.quiz.update({
        where: { id },
        data: {
          title: normalized.title,
          slug: normalized.slug ?? null,
          smallDescription: normalized.smallDescription ?? null,
          description: normalized.description ?? null,
          thumbnailKey: normalized.thumbnailKey ?? null,
          totalMarks: normalized.totalMarks ?? null,
          isPublished: !!normalized.isPublished,
          type: "CLASSROOM",
          classroom: {
            connect: { id: normalized.classroomId },
          },
        },
      });

      await tx.quizQuestion.deleteMany({
        where: { quizId: id },
      });

      const questions = normalized.questions ?? [];

      const questionData = questions.map((q, index) => ({
        quizId: id,
        text: q.text,
        position: index,
        questionType: q.questionType,
      }));

      await tx.quizQuestion.createMany({
        data: questionData,
      });

      const insertedQuestions = await tx.quizQuestion.findMany({
        where: { quizId: id },
        orderBy: { position: "asc" },
        select: { id: true, position: true },
      });

      const optionRows: any[] = [];

      questions.forEach((q, qIndex) => {
        if (
          q.questionType === "SINGLE_CHOICE" ||
          q.questionType === "MULTIPLE_CHOICE"
        ) {
          const dbQuestion = insertedQuestions[qIndex];

          q.options
            ?.filter((o) => o.text.trim().length > 0)
            .forEach((o, oIndex) => {
              optionRows.push({
                questionId: dbQuestion.id,
                text: o.text,
                isCorrect: !!o.isCorrect,
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

    return {
      status: "success",
      message: "Quiz updated successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "Failed to update quiz",
    };
  }
}
