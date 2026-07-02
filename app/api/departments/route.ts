// app/api/departments/route.ts
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const departments = await prisma.department.findMany({
    select: { id: true, name: true },
  });

  return NextResponse.json(departments);
}
