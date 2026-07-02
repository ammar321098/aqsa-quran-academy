"use client";

import { LessonContentType } from "@/app/data/course/get-lesson-content";
import { RenderDescription } from "@/components/rich-text-editor/RenderDescription";
import { Button } from "@/components/ui/button";
import { useConstructUrl } from "@/hooks/use-contstruct-url";
import { BookIcon, CheckCircleIcon } from "lucide-react";
import { useTransition } from "react";
import { MarkLessonComplete } from "../actions";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import { useConfetti } from "@/hooks/use-confetti";
import { cn } from "@/lib/utils";

interface iAppProps {
  data: LessonContentType;
}

export function CourseContent({ data }: iAppProps) {
  const [isPending, startTransition] = useTransition();
  const { triggerConfetti } = useConfetti();

  const isCompleted =
    data.lessonProgress?.find((progress: any) => progress.lessonId === data.id)
      ?.completed === true;

  function VideoPlayer({
    videoSource,
    videoKey,
    embedUrl,
    thumbnailKey,
  }: {
    videoSource: "UPLOAD" | "EMBED";
    videoKey?: string;
    embedUrl?: string;
    thumbnailKey: string;
  }) {
    if (videoSource === "EMBED" && embedUrl) {
      return (
        <div className="aspect-video rounded-lg overflow-hidden">
          <iframe
            src={embedUrl}
            className="w-full h-full"
            // allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>
      );
    }

    if (videoSource === "UPLOAD" && videoKey) {
      const videoUrl = useConstructUrl(videoKey);
      const thumbnailUrl = useConstructUrl(thumbnailKey);

      return (
        <video
          key={videoUrl}
          className="w-full aspect-video rounded-lg"
          controls
          poster={thumbnailUrl}
        >
          <source src={videoUrl} type="video/mp4" />
          <source src={videoUrl} type="video/webm" />
          <source src={videoUrl} type="video/ogg" />
          Your browser doesn't support this video type.{" "}
        </video>
      );
    }

    return (
      <div className="aspect-video bg-muted flex items-center justify-center rounded-lg">
        <BookIcon className="size-14 text-muted-foreground" />
      </div>
    );
  }

  function onSubmit() {
    if (isCompleted) return;

    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        MarkLessonComplete(data.id, data.chapter.course.slug)
      );

      if (error) {
        toast.error("Something went wrong. Please try again.");
        return;
      }

      if (result.status === "success") {
        triggerConfetti();
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="flex flex-col bg-background pl-6">
      <VideoPlayer
        thumbnailKey={data.thumbnailKey}
        videoKey={data.videoKey || ""}
        embedUrl={data.embedUrl || ""}
        videoSource={data.videoSource}
      />
      <div className="py-4 border-b">
        <Button
          variant="outline"
          className={cn(
            "text-green-500 hover:text-green-500",
            isCompleted && "cursor-not-allowed text-muted-foreground"
          )}
          onClick={onSubmit}
          disabled={isPending || isCompleted}
        >
          <CheckCircleIcon className="size-4 text-green-500 " />
          {isCompleted ? "Completed" : "Mark as Completed"}
        </Button>
      </div>
      <div className="space-y-3 pt-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {data.title}
        </h1>

        {data.description && (
          <div>
            <h4 className="font-semibold tracking-tight text-foreground py-2">
              Description:
            </h4>
            <RenderDescription json={JSON.parse(data.description)} />
          </div>
        )}
      </div>
    </div>
  );
}
