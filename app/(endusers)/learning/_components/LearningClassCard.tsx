"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { ClassroomEnrollmentButton } from "@/app/(endusers)/classes/_components/ClassEnrollmentButton";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface Props {
  classroom: {
    id: string;
    title: string;
    description: string | null;
    isActive: boolean;
    teacher?: {
      image: string | null;
      teacherProfile?: { fullName: string | null } | null;
    } | null;
  };
  isEnrolled: boolean;
}

export function LearningClassCard({ classroom, isEnrolled }: Props) {
  return (
    <Card className="overflow-hidden rounded-xl hover:shadow-md transition dark:bg-zinc-900 p-0">
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
        <div className="absolute -bottom-10 left-4">
          {classroom.teacher?.image ? (
            <Image
              src={classroom.teacher.image}
              alt={classroom.teacher.teacherProfile?.fullName ?? "Teacher"}
              width={48}
              height={48}
              className="rounded-full border-2 border-white"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-emerald-700 text-white flex items-center justify-center text-lg font-semibold border-2 border-white">
              {classroom.teacher?.teacherProfile?.fullName?.charAt(0) ?? "T"}
            </div>
          )}
          <p className="text-sm text-muted-foreground mt-1">
            {classroom.teacher?.teacherProfile?.fullName}
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

      <CardFooter className="w-full py-5 flex flex-col gap-2">
        {isEnrolled ? (
          <Link
            className={buttonVariants({
              variant: "outline",
              className: "w-full",
            })}
            href={`/dashboard/classroom/${classroom.id}`}
          >
            Enter Classroom
          </Link>
        ) : (
          <ClassroomEnrollmentButton classroomId={classroom.id} />
        )}
        <Link
          href={`/classes/${classroom.id}`}
          className="text-center text-sm text-muted-foreground hover:text-foreground transition"
        >
          See Details
        </Link>
      </CardFooter>
    </Card>
  );
}
