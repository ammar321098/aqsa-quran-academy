import { getCourseCategories } from "@/app/data/admin/get-course-categories";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await requireAdmin();
    const categories = await getCourseCategories();
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
