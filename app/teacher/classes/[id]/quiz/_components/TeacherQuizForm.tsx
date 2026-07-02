"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Uploader } from "@/components/file-upoader/Uploader";
import { Loader2, PlusIcon, Trash2, Sparkles, Plus, Save } from "lucide-react";
import slugify from "slugify";
import { toast } from "sonner";

import {
  teacherQuizSchema,
  TeacherQuizSchemaInput,
  TeacherQuizSchemaType,
  questionTypeEnum,
} from "@/lib/zodSchema";
import {
  CreateTeacherClassQuizWithQuestions,
  UpdateTeacherClassQuizWithQuestions,
} from "../action";
import { tryCatch } from "@/hooks/try-catch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { useUnsavedChangesGuard } from "@/hooks/use-unsaved-guard";

const QUESTION_TYPE_LABELS: Record<(typeof questionTypeEnum)[number], string> =
  {
    SHORT_TEXT: "Short question",
    LONG_TEXT: "Long question",
    SINGLE_CHOICE: "Choose one",
    MULTIPLE_CHOICE: "Multiple selection",
  };

const defaultOption = () => ({ text: "", isCorrect: false });

// Define the type of a single question
type TeacherQuestion = NonNullable<TeacherQuizSchemaType["questions"]>[number];

function getDefaultQuestion(): TeacherQuestion {
  return {
    text: "",
    questionType: "SINGLE_CHOICE",
    options: [defaultOption(), defaultOption()],
  };
}
export function TeacherClassQuizForm({
  classroomId,
  onSuccess,
  initialData,
}: {
  classroomId: string;
  onSuccess?: () => void;
  initialData?: TeacherQuizSchemaType & { id: string };
}) {
  const [isPending, setPending] = useState(false);
  const isEdit = !!initialData;

  const form = useForm<TeacherQuizSchemaInput>({
    resolver: zodResolver(
      teacherQuizSchema,
    ) as Resolver<TeacherQuizSchemaInput>,
    mode: "onSubmit",
    defaultValues: initialData
      ? {
          ...initialData,
          totalMarks:
            initialData.totalMarks !== undefined &&
            initialData.totalMarks !== null
              ? String(initialData.totalMarks)
              : undefined,
        }
      : {
          title: "",
          classroomId,
          slug: "",
          smallDescription: "",
          description: "",
          thumbnailKey: "",
          totalMarks: undefined,
          questions: [getDefaultQuestion()],
        },
  });

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const onSubmit = useCallback(
    (values: TeacherQuizSchemaInput, mode: "draft" | "publish") => {
      const payload: TeacherQuizSchemaType & { type: "CLASSROOM" } = {
        ...values,
        classroomId,
        isPublished: mode === "publish",
        type: "CLASSROOM",
        totalMarks:
          typeof values.totalMarks === "string"
            ? parseInt(values.totalMarks, 10) || undefined
            : values.totalMarks,
        questions: values.questions?.map((q) => {
          if (
            q.questionType === "SHORT_TEXT" ||
            q.questionType === "LONG_TEXT"
          ) {
            return { text: q.text, questionType: q.questionType, options: [] };
          }
          return {
            text: q.text,
            questionType: q.questionType,
            options: (q.options || []).filter((o) => o.text.trim().length > 0),
          };
        }),
      };

      setPending(true);

      const action = isEdit
        ? UpdateTeacherClassQuizWithQuestions(initialData!.id, payload)
        : CreateTeacherClassQuizWithQuestions(payload);

      tryCatch(action).then(({ data, error }) => {
        setPending(false);

        if (error) {
          toast.error("Something went wrong");
          return;
        }

        toast.success(data?.message ?? (isEdit ? "Updated" : "Created"));

        if (!isEdit) {
          form.reset({
            title: "",
            classroomId,
            slug: "",
            smallDescription: "",
            description: "",
            thumbnailKey: "",
            totalMarks: undefined,
            questions: [getDefaultQuestion()],
          });
        }

        onSuccess?.();
      });
    },
    [form, classroomId, onSuccess, isEdit, initialData],
  );

  const isDirty = form.formState.isDirty;
  useUnsavedChangesGuard({ isDirty });

  return (
    <Card className="mt-6" id="teacher-class-quiz-form">
      <CardHeader>
        <CardTitle>Create quiz for classroom</CardTitle>
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
            {/* Title */}
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

            {/* Slug */}
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug (URL-friendly)</FormLabel>
                  <div className="flex gap-2 items-end">
                    <FormControl>
                      <Input
                        disabled
                        placeholder="e.g. chapter-1-quiz"
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        form.setValue(
                          "slug",
                          slugify(form.getValues("title") || "", {
                            lower: true,
                          }),
                          { shouldValidate: true },
                        )
                      }
                    >
                      <Sparkles className="size-4 mr-1" />
                      Generate
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Short description */}
            <FormField
              control={form.control}
              name="smallDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Brief summary" {...field} />
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
                  <FormLabel className="mx-2 font-bold">Description</FormLabel>
                  <FormControl>
                    <RichTextEditor field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Thumbnail */}
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

            {/* Total Marks */}
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
                      placeholder="e.g. 100"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const n = parseInt(e.target.value, 10);
                        field.onChange(Number.isNaN(n) ? undefined : n);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Questions */}
            <div className="space-y-4">
              {questionFields.map((qField, qIndex) => (
                <TeacherQuestionBlock
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
                  <PlusIcon className="h-4 w-4" />
                  Add question
                </Button>
              </div>
            </div>

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
                      <Loader2 className="h-4 w-4 animate-spin" />
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
                  "Update Quiz"
                ) : (
                  "Create Quiz"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

// Question block
function TeacherQuestionBlock({
  qIndex,
  form,
  canRemove,
  onRemove,
}: {
  qIndex: number;
  form: ReturnType<typeof useForm<TeacherQuizSchemaInput>>;
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
      <CardHeader className="py-3 flex justify-between items-center">
        <CardTitle className="text-base">Question {qIndex + 1}</CardTitle>
        {canRemove && (
          <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Question type */}
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
                  if (v === "SHORT_TEXT" || v === "LONG_TEXT") {
                    form.setValue(`questions.${qIndex}.options`, []);
                  } else if (optionFields.length === 0) {
                    form.setValue(`questions.${qIndex}.options`, [
                      defaultOption(),
                      defaultOption(),
                    ]);
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

        {/* Question text */}
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

        {/* Options */}
        {isChoice && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <FormLabel className="text-sm">
                Options (
                {questionType === "SINGLE_CHOICE"
                  ? "choose one correct"
                  : "multiple correct allowed"}
                )
              </FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendOption(defaultOption())}
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add option
              </Button>
            </div>
            {optionFields.map((oField, oIndex) => (
              <div key={oField.id} className="flex items-center gap-2">
                {/* Correct checkbox */}
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
                              optionFields.forEach((_, i) =>
                                form.setValue(
                                  `questions.${qIndex}.options.${i}.isCorrect`,
                                  i === oIndex,
                                ),
                              );
                            } else {
                              field.onChange(isChecked);
                            }
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {/* Option text */}
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
                {/* Remove option */}
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
