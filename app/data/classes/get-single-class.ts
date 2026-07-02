import { prisma } from "@/lib/db";
import { CourseStatus } from "@prisma/client";
import { notFound } from "next/navigation";

export interface ClassroomData {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  isFree: boolean;
  status: CourseStatus;
  isActive: boolean;
  department?: { name: string | null } | null;
  teacher: { id: string; fullName: string | null; image: string | null };
  students: { id: string; fullName: string | null; image: string | null }[];
  posts: {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    author: { id: string; fullName: string | null; image: string | null };
    quizes: {
      id: string;
      title: string;
      url: string | null;
      submition: any[];
    }[];
    link?: string; // optional link for document/video
  }[];
}

export async function getClassroomById(
  classroomId: string,
  userId: string,
): Promise<ClassroomData> {
  if (!classroomId) notFound();

  const classroom = await prisma.classroom.findUnique({
    where: { id: classroomId },
    include: {
      department: { select: { name: true } },
      teacher: {
        select: {
          id: true,
          image: true,
          teacherProfile: { select: { fullName: true } },
        },
      },
      members: {
        include: {
          user: {
            select: {
              id: true,
              image: true,
              isStudent: true,
              studentProfile: { select: { fullName: true } },
            },
          },
        },
      },
      posts: {
        orderBy: { createdAt: "desc" },
        include: {
          quizes: {
            where: {
              isPublished: true,
            },
            select: {
              id: true,
              title: true,
              googleFormUrl: true,
              quizSubmissions: {
                where: {
                  userId,
                },
                select: {
                  id: true,
                },
              },
            },
          },
          author: {
            select: {
              id: true,
              image: true,
              teacherProfile: { select: { fullName: true } },
              studentProfile: { select: { fullName: true } },
            },
          },
        },
      },
    },
  });

  if (!classroom) notFound();

  // Flatten teacher
  const teacher = {
    id: classroom.teacher.id,
    fullName: classroom.teacher.teacherProfile?.fullName || null,
    image: classroom.teacher.image,
  };

  // Flatten students
  const students = classroom.members
    .filter((m) => m.user.isStudent)
    .map((m) => ({
      id: m.user.id,
      fullName: m.user.studentProfile?.fullName || null,
      image: m.user.image,
    }));

  // Flatten posts with author name and quizzes
  const posts = classroom.posts.map((p) => ({
    id: p.id,
    title: p.title,
    content: p.content,
    createdAt: p.createdAt,
    link: p.link ?? undefined,
    author: {
      id: p.author.id,
      fullName:
        p.author.teacherProfile?.fullName ||
        p.author.studentProfile?.fullName ||
        null,
      image: p.author.image,
    },
    quizes: p.quizes.map((q) => ({
      id: q.id,
      title: q.title,
      url: q.googleFormUrl,
      submition: q.quizSubmissions, // only submissions by current user
    })),
  }));

  return {
    id: classroom.id,
    title: classroom.title,
    slug: classroom.slug,
    description: classroom.description,
    price: classroom.price,
    isFree: classroom.isFree,
    status: classroom.status,
    isActive: classroom.isActive,
    department: classroom.department,
    teacher,
    students,
    posts,
  };
}
