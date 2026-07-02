import { prisma } from "@/lib/db";

export async function getMembersData() {
  try {
    // Fetch students
    const students = await prisma.user.findMany({
      where: { role: "student" },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        rollNumber: true,
        studentProfile: {
          select: {
            fullName: true,
          },
        },
      }, 
      orderBy: { name: "asc" },
    });

    // Fetch teachers
    const teachers = await prisma.user.findMany({
      where: { role: "teacher" },
      select: {
        id: true,
        name: true,
        image: true,
        rollNumber: true,
        teacherProfile: {
          select: {
            fullName: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    const formattedStudents = students.map((s) => ({
      id: s.id,
      name: s.name,
      image: s.image,
      rollNumber: s.rollNumber, // PascalCase
      fullName: s.studentProfile?.fullName ?? "User", // match type
    }));

    const formattedTeachers = teachers.map((t) => ({
      id: t.id,
      name: t.name,
      image: t.image,
      fullName: t.teacherProfile?.fullName ?? t.name,
    }));

    return { students: formattedStudents, teachers: formattedTeachers };
  } catch (error) {
    console.error("Error fetching members:", error);
    return { students: [], teachers: [] };
  }
}
