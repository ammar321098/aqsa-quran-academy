import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");

  if (!courseId) {
    return NextResponse.json([], { status: 200 });
  }

  const chapters = await prisma.chapter.findMany({
    where: { courseId },
    select: {
      id: true,
      title: true,
      position: true,
    },
    orderBy: { position: "asc" },
  });

  return NextResponse.json(chapters);
}
