"use client";

import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import { useConfetti } from "@/hooks/use-confetti";
import { useRouter } from "next/navigation";
import { enrollInClassroomAction } from "../action";

interface Props {
  classroomId: string;
}

export function ClassroomEnrollmentButton({ classroomId }: Props) {
  const [isPending, startTransition] = useTransition();
  const { triggerConfetti } = useConfetti();
  const router = useRouter();

  function onSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        enrollInClassroomAction(classroomId),
      );

      if (result?.status === "success") {
        router.push(`/dashboard/classroom/${classroomId}`);
        toast.success(result.message);
        triggerConfetti();
      } else if (result?.status === "error") {
        toast.error(result?.message);
      }
    });
  }

  return (
    <Button
      onClick={onSubmit}
      disabled={isPending}
      className="w-full hover:cursor-pointer"
    >
      {isPending ? "Joining..." : "Join Class"}
    </Button>
  );
}
