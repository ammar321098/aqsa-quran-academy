import { prisma } from "@/lib/db";
import ClassesClient from "./_components/ClassesClient";

export default async function ClassesPage() {
  const classes = await prisma.classroom.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      isActive: true,
      slug: true,
      teacher: {
        select: {
          image: true,
          departmentId: true,
          teacherProfile: {
            select: {
              fullName: true,
            },
          },
        },
      },
    },
  });

  return <ClassesClient classes={classes} />;
}
