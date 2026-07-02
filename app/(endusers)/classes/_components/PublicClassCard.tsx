import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { ClassroomEnrollmentButton } from "./ClassEnrollmentButton";
import { checkIfClassroomEnrolled } from "@/app/data/user/user-is-enrolled";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Share2 } from "lucide-react";

export async function PublicClassroomCard({ classroom }: { classroom: any }) {
  const isEnrolled = await checkIfClassroomEnrolled(classroom.id);
  return (
    <Card className="overflow-hidden rounded-xl hover:shadow-md transition dark:bg-zinc-900 p-0">
      {/* Background Header */}
      <div className="relative h-30 bg-emerald-600">
        <div className="max-w-45">
          <h1 className="relative top-4 left-4 z-2 text-white text-2xl leading-tight">
            {classroom.title}
          </h1>
        </div>
        <Image
          src="/coverpage.jpg"
          alt="Class cover"
          fill
          className="object-cover"
        />

        {/* Teacher Avatar */}
        <div className="absolute -bottom-10 left-4">
          {classroom.teacher?.image ? (
            <Image
              src={classroom.teacher.image}
              alt={classroom.teacher.name ?? "Teacher"}
              width={48}
              height={48}
              className="rounded-full border-2 border-white"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-emerald-700 text-white flex items-center justify-center text-lg font-semibold border-2 border-white">
              {classroom.teacher.teacherProfile?.fullName?.charAt(0) ?? "T"}
            </div>
          )}

          <p className="text-sm text-muted-foreground mt-1">
            {classroom.teacher.teacherProfile?.fullName}
          </p>
        </div>
      </div>

      <CardContent className="space-y-1">
        <Badge
          className="relative left-72 -top-2"
          variant={classroom.isActive ? "default" : "destructive"}
        >
          {classroom.isActive ? "Active" : "Ended"}
        </Badge>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-7">
          {classroom.description ? classroom.description : "N/A"}
        </p>
      </CardContent>

      <CardFooter className="w-full py-5">
        {isEnrolled ? (
          <Link
            className={buttonVariants({
              variant: "outline",
              className: "w-full",
            })}
            href={`/dashboard/classroom/${classroom.id}`}
          >
            Enter In Classroom
          </Link>
        ) : (
          <ClassroomEnrollmentButton classroomId={classroom.id} />
        )}{" "}
      </CardFooter>
    </Card>
  );
}

export function PublicClassroomCardSkeleton() {
  const skeletonBase = "bg-neutral-300 dark:bg-neutral-800 animate-pulse";

  return (
    <Card className="overflow-hidden rounded-xl p-0">
      {/* Header / Cover */}
      <div className="relative h-30">
        <Skeleton className={`absolute inset-0 ${skeletonBase}`} />

        {/* Title */}
        <Skeleton
          className={`absolute top-4 left-4 h-7 w-40 rounded ${skeletonBase}`}
        />

        {/* Teacher Avatar */}
        <div className="absolute -bottom-10 left-4">
          <Skeleton className={`w-12 h-12 rounded-full ${skeletonBase}`} />
          <Skeleton className={`mt-2 h-4 w-24 rounded ${skeletonBase}`} />
        </div>
      </div>

      {/* Description */}
      <CardContent className="space-y-2 px-4 mt-7">
        <Skeleton className={`h-4 w-full ${skeletonBase}`} />
        <Skeleton className={`h-4 w-5/6 ${skeletonBase}`} />
      </CardContent>

      {/* Button */}
      <CardFooter className="w-full py-5">
        <Skeleton className={`h-10 w-full rounded-md ${skeletonBase}`} />
      </CardFooter>
    </Card>
  );
}
