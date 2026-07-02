"use client";

import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { enrollInCourseAction } from "../actions";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import { useConfetti } from "@/hooks/use-confetti";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  courseId: string;
  isFree: boolean;
  slug: string;
}

export function EnrollmentButton({ courseId, isFree, slug }: Props) {
  const [isPending, startTransition] = useTransition();
  const { triggerConfetti } = useConfetti();
  const router = useRouter();

  function onSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        enrollInCourseAction(courseId)
      );

      if (error) {
        toast.error("Unexpected error occured. Please try again later");
        return;
      }

      if (result.status === "success") {
        router.push(`/dashboard/${slug}`);
        toast.success(result.message);
        triggerConfetti();
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }

  return (
    <Button
      onClick={onSubmit}
      disabled={isPending}
      className="w-full hover:cursor-pointer"
    >
      {isPending
        ? isFree
          ? "Enrolling..."
          : "Redirecting..."
        : isFree
        ? "Enroll Now"
        : "Buy Now"}
    </Button>
  );
}
