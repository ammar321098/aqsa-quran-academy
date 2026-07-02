import { requireAdmin } from "@/app/data/admin/require-admin";
import { getCourseCategories } from "@/app/data/admin/get-course-categories";
import { CategoryList } from "./_components/CategoryList";

export default async function CourseCategoriesPage() {
  await requireAdmin();
  const categories = await getCourseCategories();

  return (
    <div className="px-4 lg:px-6 space-y-6">
      {/* Course Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-primary">Course categories</h1>
          <p className="text-muted-foreground">
            Create and manage categories for courses. Use these when creating or
            editing a course.
          </p>
        </div>{" "}
      </div>
            <div className="h-px bg-border" />


      <CategoryList initialCategories={categories} />
    </div>
  );
}
