// app/api/teacher/classrooms/route.ts
import { prisma } from "@/lib/db";
import { requireUser } from "@/app/data/user/require-user";

export async function GET() {
  const user = await requireUser();

  // Only teachers/admins
  if (!user || user.role === "user" || user.role === "student") {
    return new Response(JSON.stringify([]), { status: 200 });
  }

  // Fetch classrooms for this teacher
  const classrooms = await prisma.classroom.findMany({
    where: { teacherId: user.id },
    include: {
      posts: {
        select: {
          id: true,
          title: true,
          quizes: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
    },
  });

  return new Response(JSON.stringify(classrooms), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
