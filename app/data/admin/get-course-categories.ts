import "server-only";
import { prisma } from "@/lib/db";

const DEFAULT_CATEGORIES = [] as const;

export async function getCourseCategories(): Promise<{ id: string; name: string }[]> {
  const list = await prisma.courseCategory.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  if (list.length === 0) {
    await prisma.courseCategory.createMany({
      data: DEFAULT_CATEGORIES.map((name) => ({ name })),
    });
    return (await prisma.courseCategory.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    })) as { id: string; name: string }[];
  }

  return list as { id: string; name: string }[];
}
