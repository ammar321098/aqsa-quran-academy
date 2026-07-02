"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Uploader } from "@/components/file-upoader/Uploader";
import {
  inAppQuizSchema,
  InAppQuizSchemaType,
  questionTypeEnum,
} from "@/lib/zodSchema";
import { CreateInAppQuiz, UpdateInAppQuiz } from "../action";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import { Loader2, PlusIcon, Save, Sparkles, Trash2 } from "lucide-react";
import slugify from "slugify";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { useUnsavedChangesGuard } from "@/hooks/use-unsaved-guard";

type CourseOption = { id: string; title: string };
type ChapterOption = { id: string; title: string };

const QUESTION_TYPE_LABELS: Record<(typeof questionTypeEnum)[number], string> =
  {
    SHORT_TEXT: "Short question",
    LONG_TEXT: "Long question",
    SINGLE_CHOICE: "Choose one",
    MULTIPLE_CHOICE: "Multiple selection",
  };

const defaultOption = () => ({ text: "", isCorrect: false });

function getDefaultQuestion(): InAppQuizSchemaType["questions"][0] {
  return {
    text: "",
    questionType: "SINGLE_CHOICE",
    options: [defaultOption(), defaultOption()],
  };
}

export function InAppQuizForm({
  onSuccess,
  courses: initialCourses = [],
  forceStandalone = false,
  initialData,
}: {
  onSuccess?: () => void;
  courses?: CourseOption[];
  /** When true, only standalone quiz can be created (type/course/chapter hidden). */
  forceStandalone?: boolean;
  initialData?: InAppQuizSchemaType & { id: string };
}) {
  const [courses] = useState<CourseOption[]>(initialCourses);
  const [chaptersByCourse, setChaptersByCourse] = useState<
    Record<string, ChapterOption[]>
  >({});
  const [isPending, setPending] = useState(false);

  const isEdit = !!initialData;

  const form = useForm<InAppQuizSchemaType>({
    resolver: zodResolver(inAppQuizSchema) as Resolver<InAppQuizSchemaType>,
    mode: "onSubmit",
    defaultValues: initialData
      ? initialData
      : {
          title: "",
          type: forceStandalone ? "STANDALONE" : "CHAPTER",
          courseId: "",
          chapterId: "",
          slug: "",
          smallDescription: "",
          description: "",
          thumbnailKey: "",
          totalMarks: undefined,
          questions: [getDefaultQuestion()],
        },
  });

  const courseId = useWatch({
    control: form.control,
    name: "courseId",
    defaultValue: "",
  });
  const quizType = useWatch({
    control: form.control,
    name: "type",
    defaultValue: "CHAPTER",
  });

  const chapters =
    courseId && quizType === "CHAPTER"
      ? (chaptersByCourse[courseId] ?? [])
      : [];

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  useEffect(() => {
    if (!initialData) return;

    form.reset(initialData);
  }, [initialData, form]);

  useEffect(() => {
    form.setValue("chapterId", "");
    if (!courseId || quizType !== "CHAPTER") return;
    let cancelled = false;
    fetch(`/api/admin/chapters?courseId=${courseId}`)
      .then((res) => res.json())
      .then((data: ChapterOption[]) => {
        if (!cancelled)
          setChaptersByCourse((prev) => ({ ...prev, [courseId]: data }));
      })
      .catch(console.error);
    return () => {
      cancelled = true;
    };
  }, [courseId, quizType, form]);

  const onSubmit = useCallback(
    (values: InAppQuizSchemaType, mode: "draft" | "publish") => {
      const payload: InAppQuizSchemaType = {
        ...values,
        isPublished: mode === "publish",
        questions: values.questions.map((q) => {
          if (
            q.questionType === "SHORT_TEXT" ||
            q.questionType === "LONG_TEXT"
          ) {
            return { text: q.text, questionType: q.questionType, options: [] };
          }
          return {
            text: q.text,
            questionType: q.questionType,
            options: q.options.filter((o) => o.text.trim().length > 0),
          };
        }),
      };

      const parsed = inAppQuizSchema.safeParse(payload);
      if (!parsed.success) {
        toast.error("Please fix validation errors");
        return;
      }

      setPending(true);

      const action = isEdit
        ? UpdateInAppQuiz(initialData!.id, parsed.data)
        : CreateInAppQuiz(parsed.data);

      tryCatch(action).then(({ data: result, error }) => {
        setPending(false);

        if (error) {
          toast.error("Something went wrong");
          return;
        }

        toast.success(result.message);

        form.reset(parsed.data);

        onSuccess?.();
      });
    },
    [form, onSuccess, isEdit, initialData],
  );
  const isDirty = form.formState.isDirty;
  useUnsavedChangesGuard({ isDirty });

  return (
    <Card className="mt-6" id="create-in-app-quiz">
      <CardHeader>
        <CardTitle>Create quiz inside the app</CardTitle>
        <CardDescription>
          Add questions and choose answer type: short/long text or choose one /
          multiple selection.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              const submitter = (e.nativeEvent as SubmitEvent)
                .submitter as HTMLButtonElement | null;

              const mode = submitter?.value === "publish" ? "publish" : "draft";

              form.handleSubmit((values) => onSubmit(values, mode))(e);
            }}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quiz title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Chapter 1 Review" {...field} />
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
                  <FormLabel>Total marks (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      placeholder="e.g. 100 (leave empty to auto-calculate)"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (v === "") {
                          field.onChange(undefined);
                          return;
                        }
                        const n = parseInt(v, 10);
                        field.onChange(Number.isNaN(n) ? undefined : n);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    Maximum score for this quiz. If empty, each choice question
                    counts as 1 point.
                  </p>
                </FormItem>
              )}
            />

            {!forceStandalone && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quiz type</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(v) => {
                          field.onChange(v);
                          if (v === "STANDALONE") {
                            form.setValue("courseId", "");
                            form.setValue("chapterId", "");
                          }
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Type" />
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
              </div>
            )}

            {(quizType === "STANDALONE" || forceStandalone) && (
              <div className="space-y-4 rounded-lg border p-4 bg-muted/30">
                <h3 className="font-medium">Quiz details (standalone)</h3>
                <div className="flex flex-col sm:flex-row gap-2">
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Slug (URL-friendly, unique)</FormLabel>
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
                      if (title.trim()) {
                        form.setValue("slug", slugify(title, { lower: true }), {
                          shouldValidate: true,
                        });
                      }
                    }}
                  >
                    <Sparkles className="size-4 mr-1" />
                    Generate from title
                  </Button>
                </div>

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

            {!forceStandalone && quizType === "CHAPTER" && (
              <FormField
                control={form.control}
                name="chapterId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chapter</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!courseId}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              courseId
                                ? "Select chapter"
                                : "Select course first"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {chapters.map((ch) => (
                          <SelectItem key={ch.id} value={ch.id}>
                            {ch.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>Questions</FormLabel>
              </div>

              {questionFields.map((qField, qIndex) => (
                <QuestionBlock
                  key={qField.id}
                  qIndex={qIndex}
                  form={form}
                  canRemove={questionFields.length > 1}
                  onRemove={() => removeQuestion(qIndex)}
                />
              ))}
              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendQuestion(getDefaultQuestion())}
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add question
                </Button>
              </div>
            </div>

            {form.formState.errors.questions?.root && (
              <p className="text-sm text-destructive">
                {form.formState.errors.questions.root.message}
              </p>
            )}

            <div className={`${!isEdit && "grid grid-cols-2 gap-2"}`}>
              {!isEdit && (
                <Button
                  variant="outline"
                  type="submit"
                  disabled={isPending}
                  className="w-full"
                  value="draft"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save in Draft
                    </>
                  )}
                </Button>
              )}
              <Button
                type="submit"
                disabled={isPending}
                className="w-full"
                value="publish"
              >
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
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function QuestionBlock({
  qIndex,
  form,
  canRemove,
  onRemove,
}: {
  qIndex: number;
  form: ReturnType<typeof useForm<InAppQuizSchemaType>>;
  canRemove: boolean;
  onRemove: () => void;
}) {
  const questionType =
    useWatch({
      control: form.control,
      name: `questions.${qIndex}.questionType`,
    }) ?? "SINGLE_CHOICE";
  const isChoice =
    questionType === "SINGLE_CHOICE" || questionType === "MULTIPLE_CHOICE";
  const isLong = questionType === "LONG_TEXT";

  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control: form.control,
    name: `questions.${qIndex}.options`,
  });

  return (
    <Card>
      <CardHeader className="py-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Question {qIndex + 1}</CardTitle>
          {canRemove && (
            <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name={`questions.${qIndex}.questionType`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Answer type</FormLabel>
              <Select
                value={field.value}
                onValueChange={(v) => {
                  field.onChange(v);
                  const opts = form.getValues(`questions.${qIndex}.options`);
                  if (v === "SHORT_TEXT" || v === "LONG_TEXT") {
                    form.setValue(`questions.${qIndex}.options`, []);
                  } else if (opts.length === 0) {
                    form.setValue(`questions.${qIndex}.options`, [
                      { text: "", isCorrect: false },
                      { text: "", isCorrect: false },
                    ]);
                  } else if (v === "SINGLE_CHOICE") {
                    const correctCount = opts.filter((o) => o.isCorrect).length;
                    if (correctCount > 1) {
                      const firstCorrectIdx = opts.findIndex(
                        (o) => o.isCorrect,
                      );
                      form.setValue(
                        `questions.${qIndex}.options`,
                        opts.map((o, i) => ({
                          ...o,
                          isCorrect: i === firstCorrectIdx,
                        })),
                      );
                    }
                  }
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {questionTypeEnum.map((t) => (
                    <SelectItem key={t} value={t}>
                      {QUESTION_TYPE_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`questions.${qIndex}.text`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Question text</FormLabel>
              <FormControl>
                {isLong ? (
                  <Textarea placeholder="Enter question" rows={3} {...field} />
                ) : (
                  <Input placeholder="Enter question" {...field} />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isChoice && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <FormLabel className="text-sm">
                Options (
                {questionType === "SINGLE_CHOICE"
                  ? "choose one correct (optional)"
                  : "multiple correct allowed (optional)"}
                )
              </FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendOption({ text: "", isCorrect: false })}
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add option
              </Button>
            </div>
            {optionFields.map((oField, oIndex) => (
              <div key={oField.id} className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name={`questions.${qIndex}.options.${oIndex}.isCorrect`}
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0 shrink-0">
                      <FormControl>
                        <Checkbox
                          checked={!!field.value}
                          onCheckedChange={(checked) => {
                            const isChecked = checked === true;
                            if (questionType === "SINGLE_CHOICE" && isChecked) {
                              optionFields.forEach((_, i) => {
                                form.setValue(
                                  `questions.${qIndex}.options.${i}.isCorrect`,
                                  i === oIndex,
                                  { shouldValidate: true },
                                );
                              });
                            } else {
                              field.onChange(isChecked);
                            }
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`questions.${qIndex}.options.${oIndex}.text`}
                  render={({ field }) => (
                    <FormItem className="flex-1 space-y-0">
                      <FormControl>
                        <Input
                          placeholder={`Option ${oIndex + 1}`}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {optionFields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOption(oIndex)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            ))}
            <FormMessage>
              {
                (
                  form.formState.errors.questions?.[qIndex] as {
                    options?: { message?: string };
                  }
                )?.options?.message
              }
            </FormMessage>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
