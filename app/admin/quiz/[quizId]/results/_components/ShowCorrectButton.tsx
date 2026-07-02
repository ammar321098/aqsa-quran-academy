"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toggleQuizShowCorrect } from "../action";
import { toast } from "sonner";

type Props = {
  quizId: string;
  initialState: boolean;
};

export function ShowCorrectButton({ quizId, initialState }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const newState = await toggleQuizShowCorrect(quizId);

      toast.success(
        newState
          ? "Correct answers are now visible to users!"
          : "Correct answers are now hidden from users!",
      );
    });
  };

  return (
    <Button
      type="button"
      disabled={isPending}
      variant={initialState ? "default" : "destructive"}
      onClick={handleClick}
    >
      {isPending
        ? "Updating..."
        : initialState
          ? "Hide Correct Answers"
          : "Show Correct Answers"}
    </Button>
  );
}
