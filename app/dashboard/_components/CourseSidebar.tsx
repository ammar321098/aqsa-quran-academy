"use client";

import { CourseSidebarDataType } from "@/app/data/course/get-course-sidebar-data";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { ChevronRightIcon, Play } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { LessonItem } from "./LessonItem";
import { usePathname } from "next/navigation";
import { useCourseProgress } from "@/hooks/use-course-progress";
import { StartQuizButton } from "./StartQuizButton";

interface iAppProps {
  course: CourseSidebarDataType["course"];
}

export function CourseSidebar({ course }: iAppProps) {
  const { completedLessons, totalLessons, progressPercentage } =
    useCourseProgress({ courseData: course });
  const pathname = usePathname();
  const currentLessonId = pathname.split("/").pop();
  const [openChapterIds, setOpenChapterIds] = useState<string[]>([
    course.chapters[0]?.id,
  ]);

  return (
    <div className="flex flex-col h-full">
      <div className="pb-4 pr-4 border-b border-border h-full min-h-screen">
        {/* Sidebar Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="size-12 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
            <Play className="size-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-base leading-tight truncate">
              {course.title}
            </h1>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {course.category}
            </p>
          </div>
        </div>

        {/* Sidebar Progress */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {completedLessons}/{totalLessons} Lessons
            </span>
          </div>
          <Progress value={progressPercentage} />
          <p className="text-xs text-muted-foreground">
            {progressPercentage}% Completed
          </p>
        </div>

        {/* Sidebar Content */}
        <div className="py-4 space-y-3">
          {course.chapters.map((chapter: any) => {
            const isOpen = openChapterIds.includes(chapter.id);

            return (
              <Collapsible
                key={chapter.id}
                open={isOpen}
                onOpenChange={(open) => {
                  setOpenChapterIds((prev) =>
                    open
                      ? [...prev, chapter.id]
                      : prev.filter((id) => id !== chapter.id)
                  );
                }}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    className="w-full p-3 h-auto flex gap-2"
                    variant="outline"
                  >
                    <ChevronRightIcon
                      className={cn(
                        "size-4 transition-transform",
                        isOpen && "rotate-90"
                      )}
                    />
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-sm truncate">
                        {chapter.position}: {chapter.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {chapter.lessons.length} Lessons
                      </p>
                    </div>
                  </Button>
                </CollapsibleTrigger>

                <CollapsibleContent className="mt-3 pl-5 border-l-2 space-y-3">
                  {/* Lessons */}
                  {chapter.lessons.map((lesson: any) => (
                    <LessonItem
                      key={lesson.id}
                      lesson={lesson}
                      slug={course.slug}
                      isActive={currentLessonId === lesson.id}
                      completed={
                        lesson.lessonProgress.find(
                          (progress: any) => progress.lessonId === lesson.id
                        )?.completed || false
                      }
                    />
                  ))}

                  {/* Chapter quizzes */}
                  {chapter.quizzes?.map((quiz: any) => {
                    const alreadyTaken = quiz.quizSubmissions?.length > 0;
                    return (
                      <StartQuizButton
                        key={quiz.id}
                        quizId={quiz.id}
                        disabled={alreadyTaken}
                        label={
                          alreadyTaken ? "Already Taken" : "Start Chapter Quiz"
                        }
                      />
                    );
                  })}
                </CollapsibleContent>
              </Collapsible>
            );
          })}

          {/* Course-level quizzes at bottom */}
          {course.quizzes?.length > 0 && (
            <div className="pt-4 border-t mt-2">
              <p className="text-xs font-semibold text-muted-foreground mb-2">
                Course Quiz
              </p>

              {course.quizzes.map((quiz: any) => {
                const alreadyTaken = quiz.quizSubmissions?.length > 0;
                return (
                  <StartQuizButton
                    key={quiz.id}
                    quizId={quiz.id}
                    disabled={alreadyTaken}
                    label={alreadyTaken ? "Already Taken" : "Start Final Test"}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
