import { getAllCourses } from "@/app/data/course/get-all-courses";
import { PublicCourseCard } from "./PublicCourseCard";
import { EmptyState } from "@/components/general/EmptyState";

export async function RenderCourses() {
  const courses = await getAllCourses();

  return (
    <>
      {/* All Courses View */}
      {courses.length === 0 ? (
        <EmptyState
          title="No Course Found"
          description="There are no courses available publically"
          buttonText="Go to Home"
          href="/"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {courses.map((course: any) => (
            <PublicCourseCard key={course.id} data={course} />
          ))}
        </div>
      )}
    </>
  );
}
