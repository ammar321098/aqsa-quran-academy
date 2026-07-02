"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Uploader } from "@/components/file-upoader/Uploader";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  teacherQuizSchema,
  TeacherQuizSchemaInput,
  TeacherQuizSchemaType,
} from "@/lib/zodSchema";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import slugify from "slugify";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeftIcon,
  ExternalLink,
  EyeIcon,
  FileQuestion,
  Loader2,
  MoreVerticalIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { CreateTeacherClassQuiz } from "../action";
import { TeacherClassQuizForm } from "./TeacherQuizForm";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteQuiz, toggleQuizStatus } from "@/app/admin/quiz/action";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";

type QuizRow = {
  id: string;
  title: string;
  googleFormUrl: string | null;
  type: string;
  isPublished: boolean;
  course: { id: string; title: string } | null;
  chapter: { id: string; title: string } | null;
  classroom: { id: string; title: string } | null;
};

type ActiveForm = "in-app" | "google-form" | null;

export function TeacherQuizPageClient({
  initialQuizzes = [],
  classroomId,
}: {
  initialQuizzes?: QuizRow[];
  classroomId: string;
}) {
  const [quizzes, setQuizzes] = useState<QuizRow[]>(initialQuizzes);
  const [isPending, startTransition] = useTransition();
  const [activeForm, setActiveForm] = useState<ActiveForm>(null);

  const form = useForm<TeacherQuizSchemaInput>({
    resolver: zodResolver(
      teacherQuizSchema,
    ) as Resolver<TeacherQuizSchemaInput>,
    defaultValues: {
      title: "",
      googleFormUrl: "",
      classroomId,
      slug: "",
      smallDescription: "",
      description: "",
      thumbnailKey: "",
      totalMarks: "",
      questions: [],
    },
  });

  const fetchQuizzes = useCallback(async () => {
    const res = await fetch(`/api/teacher/classrooms/${classroomId}/allQuizes`);
    if (res.ok) {
      const data = await res.json();
      setQuizzes(data);
    }
  }, [classroomId]);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  async function onSubmit(values: TeacherQuizSchemaInput) {
    startTransition(async () => {
      // Convert totalMarks from string to number
      const totalMarks =
        typeof values.totalMarks === "string"
          ? parseInt(values.totalMarks, 10) || undefined
          : values.totalMarks;

      // Ensure each question has options array
      const questions = values.questions?.map((q) => ({
        ...q,
        options: q.options ?? [],
      }));

      const payload: TeacherQuizSchemaType & { type: "CLASSROOM" } = {
        ...values,
        isPublished: true,
        type: "CLASSROOM",
        totalMarks,
        questions,
      };

      const { data: result, error } = await tryCatch(
        CreateTeacherClassQuiz(payload),
      );

      if (error) {
        toast.error("Something went wrong");
        return;
      }

      if (result?.status === "success") {
        toast.success(result.message);
        form.reset();
        fetchQuizzes();
      } else {
        toast.error(result?.message);
      }
    });
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link
            href={`/teacher/classes/${classroomId}`}
            className={buttonVariants({
              variant: "outline",
              size: "icon-sm",
            })}
          >
            <ArrowLeftIcon className="size-4" />
          </Link>
          <h1 className="text-2xl">Quizzes</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant={activeForm === "in-app" ? "default" : "outline"}
            onClick={() =>
              setActiveForm(activeForm === "in-app" ? null : "in-app")
            }
          >
            <FileQuestion className="size-4 mr-2" />
            Create quiz
          </Button>
          <Button
            variant={activeForm === "google-form" ? "default" : "outline"}
            onClick={() =>
              setActiveForm(activeForm === "google-form" ? null : "google-form")
            }
          >
            <ExternalLink className="size-4 mr-2" />
            Create Google Form quiz
          </Button>
        </div>
      </div>

      {/* In-app quiz form - shown when "Create quiz" is active */}
      {activeForm === "in-app" && (
        <TeacherClassQuizForm
          classroomId={classroomId}
          onSuccess={() => fetchQuizzes()}
        />
      )}

      {/* Google Form quiz form - shown when "Create Google Form quiz" is active */}
      {activeForm === "google-form" && (
        <Card className="mt-6" id="create-quiz">
          <CardHeader>
            <CardTitle>Create Google Form quiz</CardTitle>
            <CardDescription>
              Create a Google Form, then link it here for a course or chapter.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full md:w-auto"
                  onClick={() =>
                    window.open(
                      "https://docs.google.com/forms/u/0/create",
                      "_blank",
                    )
                  }
                >
                  Create Google Form for quiz
                  <ExternalLink className="ml-2 size-4" />
                </Button>

                {/* Quiz Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="mx-2 font-bold">
                        Quiz Title
                      </FormLabel>
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
                      <FormLabel className="mx-2 font-bold">
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

                <FormField
                  control={form.control}
                  name="totalMarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="mx-2 font-bold">
                        Total marks (optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          placeholder="e.g. 100 (leave empty for auto)"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const v = e.target.value;
                            field.onChange(
                              v === "" ? undefined : parseInt(v, 10),
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-muted-foreground mx-2">
                        Maximum score for this quiz.
                      </p>
                    </FormItem>
                  )}
                />

                <div className="space-y-4 rounded-lg border p-4 bg-muted/30">
                  <h3 className="font-medium">Quiz details (standalone)</h3>
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
                          form.setValue(
                            "slug",
                            slugify(title, { lower: true }),
                            { shouldValidate: true },
                          );
                      }}
                    >
                      Generate from title
                    </Button>
                  </div>
                  <FormField
                    control={form.control}
                    name="smallDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="mx-2 font-bold">
                          Short description
                        </FormLabel>
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
                  <FormField
                    control={form.control}
                    name="thumbnailKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="mx-2 font-bold">
                          Thumbnail image
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
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isPending}
                  className="font-bold w-full"
                >
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
      )}

      {/* Quizzes Table */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Your quizzes</CardTitle>
          <CardDescription>
            Standalone and other quizzes you created or have access to.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {quizzes.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center text-sm">
              No quizzes yet.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Classroom</TableHead>
                    <TableHead>Link</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quizzes.map((q) => (
                    <TableRow key={q.id}>
                      <TableCell className="font-medium">{q.title}</TableCell>
                      <TableCell>{q.type}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {q.classroom?.title ?? "—"}
                      </TableCell>

                      <TableCell>
                        {q.googleFormUrl ? (
                          <a
                            href={q.googleFormUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-sm inline-flex items-center gap-1"
                          >
                            Open form <ExternalLink className="size-3" />
                          </a>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            In-app
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            q.isPublished
                              ? "text-green-600 dark:text-green-400"
                              : "text-destructive"
                          }
                        >
                          {q.isPublished ? "Published" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVerticalIcon className="size-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/teacher/classes/${classroomId}/quiz/${q.id}`}
                              >
                                <PencilIcon className="size-4" />
                                Edit Quiz
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={async () => {
                                const res = await toggleQuizStatus(q.id);

                                if (res.status === "success") {
                                  toast.success(res.message);
                                  fetchQuizzes();
                                } else {
                                  toast.error(res.message);
                                }
                              }}
                            >
                              <EyeIcon className="size-4" />
                              {q.isPublished ? "Move to Inactive" : "Publish Quiz"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={async () => {
                                if (!confirm("Delete this quiz?")) return;

                                const res = await deleteQuiz(q.id);
                                if (res.status === "success") {
                                  toast.success(res.message);
                                  fetchQuizzes();
                                } else {
                                  toast.error(res.message);
                                }
                              }}
                            >
                              <Trash2Icon className="size-4 text-destructive" />
                              Delete Quiz
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
