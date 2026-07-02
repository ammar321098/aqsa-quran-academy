import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

import { PlusIcon } from "lucide-react";
import { Suspense } from "react";
import { RenderCourses } from "./_components/RenderCourses";
import AdminCourseCardSkeletonLayout from "./_components/AdminCourseCardSkeletonLayout";

export default async function CoursesPage() {
  return (
    <>
      {/* Course Create Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Courses</h1>
        <Link href="/admin/courses/create" className={buttonVariants()}>
          <PlusIcon className="size-4" />
          Create New Course
        </Link>
      </div>

      <Suspense fallback={<AdminCourseCardSkeletonLayout />}>
        <RenderCourses />
      </Suspense>
    </>
  );
}
