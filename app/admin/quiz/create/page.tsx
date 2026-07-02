"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, ExternalLink, Loader2, PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEffect, useState, useTransition } from "react";
import { courseCategory, quizSchema, QuizSchemaType } from "@/lib/zodSchema";
import Link from "next/link";
import { log } from "console";
import { tryCatch } from "@/hooks/try-catch";
import { CreateQuiz } from "./action";

type CourseOption = {
  id: string;
  title: string;
};
type ChapterOption = {
  id: string;
  title: string;
};

export default function CreateQuizForm() {
  const [isPending, startTransition] = useTransition();
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [chapters, setChapters] = useState<ChapterOption[]>([]);

  const form = useForm<QuizSchemaType>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: "",
      googleFormUrl: "",
      type: "CHAPTER",
      courseId: "",
      chapterId: "",
    },
  });

  const courseId = form.watch("courseId");
  const quizzType = form.watch("type");

  /* Fetch courses on mount */
  useEffect(() => {
    fetch("/api/admin/courses")
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
      })
      .catch(console.error);
  }, []);

  /* Fetch chapters when course or type changes */
  useEffect(() => {
    if (!courseId || quizType !== "CHAPTER") {
      setChapters([]);
      return;
    }

    fetch(`/api/admin/chapters?courseId=${courseId}`)
      .then((res) => res.json())
      .then((data) => {
        setChapters(data);
      })
      .catch(console.error);
  }, [courseId, quizzType]);

  function onSubmit(values: QuizSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        CreateQuiz({
          ...values,
          chapterId: values.type === "CHAPTER" ? values.chapterId : undefined,
        })
      );

      if (error) {
        toast.error("Something went wrong");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        form.reset();
      } else {
        toast.error(result.message);
      }
    });
  }

  const quizType = form.watch("type");

  return (
    <>
      <div className="flex items-center gap-2">
        <Link
          href="/admin"
          className={buttonVariants({
            variant: "outline",
            size: "icon-sm",
          })}
        >
          <ArrowLeftIcon className="size-4" />
        </Link>
        <h1 className="text-2xl">Create Quiz</h1>
      </div>

      <Card className="mt-6 mx-10">
        <CardHeader>
          <CardTitle>Quiz Information</CardTitle>
          <CardDescription>
            Create a Google Form based quiz for course or lesson
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Google Form CTA */}
              <Button
                type="button"
                variant="secondary"
                className="w-full hover:cursor-pointer"
                onClick={() =>
                  window.open(
                    "https://docs.google.com/forms/u/0/create",
                    "_blank"
                  )
                }
              >
                Create Google Form For Quiz
                <ExternalLink className="size-4" />
              </Button>

              {/* Quiz Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mx-4 font-bold">Quiz Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter quiz title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Google Form URL */}
              <FormField
                control={form.control}
                name="googleFormUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mx-4 font-bold">
                      Google Form URL
                    </FormLabel>
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

              {/* Quiz Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="mx-4 font-bold">Quiz Type</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select quiz type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CHAPTER">
                          Chapter Level Quiz
                        </SelectItem>
                        <SelectItem value="COURSE">
                          Course Level Quiz
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Course ID */}
                <FormField
                  control={form.control}
                  name="courseId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="mx-4 font-bold">Course</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(val) => {
                          field.onChange(val);
                          form.setValue("chapterId", "");
                        }}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Course" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem key={course.id} value={course.id}>
                              {course.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Lesson ID (Conditional) */}
                {quizType === "CHAPTER" && (
                  <FormField
                    control={form.control}
                    name="chapterId"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="mx-4 font-bold">Lesson</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={!courseId}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              {" "}
                              <SelectValue
                                placeholder={
                                  courseId
                                    ? "Select Lesson"
                                    : "Select course first"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {chapters.map((chapter) => (
                              <SelectItem key={chapter.id} value={chapter.id}>
                                {chapter.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* Submit */}
              <Button type="submit" disabled={isPending} className="font-bold">
                {isPending ? (
                  <>
                    Saving...
                    <Loader2 className="ml-2 animate-spin" />
                  </>
                ) : (
                  <>
                    Save Quiz
                    <PlusIcon className="ml-2 size-4" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
