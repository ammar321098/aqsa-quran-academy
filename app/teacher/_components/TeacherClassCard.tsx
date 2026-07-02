"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRightIcon, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function TeacherClassCard({ classroom }: { classroom: any }) {
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
          src="/classCover.jpg"
          alt="Class cover"
          fill
          className="object-cover"
        />

        {/* Teacher Avatar */}
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

      {/* Description */}
      <CardContent className="space-y-1 px-4 mt-7">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {classroom.description ?? "N/A"}
        </p>

        {/* Optional stats */}
        {classroom._count?.enrolments && (
          <p className="text-xs text-muted-foreground">
            Students enrolled: {classroom._count.enrolments}
          </p>
        )}
      </CardContent>

      {/* Actions */}
      <CardFooter className="flex gap-2 w-full py-5">
        <Link
          href={`/teacher/classes/${classroom.id}`}
          className={buttonVariants({ className: "flex-1" })}
        >
          View Class
          <ArrowRightIcon className="mr-2 h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}
