"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircleIcon } from "lucide-react";
import { useConfetti } from "@/hooks/use-confetti";
import { useRouter } from "next/navigation";

interface Props {
  quizId: string;
  title: string;
  googleFormUrl: string;
}

export default function QuizDashboardPage({
  quizId,
  title,
  googleFormUrl,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { triggerConfetti } = useConfetti();
  const router = useRouter();

  async function handleSubmission() {
    setLoading(true);

    const res = await fetch("/api/quiz/quiz-submission", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quizId }),
    });

    if (res.ok) {
      setSubmitted(true);
      triggerConfetti();
      toast.success("Quiz Successfully Submited");

      // Redirect to dashboard
      router.push("/dashboard");
    } else {
      const text = await res.text();
      alert(text);
    }

    setLoading(false);
  }

  const embedUrl = googleFormUrl.includes("viewform")
    ? googleFormUrl.replace("/viewform", "/viewform?embedded=true")
    : googleFormUrl;

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">{title}</h1>

      <iframe
        src={embedUrl}
        width="100%"
        height="800"
        className="rounded-lg border mb-4"
      />

      <Button
        onClick={handleSubmission}
        disabled={loading || submitted}
        className="w-full hover:cursor-pointer"
      >
        <CheckCircleIcon className="size-4" />
        {submitted ? "Already Submitted" : "Complete Submission"}
      </Button>
    </div>
  );
}
