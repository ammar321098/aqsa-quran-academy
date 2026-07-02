"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Props {
  quizId: string;
  disabled: boolean;
  label: string;
  size?: "default" | "sm";
}

export function StartQuizButton({
  quizId,
  disabled,
  label,
  size = "default",
}: Props) {
  const router = useRouter();

  function startQuiz() {
    // Navigate to your new internal page
    router.push(`/dashboard/quiz/${quizId}`);
  }

  return (
    <Button
      size={size}
      className="w-full hover:cursor-pointer"
      disabled={disabled}
      onClick={startQuiz}
      variant={"default"}
    >
      {label}
    </Button>
  );
}
