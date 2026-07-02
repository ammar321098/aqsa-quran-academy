"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { useTransition } from "react";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useConfetti } from "@/hooks/use-confetti";
import { enrollInQuizAction } from "@/app/dashboard/quizzes/actions";
import Cookies from "js-cookie";

type Props = {
  quizId: string;
  isLoggedIn: boolean;
  isEnrolled: boolean;
  hasSubmitted?: boolean;
};

export function PublicQuizDetailsClient({
  quizId,
  isLoggedIn,
  isEnrolled,
  hasSubmitted = false,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { triggerConfetti } = useConfetti();

  if (!isLoggedIn) {
    return (
      <Link
        className={buttonVariants({ className: "w-full" })}
        href="/login" // no need for ?redirect=...
        onClick={() => Cookies.set("redirectAfterLogin", `/quizzes/${quizId}`)}
      >
        Login to Enroll
      </Link>
    );
  }

  if (isEnrolled) {
    return (
      <Link
        className={buttonVariants({ variant: "default", className: "w-full" })}
        href={`/dashboard/quiz/${quizId}`}
      >
        {hasSubmitted ? "View Results" : "Take Quiz"}
      </Link>
    );
  }

  function handleEnroll() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(enrollInQuizAction(quizId));

      if (result?.status === "success") {
        toast.success(result.message);
        triggerConfetti();
        router.refresh();
      } else {
        const msg =
          result?.message ?? (error instanceof Error ? error.message : "Failed to enroll in quiz.");
        toast.error(msg);
      }
    });
  }

  return (
    <Button onClick={handleEnroll} disabled={isPending} className="w-full">
      {isPending ? "Enrolling…" : "Enroll Now"}
    </Button>
  );
}
