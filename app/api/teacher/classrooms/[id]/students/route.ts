import { prisma } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const students = await prisma.classroomMember.findMany({
    where: {
      classroomId: id,
      status: "APPROVED",
    },
    include: {
      user: true,
    },
  });

  return new Response(JSON.stringify(students), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
