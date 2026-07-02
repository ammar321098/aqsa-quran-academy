"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import type { QuestionType } from "@prisma/client";

type Option = { id: string; text: string; isCorrect: boolean };
type Question = {
  id: string;
  text: string;
  questionType: QuestionType;
  options: Option[];
};

type Props = {
  title: string;
  questions: Question[];
  answers: Record<string, string | string[]>;
  obtainedMarks: number;
  totalMarks: number;
  showCorrect?: boolean;
};

export default function QuizSubmittedView({
  title,
  questions,
  answers,
  obtainedMarks,
  totalMarks,
  showCorrect,
}: Props) {
  const hasAnyAnswers = Object.keys(answers).length > 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/dashboard/quizzes">
          <ArrowLeft className="size-4 mr-2" />
          Back to quizzes
        </Link>
      </Button>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Badge variant="secondary" className="text-base px-3 py-1">
          Score: {obtainedMarks}/{totalMarks}
        </Badge>
      </div>

      {hasAnyAnswers ? (
        <p className="text-muted-foreground">
          You have already submitted this quiz. Here are your answers:
        </p>
      ) : (
        <p className="text-muted-foreground rounded-lg border border-amber-500/50 bg-amber-500/10 p-4">
          Your score has been recorded. Answer details were not saved for this
          submission (this can happen for older submissions).
        </p>
      )}

      <div className="space-y-6">
        {questions.map((q, idx) => {
          const userAnswer = answers[q.id];
          const isChoice =
            q.questionType === "SINGLE_CHOICE" ||
            q.questionType === "MULTIPLE_CHOICE";

          let isCorrect = false;
          let correctOptionIds: string[] = [];
          let selectedOptionIds: string[] = [];

          if (isChoice) {
            correctOptionIds = q.options
              .filter((o) => o.isCorrect)
              .map((o) => o.id);
            selectedOptionIds = Array.isArray(userAnswer)
              ? (userAnswer as string[])
              : userAnswer
                ? [userAnswer as string]
                : [];
            const correctSet = new Set(correctOptionIds);
            const selectedSet = new Set(selectedOptionIds);
            isCorrect =
              correctOptionIds.length > 0 &&
              correctSet.size === selectedSet.size &&
              [...correctSet].every((id) => selectedSet.has(id));
          }

          const hasCorrectAnswer = isChoice && correctOptionIds.length > 0;

          const getOptionText = (optionId: string) =>
            q.options.find((o) => o.id === optionId)?.text ?? "(Unknown)";

          return (
            <Card key={q.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">
                    {idx + 1}. {q.text}
                  </CardTitle>
                  {hasCorrectAnswer &&
                    (isCorrect ? (
                      <CheckCircle2 className="size-5 text-green-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="size-5 text-red-600 shrink-0 mt-0.5" />
                    ))}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* SINGLE_CHOICE */}
                {q.questionType === "SINGLE_CHOICE" && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Your answer:
                    </p>
                    {selectedOptionIds.length > 0 ? (
                      <div className="rounded-md border p-3 bg-muted/50">
                        {getOptionText(selectedOptionIds[0])}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        No answer selected
                      </p>
                    )}

                    {/* show correct answer only if showCorrect=true */}
                    {!isCorrect &&
                      correctOptionIds.length > 0 &&
                      showCorrect && (
                        <>
                          <p className="text-sm font-medium text-muted-foreground mt-2">
                            Correct answer:
                          </p>
                          <div className="rounded-md border border-green-500/50 p-3 bg-green-500/5">
                            {getOptionText(correctOptionIds[0])}
                          </div>
                        </>
                      )}
                  </div>
                )}

                {/* MULTIPLE_CHOICE */}
                {q.questionType === "MULTIPLE_CHOICE" && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Your answer:
                    </p>
                    {selectedOptionIds.length > 0 ? (
                      <div className="rounded-md border p-3 bg-muted/50 space-y-1">
                        {selectedOptionIds.map((id) => (
                          <div key={id}>• {getOptionText(id)}</div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        No answer selected
                      </p>
                    )}

                    {/* show correct answer only if showCorrect=true */}
                    {!isCorrect &&
                      correctOptionIds.length > 0 &&
                      showCorrect && (
                        <>
                          <p className="text-sm font-medium text-muted-foreground mt-2">
                            Correct answer:
                          </p>
                          <div className="rounded-md border border-green-500/50 p-3 bg-green-500/5 space-y-1">
                            {correctOptionIds.map((id) => (
                              <div key={id}>• {getOptionText(id)}</div>
                            ))}
                          </div>
                        </>
                      )}
                  </div>
                )}

                {(q.questionType === "SHORT_TEXT" ||
                  q.questionType === "LONG_TEXT") && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Your answer:
                    </p>
                    <div className="rounded-md border p-3 bg-muted/50">
                      {(userAnswer as string) || (
                        <span className="text-muted-foreground italic">
                          No answer provided
                        </span>
                      )}
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
