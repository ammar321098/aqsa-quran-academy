import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

import { PlusIcon } from "lucide-react";
import { Suspense } from "react";
import { RenderCourses } from "./_components/RenderCourses";
import AdminCourseCardSkeletonLayout from "./_components/AdminCourseCardSkeletonLayout";

export default async function CoursesPage() {
  return (
    <div className="px-4 lg:px-6 space-y-6">
      {/* Course Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-primary">Courses</h1>
          <p className="text-muted-foreground">
            Add & Manage academic courses for students
          </p>
        </div>{" "}
        <Link href="/admin/courses/create" className={buttonVariants()}>
          <PlusIcon className="size-4" />
          Create New Course
        </Link>
      </div>
      <div className="h-px bg-border" />

      <Suspense fallback={<AdminCourseCardSkeletonLayout />}>
        <RenderCourses />
      </Suspense>
    </div>
  );
}
