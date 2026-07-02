"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useConfetti } from "@/hooks/use-confetti";
import type { QuestionType } from "@prisma/client";

type Option = { id: string; text: string; isCorrect: boolean };
type Question = {
  id: string;
  text: string;
  questionType: QuestionType;
  options: Option[];
};

type Props = {
  quizId: string;
  title: string;
  questions: Question[];
};

export default function InAppQuizTake({ quizId, title, questions }: Props) {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const { triggerConfetti } = useConfetti();
  const router = useRouter();

  function handleSingleChoice(questionId: string, optionId: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  }

  function handleMultipleChoice(
    questionId: string,
    optionId: string,
    checked: boolean,
  ) {
    setAnswers((prev) => {
      const current = (prev[questionId] as string[]) ?? [];
      if (checked) {
        return { ...prev, [questionId]: [...current, optionId] };
      }
      return {
        ...prev,
        [questionId]: current.filter((id) => id !== optionId),
      };
    });
  }

  function handleTextAnswer(questionId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const res = await fetch("/api/quiz/in-app-submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quizId, answers }),
    });

    const data = await res.json();

    if (res.ok) {
      triggerConfetti();
      toast.success(
        `Quiz submitted! You scored ${data.obtainedMarks}/${data.totalMarks}`,
      );
      router.refresh();
    } else {
      toast.error(data.error ?? "Failed to submit quiz");
    }
    setSubmitting(false);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{title}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((q, idx) => (
          <Card key={q.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                {idx + 1}. {q.text}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {q.questionType === "SINGLE_CHOICE" && (
                <div className="space-y-2">
                  {q.options.map((opt) => (
                    <label
                      key={opt.id}
                      className="flex items-center gap-2 cursor-pointer rounded-md border p-3 hover:bg-muted/50 has-checked:bg-primary/10 has-checked:border-primary"
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={opt.id}
                        checked={(answers[q.id] as string) === opt.id}
                        onChange={() => handleSingleChoice(q.id, opt.id)}
                        className="size-4"
                      />
                      <span>{opt.text}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.questionType === "MULTIPLE_CHOICE" && (
                <div className="space-y-2">
                  {q.options.map((opt) => {
                    const selected = (answers[q.id] as string[]) ?? [];
                    const checked = selected.includes(opt.id);
                    return (
                      <div
                        key={opt.id}
                        className={`flex items-center gap-2 rounded-md border p-3 hover:bg-muted/50 ${checked ? "bg-primary/10 border-primary" : ""}`}
                      >
                        <Checkbox
                          id={`${q.id}-${opt.id}`}
                          checked={checked}
                          onCheckedChange={(c) =>
                            handleMultipleChoice(q.id, opt.id, c === true)
                          }
                        />
                        <Label
                          htmlFor={`${q.id}-${opt.id}`}
                          className="cursor-pointer flex-1"
                        >
                          {opt.text}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              )}

              {q.questionType === "SHORT_TEXT" && (
                <Input
                  placeholder="Your answer"
                  value={(answers[q.id] as string) ?? ""}
                  onChange={(e) => handleTextAnswer(q.id, e.target.value)}
                />
              )}

              {q.questionType === "LONG_TEXT" && (
                <Textarea
                  placeholder="Your answer"
                  rows={4}
                  value={(answers[q.id] as string) ?? ""}
                  onChange={(e) => handleTextAnswer(q.id, e.target.value)}
                />
              )}
            </CardContent>
          </Card>
        ))}

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Submitting…" : "Submit quiz"}
        </Button>
      </form>
    </div>
  );
}
