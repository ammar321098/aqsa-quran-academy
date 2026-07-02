"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useConstructUrl } from "@/hooks/use-contstruct-url";
import { Eye, FileQuestion } from "lucide-react";
import Image from "next/image";
import type { StandaloneQuizItem } from "@/app/data/user/get-standalone-quizzes";

type Props = {
  quiz: StandaloneQuizItem;
};

export function QuizCard({ quiz }: Props) {
  const thumbnailUrl = useConstructUrl(quiz.thumbnailKey ?? "");

  return (
    <Card className="overflow-hidden flex flex-col">
      {quiz.thumbnailKey ? (
        <div className="relative aspect-video w-full bg-muted">
          <Image
            src={thumbnailUrl}
            alt={quiz.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className="aspect-video w-full bg-muted flex items-center justify-center">
          <FileQuestion className="size-12 text-muted-foreground/50" />
        </div>
      )}
      <CardHeader className="pb-2">
        <CardTitle className="text-base line-clamp-2">{quiz.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {quiz.smallDescription ?? "View details and enroll to take this quiz."}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto pt-0">
        <Button asChild variant="default" className="w-full">
          <Link href={`/dashboard/quizzes/${quiz.id}`}>
            <Eye className="size-4" />
            View details
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
