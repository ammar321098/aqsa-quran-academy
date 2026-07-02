import "server-only";

import { getAllCourses } from "@/app/data/course/get-all-courses";
import { getAllClasses } from "@/app/data/classes/get-all-classes";
import { getStandaloneQuizzes } from "@/app/data/user/get-standalone-quizzes";

export type LearningItem =
  | {
      type: "course";
      id: string;
      title: string;
      slug: string;
      fileKey: string;
      duration: number;
      level: string;
      price: number;
      isFree: boolean;
      createdAt: Date;
    }
  | {
      type: "class";
      id: string;
      title: string;
      slug: string;
      description: string | null;
      isActive: boolean;
      teacher?: {
        image: string | null;
        teacherProfile?: { fullName: string | null } | null;
      } | null;
      createdAt: Date;
    }
  | {
      type: "quiz";
      id: string;
      title: string;
      smallDescription: string | null;
      thumbnailKey: string | null;
      createdAt: Date;
    };

export async function getRecentLearningItems(limit = 6): Promise<LearningItem[]> {
  const [courses, classes, quizzes] = await Promise.all([
    getAllCourses(),
    getAllClasses(),
    getStandaloneQuizzes(),
  ]);

  const items: LearningItem[] = [
    ...courses.map((c) => ({
      type: "course" as const,
      id: c.id,
      title: c.title,
      slug: c.slug,
      fileKey: c.fileKey,
      duration: c.duration,
      level: c.level,
      price: c.price,
      isFree: c.isFree,
      createdAt: c.createdAt,
    })),
    ...classes.map((c) => ({
      type: "class" as const,
      id: c.id,
      title: c.title,
      slug: c.slug,
      description: c.description,
      isActive: c.isActive,
      teacher: c.teacher,
      createdAt: c.createdAt,
    })),
    ...quizzes.map((q) => ({
      type: "quiz" as const,
      id: q.id,
      title: q.title,
      smallDescription: q.smallDescription,
      thumbnailKey: q.thumbnailKey,
      createdAt: q.createdAt,
    })),
  ];

  items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return items.slice(0, limit);
}
