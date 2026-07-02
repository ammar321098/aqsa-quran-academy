"use client";

import { useEffect, useTransition, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { quizSchema, QuizSchemaInput, QuizSchemaType } from "@/lib/zodSchema";
import { tryCatch } from "@/hooks/try-catch";
import { CreateQuiz, UpdateQuiz } from "../action";
import { toast } from "sonner";
import slugify from "slugify";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2, PlusIcon } from "lucide-react";
import { Uploader } from "@/components/file-upoader/Uploader";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { useUnsavedChangesGuard } from "@/hooks/use-unsaved-guard";

type Props = {
  initialData?: QuizSchemaType & { id: string };
  courses: CourseOption[];
  onSuccess?: () => void;
};

type CourseOption = { id: string; title: string };
type ChapterOption = { id: string; title: string };

export function GoogleFormQuizForm({ initialData, courses, onSuccess }: Props) {
  const [chapters, setChapters] = useState<ChapterOption[]>([]);
  const [isPending, startTransition] = useTransition();

  const form = useForm<QuizSchemaInput>({
    defaultValues: {
      title: initialData?.title ?? "",
      googleFormUrl: initialData?.googleFormUrl ?? "",
      type: initialData?.type ?? "CHAPTER",
      courseId: initialData?.courseId ?? "",
      chapterId: initialData?.chapterId ?? "",
      slug: initialData?.slug ?? "",
      smallDescription: initialData?.smallDescription ?? "",
      description: initialData?.description ?? "",
      thumbnailKey: initialData?.thumbnailKey ?? "",
      totalMarks: initialData?.totalMarks ?? undefined,
    },
  });

  const courseId = form.watch("courseId");
  const quizType = form.watch("type");
  const isEdit = !!initialData;

  useEffect(() => {
    if (!courseId || quizType !== "CHAPTER") {
      setChapters([]);
      return;
    }

    fetch(`/api/admin/chapters?courseId=${courseId}`)
      .then((res) => res.json())
      .then(setChapters)
      .catch(console.error);
  }, [courseId, quizType]);

  async function submit(values: QuizSchemaInput) {
    const parsed = quizSchema.safeParse(values); // transforms totalMarks to number | undefined
    if (!parsed.success) return;

    const action = initialData?.id
      ? () => UpdateQuiz(initialData.id, parsed.data)
      : () => CreateQuiz(parsed.data);

    const { data: result, error } = await tryCatch(action());

    if (error) {
      toast.error("Something went wrong");
      return;
    }

    if (result.status === "success") {
      toast.success(result.message);
      form.reset(values); // reset to current values
      onSuccess?.();
    } else {
      toast.error(result.message);
    }
  }

  function onSubmit(values: QuizSchemaInput) {
    startTransition(() => {
      void submit(values);
    });
  }

  const isDirty = form.formState.isDirty;
  useUnsavedChangesGuard({ isDirty });
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Create Google Form quiz</CardTitle>
        <CardDescription>
          Create a Google Form and link it with your course/chapter.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                window.open(
                  "https://docs.google.com/forms/u/0/create",
                  "_blank",
                )
              }
            >
              Create Google Form
              <ExternalLink className="ml-2 size-4" />
            </Button>

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quiz Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter quiz title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* URL */}
            <FormField
              control={form.control}
              name="googleFormUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Google Form URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://docs.google.com/forms/..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quiz Type</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select quiz type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="STANDALONE">Standalone</SelectItem>
                      <SelectItem value="CHAPTER">Chapter</SelectItem>
                      <SelectItem value="COURSE">Course</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Course */}
            {quizType !== "STANDALONE" && (
              <FormField
                control={form.control}
                name="courseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(v) => {
                        field.onChange(v);
                        form.setValue("chapterId", "");
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courses.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {quizType === "STANDALONE" && (
              <div className="space-y-4 rounded-xl border bg-muted/30 p-4">
                <h3 className="font-medium text-sm">Standalone Quiz Details</h3>

                {/* SLUG */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="mx-2 font-bold">
                          Slug (URL-friendly, unique)
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled
                            placeholder="e.g. ramadan-quran-quiz"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="shrink-0 self-end"
                    onClick={() => {
                      const title = form.getValues("title");
                      if (title.trim())
                        form.setValue("slug", slugify(title, { lower: true }), {
                          shouldValidate: true,
                        });
                    }}
                  >
                    Generate from title
                  </Button>
                </div>
                {/* SHORT DESC */}
                <FormField
                  control={form.control}
                  name="smallDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief summary of the quiz"
                          className="min-h-20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description section here */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="mx-2 font-bold">
                        Description
                      </FormLabel>
                      <FormControl>
                        <RichTextEditor field={field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* THUMBNAIL */}
                <FormField
                  control={form.control}
                  name="thumbnailKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thumbnail image</FormLabel>
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
              </div>
            )}

            <FormField
              control={form.control}
              name="totalMarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Marks</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {isEdit ? "Updating..." : "Creating..."}
                </>
              ) : isEdit ? (
                "Update quiz"
              ) : (
                "Create quiz"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
