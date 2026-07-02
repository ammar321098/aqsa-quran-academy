import "server-only";
import { prisma } from "@/lib/db";
import { requireAdminOrTeacher } from "@/app/data/admin/require-admin-or-teacher";
import { requireTeacher } from "../user/require-teacher";

export type TeacherQuizRow = {
  id: string;
  title: string;
  googleFormUrl: string | null;
  type: string;
  isPublished: boolean;
  course: { id: string; title: string } | null;
  chapter: { id: string; title: string } | null;
  classroom: { id: string; title: string } | null;
};

export async function getQuizzesForTeacher(
  classroomId: string,
): Promise<TeacherQuizRow[]> {
  const user = await requireTeacher();

  // Verify the classroom exists and belongs to this teacher (or user is admin)
  const classroom = await prisma.classroom.findFirst({
    where: {
      id: classroomId,
      teacherId: user.id,
    },
    select: { id: true },
  });

  if (!classroom) {
    // Admin might access any classroom - check if user is admin
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });
    if (dbUser?.role !== "admin") {
      return [];
    }
    // For admin, verify classroom exists
    const anyClassroom = await prisma.classroom.findUnique({
      where: { id: classroomId },
      select: { id: true },
    });
    if (!anyClassroom) return [];
  }

  const quizzes = await prisma.quiz.findMany({
    where: {
      type: "CLASSROOM",
      OR: [{ classroomId }, { classroomPost: { classroomId } }],
    },
    select: {
      id: true,
      title: true,
      googleFormUrl: true,
      type: true,
      isPublished: true,
      course: {
        select: { id: true, title: true },
      },
      chapter: {
        select: { id: true, title: true },
      },
      classroom: {
        select: { id: true, title: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return quizzes.map((q) => ({
    id: q.id,
    title: q.title,
    googleFormUrl: q.googleFormUrl,
    type: q.type,
    isPublished: q.isPublished,
    course: q.course,
    chapter: q.chapter,
    classroom: q.classroom,
  }));
}
