"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import type { QuestionType } from "@prisma/client";
import { toast } from "sonner";

type Option = { id: string; text: string; isCorrect: boolean };
type Question = {
  id: string;
  text: string;
  questionType: QuestionType;
  options: Option[];
};

type Props = {
  data: {
    quiz: {
      id: string;
      title: string;
      totalMarks: number | null;
      questions: Question[];
    };
    student: {
      id: string;
      name: string | null;
      email: string | null;
      rollNumber: string | null;
    };
    submission: {
      id: string;
      answers: Record<string, string | string[]>;
      questionMarks: Record<string, number>;
    };
    quizResult: {
      obtainedMarks: number;
      totalMarks: number;
    };
  };
};

function computeAutoMarks(
  question: Question,
  userAnswer: string | string[] | undefined
): number {
  const isChoice =
    question.questionType === "SINGLE_CHOICE" ||
    question.questionType === "MULTIPLE_CHOICE";
  if (!isChoice) return 0;

  const correctOptionIds = question.options
    .filter((o) => o.isCorrect)
    .map((o) => o.id);
  if (correctOptionIds.length === 0) return 0;

  const selectedOptionIds = Array.isArray(userAnswer)
    ? userAnswer
    : userAnswer
      ? [userAnswer]
      : [];

  const correctSet = new Set(correctOptionIds);
  const selectedSet = new Set(selectedOptionIds);
  const isCorrect =
    correctSet.size === selectedSet.size &&
    [...correctSet].every((id) => selectedSet.has(id));

  return isCorrect ? 1 : 0;
}

export function SubmissionGradingView({ data }: Props) {
  const { quiz, submission } = data;
  const [marks, setMarks] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    for (const q of quiz.questions) {
      if (submission.questionMarks[q.id] !== undefined) {
        initial[q.id] = submission.questionMarks[q.id];
      } else {
        initial[q.id] = computeAutoMarks(q, submission.answers[q.id]);
      }
    }
    return initial;
  });
  const [saving, setSaving] = useState(false);

  const totalQuizMarks = quiz.totalMarks ?? quiz.questions.length;
  const currentTotal = Object.values(marks).reduce((a, b) => a + b, 0);

  const saveMarks = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch(
        `/api/admin/quizzes/${quiz.id}/submissions/${data.student.id}/marks`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questionMarks: marks }),
        }
      );
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Failed to save marks");
        return;
      }
      toast.success("Marks saved successfully");
    } catch {
      toast.error("Failed to save marks");
    } finally {
      setSaving(false);
    }
  }, [quiz.id, data.student.id, marks]);

  const getOptionText = (question: Question, optionId: string) =>
    question.options.find((o) => o.id === optionId)?.text ?? "(Unknown)";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Badge variant="secondary" className="text-base px-3 py-1">
          Total: {currentTotal} / {totalQuizMarks}
        </Badge>
        <Button onClick={saveMarks} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save marks"
          )}
        </Button>
      </div>

      <div className="space-y-6">
        {quiz.questions.map((q, idx) => {
          const userAnswer = submission.answers[q.id];
          const isChoice =
            q.questionType === "SINGLE_CHOICE" ||
            q.questionType === "MULTIPLE_CHOICE";
          const correctOptionIds = q.options
            .filter((o) => o.isCorrect)
            .map((o) => o.id);
          const selectedOptionIds = Array.isArray(userAnswer)
            ? userAnswer
            : userAnswer
              ? [userAnswer]
              : [];
          const isCorrect = isChoice
            ? correctOptionIds.length > 0 &&
              correctOptionIds.length === selectedOptionIds.length &&
              correctOptionIds.every((id) => selectedOptionIds.includes(id))
            : false;

          return (
            <Card key={q.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-4">
                  <CardTitle className="text-base flex-1">
                    {idx + 1}. {q.text}
                  </CardTitle>
                  <div className="flex items-center gap-2 shrink-0">
                    <label className="text-sm text-muted-foreground">Marks:</label>
                    <Input
                      type="number"
                      min={0}
                      className="w-20 h-9"
                      value={marks[q.id] ?? 0}
                      onChange={(e) => {
                        const v = parseInt(e.target.value, 10);
                        setMarks((prev) => ({
                          ...prev,
                          [q.id]: Number.isNaN(v) ? 0 : Math.max(0, v),
                        }));
                      }}
                    />
                  </div>
                </div>
                {isChoice && (
                  <div className="flex items-center gap-1 mt-1">
                    {isCorrect ? (
                      <CheckCircle2 className="size-4 text-green-600" />
                    ) : (
                      <XCircle className="size-4 text-red-600" />
                    )}
                    <span
                      className={`text-sm ${
                        isCorrect ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isCorrect ? "Correct" : "Incorrect"}
                    </span>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                {q.questionType === "SINGLE_CHOICE" && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Student answer:
                    </p>
                    <div className="rounded-md border p-3 bg-muted/50">
                      {selectedOptionIds.length > 0
                        ? getOptionText(q, selectedOptionIds[0])
                        : "—"}
                    </div>
                    {!isCorrect && correctOptionIds.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        Correct: {getOptionText(q, correctOptionIds[0])}
                      </p>
                    )}
                  </div>
                )}

                {q.questionType === "MULTIPLE_CHOICE" && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Student answer:
                    </p>
                    <div className="rounded-md border p-3 bg-muted/50 space-y-1">
                      {selectedOptionIds.length > 0
                        ? selectedOptionIds.map((id) => (
                            <div key={id}>• {getOptionText(q, id)}</div>
                          ))
                        : "—"}
                    </div>
                    {!isCorrect && correctOptionIds.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        Correct:{" "}
                        {correctOptionIds.map((id) => getOptionText(q, id)).join(", ")}
                      </p>
                    )}
                  </div>
                )}

                {(q.questionType === "SHORT_TEXT" || q.questionType === "LONG_TEXT") && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Student answer:
                    </p>
                    <div className="rounded-md border p-3 bg-muted/50 min-h-[60px]">
                      {(userAnswer as string) || "—"}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
