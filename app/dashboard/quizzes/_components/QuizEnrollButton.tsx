"use client";

import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { enrollInQuizAction } from "../actions";

interface Props {
  quizId: string;
}

export function QuizEnrollButton({ quizId }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleEnroll() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(enrollInQuizAction(quizId));

      if (result?.status === "success") {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result?.message ?? "Failed to enroll");
      }
    });
  }

  return (
    <Button onClick={handleEnroll} disabled={isPending} className="w-full">
      {isPending ? "Enrolling…" : "Enroll in quiz"}
    </Button>
  );
}
