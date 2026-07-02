import { prisma } from "@/lib/db";

export async function GET() {
  const students = await prisma.user.findMany({
    where: { role: "student" },
    select: {
      id: true,
      name: true,
      rollNumber: true,
      image: true,
      studentProfile: { select: { fullName: true } },
      department: { select: { name: true } },
    },
    orderBy: { name: "asc" },
  });

  const teachers = await prisma.user.findMany({
    where: { role: "teacher" },
    select: {
      id: true,
      name: true,
      rollNumber: true,
      image: true,
      teacherProfile: { select: { fullName: true } },
      department: { select: { name: true } },
    },
    orderBy: { name: "asc" },
  });

  return new Response(
    JSON.stringify({
      students: students.map((s) => ({
        id: s.id,
        fullName: s.name ?? s.studentProfile?.fullName ?? "User",
        rollNumber: s.rollNumber,
        image: s.image,
        department: s.department?.name,
      })),
      teachers: teachers.map((t) => ({
        id: t.id,
        fullName: t.name ?? t.teacherProfile?.fullName ?? "User",
        rollnumber: t.rollNumber,
        image: t.image,
        department: t.department?.name,
      })),
    }),
    { status: 200 },
  );
}
