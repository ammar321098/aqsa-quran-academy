"use server";

import { prisma } from "@/lib/db";
import { classPostSchema } from "@/lib/zodSchema";
import { revalidatePath } from "next/cache";
import { requireTeacher } from "@/app/data/user/require-teacher";

export async function createClassPost(values: unknown) {
  try {
    const user = await requireTeacher();
    const data = classPostSchema.parse(values);

    const post = await prisma.classroomPost.create({
      data: {
        title: data.title,
        content: data.content,
        classroomId: data.classId,
        authorId: user.id,

        // only for document/video
        link: data.type === "quiz" ? undefined : data.link || "",
      },
    });

    // ⭐ CONNECT EXISTING QUIZ INSTEAD OF CREATING NEW ONE
    if (data.type === "quiz" && data.quizId) {
      await prisma.quiz.update({
        where: { id: data.quizId },
        data: {
          classroomPostId: post.id,
          isPublished: true,
        },
      });
    }

    revalidatePath(`/teacher/classes/${data.classId}`);

    return {
      success: true,
      message: "Announcement posted successfully",
    };
  } catch (error) {
    console.error("CREATE_CLASS_POST_ERROR", error);

    return {
      success: false,
      message: "Failed to post announcement",
    };
  }
}
