import { adminGetCourses } from "@/app/data/admin/admin-get-courses";
import { EmptyState } from "@/components/general/EmptyState";
import { AdminCourseCard } from "./AdminCourseCard";

export async function RenderCourses() {
  const data = await adminGetCourses();

  return (
    <>
      {/* All Courses View */}
      {data.length === 0 ? (
        <EmptyState
          title="No Course Found"
          description="Create a new course to get stated"
          buttonText="Create Course"
          href="/admin/courses/create"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-8 m-5">
          {data.map((course: any) => (
            <AdminCourseCard key={course.id} data={course} />
          ))}
        </div>
      )}
    </>
  );
}
