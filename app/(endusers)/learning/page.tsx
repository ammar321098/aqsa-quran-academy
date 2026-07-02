import { Suspense } from "react";
import { getAllCourses } from "@/app/data/course/get-all-courses";
import { getAllClasses } from "@/app/data/classes/get-all-classes";
import { getStandaloneQuizzes } from "@/app/data/user/get-standalone-quizzes";
import { getClassroomEnrollmentStatuses } from "@/app/data/user/get-classroom-enrollment-statuses";
import { LearningPageClient } from "./_components/LearningPageClient";
import { Skeleton } from "@/components/ui/skeleton";

// Must stay dynamic - enrollment statuses are user-specific
export const dynamic = "force-dynamic";

async function LearningContent() {
  const [courses, classes, quizzes] = await Promise.all([
    getAllCourses(),
    getAllClasses(),
    getStandaloneQuizzes(),
  ]);

  const classIds = classes.map((c: { id: string }) => c.id);
  const enrollmentStatuses = await getClassroomEnrollmentStatuses(classIds);

  return (
    <LearningPageClient
      courses={courses}
      classes={classes}
      quizzes={quizzes}
      enrollmentStatuses={enrollmentStatuses}
    />
  );
}

function LearningSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Skeleton className="h-9 flex-1 max-w-md" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-35" />
          <Skeleton className="h-9 w-35" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-80 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function LearningPage() {
  return (
    <div className="px-4 md:px-6 lg:px-8 mb-10 min-h-125">
      <div className="flex flex-col space-y-2 my-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">
          Learning
        </h1>
        <p className="text-muted-foreground">
          Explore courses, classes, and quizzes to achieve your learning goals.
        </p>
      </div>

      <Suspense fallback={<LearningSkeleton />}>
        <LearningContent />
      </Suspense>
    </div>
  );
}
