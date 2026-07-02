"use client";

import { AdminLessonType } from "@/app/data/admin/admin-get-lesson";
import { Uploader } from "@/components/file-upoader/Uploader";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { tryCatch } from "@/hooks/try-catch";
import { lessonSchema, LessonSchemaType } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, Loader2, SaveIcon } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { id } from "zod/v4/locales";
import { updateLesson } from "../actions";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface iAppProps {
  data: AdminLessonType;
  chapterId: string;
  courseId: string;
}

export function LessonForm({ chapterId, data, courseId }: iAppProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<LessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: data.title,
      chapterId: chapterId,
      courseId: courseId,
      description: data.description,
      thumbnailKey: data.thumbnailKey,
      videoSource: data.videoKey ? "UPLOAD" : "EMBED",
      videoKey: data.videoKey || "",
      embedUrl: data.embedUrl || "",
    },
  });

  const videoSource = form.watch("videoSource");

  async function onSubmit(values: LessonSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        updateLesson(values, data.id)
      );

      if (error) {
        toast.error("Error in course creation. Please try again later");
        return;
      }

      if (result.status === "success") {
        router.push("/admin/courses");
        toast.success(result.message);
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }
  return (
    <div>
      <div className="flex gap-4">
        <Link
          href={`/admin/courses/${courseId}/edit`}
          className={buttonVariants({
            variant: "outline",
            size: "icon-sm",
          })}
        >
          <ArrowLeftIcon className="size-4" />
        </Link>

        <h1 className="text-2xl font-bold mb-8">
          Lesson: <span className="text-primary">{data.title}</span>
        </h1>
      </div>

      <Card className="mt-6 mx-10">
        <CardHeader>
          <CardTitle>Lesson Configuration</CardTitle>
          <CardDescription>
            Configure the video and description for this lesson
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mx-4 font-bold">
                      Lesson Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Lesson xyz" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mx-4 font-bold">
                      Description
                    </FormLabel>
                    <FormControl>
                      <RichTextEditor field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="thumbnailKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mx-4 font-bold">
                      Thumbnail Image
                    </FormLabel>
                    <FormControl>
                      <Uploader
                        onChange={field.onChange}
                        value={field.value}
                        fileTypeAccepted="image"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="videoSource"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold mx-4">Video Type</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select video type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="EMBED">Youtube Embedded</SelectItem>
                        <SelectItem value="UPLOAD">Upload Video</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {videoSource === "UPLOAD" ? (
                <FormField
                  control={form.control}
                  name="videoKey"
                  render={({ field }) => (
                    <Uploader
                      value={field.value}
                      onChange={field.onChange}
                      fileTypeAccepted="video"
                    />
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="embedUrl"
                  render={({ field }) => (
                    <Input
                      placeholder="https://www.youtube.com/watch?v=XXXX"
                      {...field}
                    />
                  )}
                />
              )}

              <Button
                disabled={isPending}
                type="submit"
                className="font-bold hover:cursor-pointer"
              >
                {isPending ? (
                  <>
                    Saving...
                    <Loader2 className="animate-spin " />
                  </>
                ) : (
                  <>
                    Save Lesson
                    <SaveIcon size={16} />
                  </>
                )}{" "}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
