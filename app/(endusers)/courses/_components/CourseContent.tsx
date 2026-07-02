"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  IconChevronDown,
  IconChevronLeft,
  IconPlayerPlay,
} from "@tabler/icons-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  chapters: {
    id: string;
    title: string;
    lessons: { id: string; title: string }[];
  }[];
}

export function CourseContent({ chapters }: Props) {
  const [openChapterIds, setOpenChapterIds] = useState<string[]>([
    chapters[0]?.id,
  ]);

  return (
    <div className="space-y-2">
      {chapters.map((chapter, index) => {
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
            <Card className="p-0 overflow-hidden border-2 transition-all hover:shadow-md">
              <CollapsibleTrigger asChild>
                <button className="w-full text-left">
                  <CardContent className="p-4 hover:bg-muted transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <p className="flex size-10 items-center justify-center rounded-full bg-primary/20 text-primary font-semibold">
                          {index + 1}
                        </p>

                        <div>
                          <h3 className="text-xl font-semibold">
                            {chapter.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {chapter.lessons.length} Lesson
                            {chapter.lessons.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge variant="outline">
                          {chapter.lessons.length} Lessons
                        </Badge>

                        <IconChevronLeft
                          className={cn(
                            "size-5 text-muted-foreground transition-transform duration-200",
                            isOpen && "-rotate-90"
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </button>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="border-t bg-muted/20">
                  <div className="p-6 pt-4 space-y-3">
                    {chapter.lessons.map((lesson, idx) => (
                      <div
                        key={lesson.id}
                        className="flex items-center gap-4 rounded-lg p-3 hover:bg-accent transition-colors group"
                      >
                        <div className="flex size-8 items-center justify-center rounded-full bg-background border-2 border-primary/30">
                          <IconPlayerPlay className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>

                        <div className="flex-1">
                          <p className="font-medium text-sm">{lesson.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Lesson {idx + 1}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        );
      })}
    </div>
  );
}
