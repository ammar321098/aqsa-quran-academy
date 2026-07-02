import { EmptyState } from "@/components/general/EmptyState";
import { getAllCourses } from "../data/course/get-all-courses";
import { getEnrolledCourses } from "../data/user/get-inrolled-courses";
import { PublicCourseCard } from "../(endusers)/courses/_components/PublicCourseCard";
import { CourseProgressCard } from "./_components/CourseProgressCard";

export default async function DashboardPage() {
  const [courses, enrolledCourses] = await Promise.all([
    getAllCourses(),
    getEnrolledCourses(),
  ]);

  return (
    <>
      <div className="flex flex-col gap-2 px-4 lg:px-6">
        <h1 className="text-3xl font-bold">Enrolled Courses</h1>
        <p className="text-muted-foreground">
          Here you can see all the courses you have access to
        </p>
      </div>
      {enrolledCourses.length === 0 ? (
        <div className="px-4 lg:px-6">
          <EmptyState
            title="No Courses Purchased"
            description="You haven't purchased any course yet."
            buttonText="Browse Courses"
            href="/courses"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 lg:px-6">
          {enrolledCourses.map((item: any) => (
            <CourseProgressCard key={item.course.id} data={item} />
          ))}
        </div>
      )}

      <section className="mt-10 px-4 lg:px-6 space-y-6">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Available Courses</h1>
          <p className="text-muted-foreground">
            Here you can see all the courses you can purchase
          </p>
        </div>
        {courses.filter(
          (courseItem: any) =>
            !enrolledCourses.some(({ course }: any) => course.id === courseItem.id)
        ).length === 0 ? (
          <EmptyState
            title="No Courses Available"
            description="You have purchased all available courses"
            buttonText="Browse Courses"
            href="/courses"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses
              .filter(
                (courseItem: any) =>
                  !enrolledCourses.some(
                    ({ course }: any) => course.id === courseItem.id
                  )
              )
              .map((course: any) => (
                <PublicCourseCard key={course.id} data={course} />
              ))}
          </div>
        )}
      </section>
    </>
  );
}
