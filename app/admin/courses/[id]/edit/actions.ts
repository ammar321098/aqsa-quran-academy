"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import {
  chapterSchema,
  ChapterSchemaType,
  courseSchema,
  CourseSchemaType,
  lessonSchema,
  LessonSchemaType,
} from "@/lib/zodSchema";
import { revalidatePath } from "next/cache";

export async function editCourse(
  data: CourseSchemaType,
  id: string
): Promise<ApiResponse> {
  const user = await requireAdmin();

  try {
    if (!user) {
      return { status: "error", message: "User not authenticated" };
    }

    const result = courseSchema.safeParse(data);
    if (!result.success) {
      return { status: "error", message: "Invalid data" };
    }

    const existingCourse = await prisma.course.findFirst({
      where: { id, userId: user.user.id },
    });

    if (!existingCourse) {
      return { status: "error", message: "Course not found" };
    }

    const { needsToWorkOn, ...rest } = result.data;
    await prisma.course.update({
      where: { id, userId: user.user.id },
      data: {
        ...rest,
        needsToWorkOn: needsToWorkOn ?? null,
      },
    });

    return { status: "success", message: "Course updated successfully" };
  } catch (error) {
    console.error("EDIT COURSE ERROR:", error);
    return { status: "error", message: "Failed to update the course" };
  }
}

export async function reorderLessons(
  chapterId: string,
  lessons: { id: string; position: number }[],
  courseId: string
): Promise<ApiResponse> {
  const user = await requireAdmin();

  try {
    if (!user) {
      return {
        status: "error",
        message: "User not authenticated",
      };
    }

    if (!lessons || lessons.length === 0) {
      return {
        status: "error",
        message: "No lessons provided for reordering",
      };
    }

    const updates = lessons.map((lesson) =>
      prisma.lesson.update({
        where: {
          id: lesson.id,
        },
        data: {
          position: lesson.position,
        },
      })
    );

    await prisma.$transaction(updates);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Lessons reordered successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to reorder lessons",
    };
  }
}

export async function reorderChapters(
  courseId: string,
  chapters: { id: string; position: number }[]
): Promise<ApiResponse> {
  const user = await requireAdmin();

  try {
    if (!user) {
      return {
        status: "error",
        message: "User not authenticated",
      };
    }

    if (!chapters || chapters.length === 0) {
      return {
        status: "error",
        message: "No chapters provided for reordering",
      };
    }

    const updates = chapters.map((chapter) =>
      prisma.chapter.update({
        where: { id: chapter.id },
        data: {
          position: chapter.position,
        },
      })
    );

    await prisma.$transaction(updates);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Chapters reordered successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed ti reorder chapters",
    };
  }
}

export async function createChapter(
  values: ChapterSchemaType
): Promise<ApiResponse> {
  await requireAdmin();
  try {
    const result = chapterSchema.safeParse(values);

    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    await prisma.$transaction(async (tx: any) => {
      const maxPos = await tx.chapter.findFirst({
        where: {
          courseId: result.data.courseId,
        },
        select: {
          position: true,
        },
        orderBy: {
          position: "desc",
        },
      });

      await tx.chapter.create({
        data: {
          title: result.data.name,
          courseId: result.data.courseId,
          position: (maxPos?.position ?? 0) + 1,
        },
      });
    });

    revalidatePath(`/admin/courses/${result.data.courseId}/edit`);

    return {
      status: "success",
      message: "Chapter created successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Faild to create chapter",
    };
  }
}

export async function createLesson(
  values: LessonSchemaType
): Promise<ApiResponse> {
  await requireAdmin();
  try {
    const result = lessonSchema.safeParse(values);

    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    await prisma.$transaction(async (tx: any) => {
      const maxPos = await tx.lesson.findFirst({
        where: {
          chapterId: result.data.chapterId,
        },
        select: {
          position: true,
        },
        orderBy: {
          position: "desc",
        },
      });

      await tx.lesson.create({
        data: {
          title: result.data.name,
          description: result.data.description || "",
          thumbnailKey: result.data.thumbnailKey || "",
          videoKey: result.data.videoKey || "",
          chapterId: result.data.chapterId,
          position: (maxPos?.position ?? 0) + 1,
        },
      });
    });

    revalidatePath(`/admin/courses/${result.data.courseId}/edit`);

    return {
      status: "success",
      message: "Lesson created successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Faild to create lesson",
    };
  }
}

export async function deleteLesson({
  chapterId,
  courseId,
  lessonId,
}: {
  chapterId: string;
  courseId: string;
  lessonId: string;
}): Promise<ApiResponse> {
  await requireAdmin();
  try {
    const chapterWithLessons = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
      },
      select: {
        lessons: {
          orderBy: {
            position: "asc",
          },
          select: {
            id: true,
            position: true,
          },
        },
      },
    });

    if (!chapterWithLessons) {
      return {
        status: "error",
        message: "Chapter not found",
      };
    }

    const lessons = chapterWithLessons.lessons;
    const lessonToDelete = lessons.find((lesson: any) => lesson.id === lessonId);
    if (!lessonToDelete) {
      return {
        status: "error",
        message: "Lesson not found in the chapter",
      };
    }

    const remainingLessons = lessons.filter((lesson: any) => lesson.id !== lessonId);
    const updates = remainingLessons.map((lesson: any, index: number) => {
      return prisma.lesson.update({
        where: { id: lesson.id },
        data: { position: index + 1 },
      });
    });

    await prisma.$transaction([
      ...updates,
      prisma.lesson.delete({
        where: {
          id: lessonId,
          chapterId,
        },
      }),
    ]);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Lesson deleted successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to delete lesson",
    };
  }
}

export async function deleteChapter({
  chapterId,
  courseId,
}: {
  chapterId: string;
  courseId: string;
}): Promise<ApiResponse> {
  await requireAdmin();
  try {
    const courseWithChapters = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        chapters: {
          orderBy: {
            position: "asc",
          },
          select: {
            id: true,
            position: true,
          },
        },
      },
    });

    if (!courseWithChapters) {
      return {
        status: "error",
        message: "Copurse not found",
      };
    }

    const chapters = courseWithChapters.chapters;
    const chapterToDelete = chapters.find(
      (chapter: any) => chapter.id === chapterId
    );
    if (!chapterToDelete) {
      return {
        status: "error",
        message: "Chapter not found in the course",
      };
    }

    const remainingChapters = chapters.filter(
      (chapter: any) => chapter.id !== chapterId
    );
    const updates = remainingChapters.map((chapter: any, index: number) => {
      return prisma.chapter.update({
        where: { id: chapter.id },
        data: { position: index + 1 },
      });
    });

    await prisma.$transaction([
      ...updates,
      prisma.chapter.delete({
        where: {
          id: chapterId,
        },
      }),
    ]);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Chapter deleted successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to delete chapter",
    };
  }
}
