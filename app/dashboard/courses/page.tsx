import PublicCourseCardSkeletonLayout from "@/app/(endusers)/courses/_components/PublicCoursesSkeletonLayout";
import { RenderCourses } from "@/app/(endusers)/courses/_components/RenderCourses";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function CoursesPage() {
  return (
    <div className="px-4 md:px-6 lg:px-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tighter">
          Explore Courses
        </h1>
        <p className="text-muted-foreground">
          Discover our wide range of courses designed to help you achieve your
          learning goals.
        </p>
      </div>
      <div className="h-px bg-border my-4" />

      <Suspense fallback={<PublicCourseCardSkeletonLayout />}>
        <RenderCourses />
      </Suspense>
    </div>
  );
}
