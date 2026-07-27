"use client";

import { CourseSidebarDataType } from "@/app/data/course/get-course-sidebar-data";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useConstructUrl } from "@/hooks/use-contstruct-url";
import { useCourseProgress } from "@/hooks/use-course-progress";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CourseProgressCardProps {
  data: { course: CourseSidebarDataType["course"] };
}

export function CourseProgressCard({ data }: CourseProgressCardProps) {
  const thumbnailUrl = useConstructUrl(data.course.fileKey);
  const { totalLessons, completedLessons, progressPercentage } =
    useCourseProgress({ courseData: data.course });

  return (
    <Card className="group relative py-0 gap-0">
      <Badge className="absolute top-2 right-2 z-10">{data.course.level}</Badge>
      <Image
        width={0}
        height={400}
        src={thumbnailUrl}
        alt="Thumbnail Image"
        className="w-full rounded-t-xl aspect-video h-full object-cover"
        style={{ width: "100%", height: "auto" }}
      />

      <CardContent className="p-4">
        <Link
          className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors"
          href={`/dashboard/course/${data.course.slug}`}
        >
          {data.course.title}
        </Link>
        <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2">
          {data.course.smallDescription}
        </p>
        <div className="space-y-4 mt-5">
          <div className="flex justify-between mb-1 text-sm">
            <p>Progress:</p>
            <p className="font-medium">{progressPercentage}%</p>
          </div>
          <Progress value={progressPercentage} className="h-1.5" />

          <p className="text-xs text-muted-foreground mt-1">
            {completedLessons} of {totalLessons} lessons completed
          </p>
        </div>
        <Link
          href={`/dashboard/course/${data.course.slug}`}
          className={buttonVariants({
            className: "w-full mt-4",
          })}
        >
          Learn More <ArrowRightIcon className="size-4" />
        </Link>{" "}
      </CardContent>
    </Card>
  );
}

export function PublicCourseCardSkeleton() {
  const skeletonBase = "bg-neutral-300 dark:bg-neutral-800 animate-pulse";
  return (
    <Card className="group relative py-0 gap-0">
      {/* Badge placeholder */}
      <Skeleton
        className={`absolute top-2 right-2 z-10 h-6 w-16 rounded-full ${skeletonBase}`}
      />

      {/* Thumbnail */}
      <Skeleton
        className={`w-full aspect-video rounded-t-xl ${skeletonBase}`}
      />

      <CardContent className="p-4">
        {/* Title */}
        <Skeleton className={`h-6 w-3/4 ${skeletonBase}`} />

        {/* Description */}
        <div className="space-y-2 mt-3">
          <Skeleton className={`h-4 w-full ${skeletonBase}`} />
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-x-5 mt-5">
          <div className="flex items-center gap-x-2">
            <Skeleton className={`size-6 rounded-sm ${skeletonBase}`} />
            <Skeleton className={`h-4 w-16 ${skeletonBase}`} />
          </div>
          <div className="flex items-center gap-x-2">
            <Skeleton className={`size-6 rounded-sm ${skeletonBase}`} />
            <Skeleton className={`h-4 w-20 ${skeletonBase}`} />
          </div>
        </div>

        {/* Button */}
        <Skeleton className={`h-10 w-full mt-4 rounded-md ${skeletonBase}`} />
      </CardContent>
    </Card>
  );
}
