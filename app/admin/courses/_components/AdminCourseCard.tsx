"use client";

import { AdminCourseType } from "@/app/data/admin/admin-get-courses";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useConstructUrl } from "@/hooks/use-contstruct-url";
import { IconChartBar } from "@tabler/icons-react";
import {
  ArrowRight,
  EditIcon,
  EyeIcon,
  MoreVerticalIcon,
  PencilIcon,
  School,
  TimerIcon,
  Trash2Icon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface iAppProps {
  data: AdminCourseType;
}

export function AdminCourseCard({ data }: iAppProps) {
  const thumbnailUrl = useConstructUrl(data.fileKey);
  return (
    <Card className="group relative py-0 gap-0">
      {/* Absolute dropdown */}
      <div className="absolute top-2 right-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon">
              <MoreVerticalIcon className="size-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${data.id}/edit`}>
                <PencilIcon className="size-4 mr-2" />
                Edit Course
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/courses/${data.slug}`}>
                <EyeIcon className="size-4 mr-2" />
                View Course
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${data.id}/delete`}>
                <Trash2Icon className="size-4 mr-2 text-destructive" />
                Delete Course
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Image
        src={thumbnailUrl}
        alt="Thumbnail"
        width={600}
        height={400}
        className="w-full rounded-lg aspect-video h-full object-cover"
      />
      <CardContent className="p-4">
        <Link
          href={`/admin/courses/${data.id}`}
          className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors"
        >
          {data.title}
        </Link>

        <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2">
          {data.smallDescription}
        </p>
        <div className="flex items-center gap-x-5 mt-5">
          <div className="flex items-center gap-x-2">
            <TimerIcon className="size-6 p-1 rounded-sm text-primary bg-primary/10" />
            <p className="text-sm text-muted-foreground">
              {data.duration} Hour
            </p>
          </div>
          <div className="flex items-center gap-x-2">
            <IconChartBar className="size-6 p-1 rounded-sm text-primary bg-primary/10" />
            <p className="text-sm text-muted-foreground">{data.level}</p>
          </div>
        </div>

        <Link
          href={`/admin/courses/${data.id}/edit`}
          className={buttonVariants({
            className: "w-full mt-4",
          })}
        >
          Edit Course <EditIcon className="size-4" />
        </Link>
      </CardContent>
    </Card>
  );
}

export function AdminCourseCardSkeleton() {
  const skeletonBase = "bg-neutral-300 dark:bg-neutral-800 animate-pulse";

  return (
    <Card className="relative py-0 gap-0">
      {/* Thumbnail */}
      <Skeleton className={`w-full aspect-video rounded-lg ${skeletonBase}`} />

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
