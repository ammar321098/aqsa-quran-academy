import { Suspense } from "react";
import { RenderCourses } from "./_components/RenderCourses";
import PublicCourseCardSkeletonLayout from "./_components/PublicCoursesSkeletonLayout";

export default function PublicCoursesPage() {
  return (
    <div className="px-4 md:px-6 lg:px-8">
      <div className="flex flex-col space-y-2 my-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">
          Explore Courses
        </h1>
        <p className="text-muted-foreground">
          Discover our wide range of courses designed to help you achieve your
          learning goals.
        </p>
      </div>

      <Suspense fallback={<PublicCourseCardSkeletonLayout />}>
        <RenderCourses />
      </Suspense>
    </div>
  );
}
