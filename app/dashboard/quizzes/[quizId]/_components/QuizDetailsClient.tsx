"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { useTransition } from "react";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useConfetti } from "@/hooks/use-confetti";
import { enrollInQuizAction } from "../../actions";

type Props = {
  quizId: string;
  isEnrolled: boolean;
  hasSubmitted?: boolean;
};

export function QuizDetailsClient({
  quizId,
  isEnrolled,
  hasSubmitted = false,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { triggerConfetti } = useConfetti();

  function handleEnroll() {
    startTransition(async () => {
      const { data: result } = await tryCatch(enrollInQuizAction(quizId));

      if (result?.status === "success") {
        toast.success(result.message);
        triggerConfetti();
        router.refresh();
      } else {
        toast.error(result?.message ?? "Failed to enroll");
      }
    });
  }

  if (isEnrolled) {
    return (
      <Link
        className={buttonVariants({
          variant: "default",
          className: "w-full",
        })}
        href={`/dashboard/quiz/${quizId}`}
      >
        {hasSubmitted ? "View Results" : "Take Quiz"}
      </Link>
    );
  }

  return (
    <Button
      onClick={handleEnroll}
      disabled={isPending}
      className="w-full hover:cursor-pointer"
    >
      {isPending ? "Enrolling…" : "Enroll Now"}
    </Button>
  );
}
