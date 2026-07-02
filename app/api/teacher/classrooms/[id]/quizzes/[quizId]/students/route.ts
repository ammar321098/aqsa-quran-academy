// app/api/teacher/classrooms/[id]/quizzes/[quizId]/students/route.ts
import { prisma } from "@/lib/db";
import { requireUser } from "@/app/data/user/require-user";

export async function GET(req: Request) {
  try {
    const user = await requireUser();

    // Parse URL to get classroomId and quizId
    const url = new URL(req.url);
    const pathSegments = url.pathname.split("/").filter(Boolean);

    const classroomIndex = pathSegments.findIndex(
      (seg) => seg === "classrooms",
    );
    const quizIndex = pathSegments.findIndex((seg) => seg === "quizzes");

    const classroomId = pathSegments[classroomIndex + 1];
    const quizId = pathSegments[quizIndex + 1];

    if (!classroomId || !quizId) {
      return new Response(
        JSON.stringify({ error: "Missing classroomId or quizId" }),
        { status: 400 },
      );
    }

    // Fetch classroom members who are students with profile
    const members = await prisma.classroomMember.findMany({
      where: {
        classroomId,
        user: { isStudent: true },
      },
      select: {
        user: {
          select: {
            id: true,
            rollNumber: true,
            studentProfile: { select: { fullName: true } },
          },
        },
      },
    });

    // Fetch quiz results for each student
    const studentResults = await Promise.all(
      members.map(async (member) => {
        const result = await prisma.quizResult.findFirst({
          where: { quizId, studentId: member.user.id },
        });

        return {
          id: member.user.id,
          name: member.user.studentProfile?.fullName ?? "Unknown",
          rollNumber: member.user.rollNumber,
          obtainedMarks: result?.obtainedMarks ?? null,
          totalMarks: result?.totalMarks ?? 100,
        };
      }),
    );

    return new Response(JSON.stringify(studentResults), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
