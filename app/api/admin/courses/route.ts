// app/api/admin/courses/route.ts
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const courses = await prisma.course.findMany({
    select: {
      id: true,
      title: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(courses);
}
