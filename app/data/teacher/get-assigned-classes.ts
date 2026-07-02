import { prisma } from "@/lib/db";
import { requireUser } from "../user/require-user";

export async function getAssignedClasses() {
  const user = await requireUser(); // gets logged-in user
  if (!user || user.role === "user" || user.role === "student") return []; // only proceed if user is a teacher

  const classes = await prisma.classroom.findMany({
    where: {
      teacherId: user.id, // only classes assigned to this teacher
    },
    include: {
      teacher: {
        include: {
          teacherProfile: true,
        },
      }, // optional, includes teacher info
      department: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return classes;
}
