"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { tryCatch } from "@/hooks/try-catch";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteCourse } from "./actions";
import { useParams, useRouter } from "next/navigation";
import { Loader2Icon, Trash2Icon } from "lucide-react";

export default function DeleteCourseRoute() {
  const [isPending, startTransition] = useTransition();
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  async function onsubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(deleteCourse(id));

      if (error) {
        toast.error("An unexpected error occured. Please try again");
        return;
      }

      if (result.status === "success") {
        router.push("/admin/courses");
        toast.success(result.message);
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }
  return (
    <div className="max-w-xl mx-auto w-full">
      <Card className="mt-52">
        <CardHeader>
          <CardTitle>Are you sure! want to delete this course?</CardTitle>
          <CardDescription>
            {" "}
            This action cannot undone. This will permanently delete this Course.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <Link
            href="/admin/courses"
            className={buttonVariants({ variant: "outline" })}
          >
            Cancel
          </Link>
          <Button variant="destructive" onClick={onsubmit} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2Icon className="size-4" />
                Delete
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
