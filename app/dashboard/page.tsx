import { EmptyState } from "@/components/general/EmptyState";
import { getAllCourses } from "../data/course/get-all-courses";
import { getEnrolledCourses } from "../data/user/get-inrolled-courses";
import { PublicCourseCard } from "../(endusers)/courses/_components/PublicCourseCard";
import { CourseProgressCard } from "./_components/CourseProgressCard";
import { getEnrolledClasses } from "../data/user/get-enrolled-classes";
import { EnrolledClassCard } from "./_components/EnrolledClassCard";
import { OverallAttendanceCard } from "./_components/OverallAttendanceCard";
import { ClassAttendanceList } from "./_components/ClassAttendanceList";
import { getEnrolledClassesWithAttendance } from "../data/user/get-enrolled-classes-with-attendance";

export default async function DashboardPage() {
  const [enrolledCourses, enrolledClasses, classesAttendance] =
    await Promise.all([
      // getAllCourses(),
      getEnrolledCourses(),
      getEnrolledClasses(),
      getEnrolledClassesWithAttendance(),
    ]);

  const hasAttendance = classesAttendance?.some((cls) => {
    const summary = cls.attendanceSummary;
    return summary.present > 0 || summary.absent > 0 || summary.leave > 0;
  });

  console.log(classesAttendance);
  console.log(hasAttendance);

  return (
    <>
      <div className="flex flex-col gap-2 px-4 lg:px-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Student Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track your learning progress and explore new courses
          </p>
          <div className="h-px bg-border my-4" />
        </div>

        {hasAttendance && (
          <div className="space-y-6 mb-10">
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold text-center">
                Attendance Overview
              </h1>
              <p className="text-muted-foreground text-center">
                Your attendance across all enrolled classes{" "}
              </p>
            </div>

            {/* Overall Pie */}
            <OverallAttendanceCard classes={classesAttendance} />
          </div>
        )}

        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-center">Enrolled Courses</h1>
          <p className="text-muted-foreground text-center">
            Here you can see all the courses you have access to
          </p>
        </div>
      </div>
      {enrolledCourses.length === 0 ? (
        <div className="px-4 lg:px-6">
          <EmptyState
            title="No Courses Enrolled"
            description="You haven't enrolled any course yet."
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
          
          <h1 className="text-3xl font-bold text-center">Enrolled Classes</h1>
          <p className="text-muted-foreground text-center">
            Classes you are currently part of
          </p>
        </div>

        {enrolledClasses.length === 0 ? (
          <div>
            <EmptyState
              title="No Classes Joined"
              description="You are not joined in any class yet."
              buttonText="Browse Classes"
              href="/classes"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrolledClasses.map((item: any) =>
              item.classroom ? (
                <EnrolledClassCard key={item.classroom.id} data={item} />
              ) : null,
            )}
          </div>
        )}
      </section>

      {/* <section className="mt-10 px-4 lg:px-6 space-y-6">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-center">Available Courses</h1>
          <p className="text-muted-foreground text-center">
            Here you can see all the courses you can purchase
          </p>
        </div>
        {courses.filter(
          (courseItem: any) =>
            !enrolledCourses.some(
              ({ course }: any) => course.id === courseItem.id,
            ),
        ).length === 0 ? (
          <div>
            <EmptyState
              title="No Courses Available"
              description="You have purchased all available courses"
              buttonText="Browse Courses"
              href="/courses"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses
              .filter(
                (courseItem: any) =>
                  !enrolledCourses.some(
                    ({ course }: any) => course.id === courseItem.id,
                  ),
              )
              .map((course: any) => (
                <PublicCourseCard key={course.id} data={course} />
              ))}
          </div>
        )}
      </section> */}
    </>
  );
}
