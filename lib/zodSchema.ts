import * as z from "zod";

export const courseLevels = ["Beginner", "Intermediate", "Advanced"] as const;
export const courseStatus = ["Draft", "Published", "Archieved"] as const;
export const quizTypeEnum = [
  "CHAPTER",
  "COURSE",
  "STANDALONE",
  "CLASSROOM",
] as const;

export const courseSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters long")
    .max(100, "Title must be at most 100 characters long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  fileKey: z.string().min(1, "File is required"),
  price: z.number().min(0, "Price must be a positive number"),
  duration: z
    .number()
    .min(1, "Duration must be at least 1 day")
    .max(3650, "Duration must be at most 3650 days"),
  level: z.enum(courseLevels, "Level is required"),
  category: z.string().min(1, "Category is required"),
  needsToWorkOn: z.string().optional(),
  smallDescription: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(200, "Title must be at most 200 characters long"),
  slug: z.string().min(3, "Title must be at least 3 characters long"),
  status: z.enum(courseStatus, "Status is required"),
  isFree: z.boolean(),
  isFeatured: z.boolean(),
});

export const chapterSchema = z.object({
  name: z.string().min(3, "name must be at least 3 characters long "),
  courseId: z.string().uuid({ message: "Invalid course id" }),
});

export const lessonSchema = z
  .object({
    name: z.string().min(3, "name must be at least 3 characters long"),
    courseId: z.string().uuid({ message: "Invalid course id" }),
    chapterId: z.string().uuid({ message: "Invalid chapter id" }),
    description: z.string().optional(),
    thumbnailKey: z.string().optional(),

    videoSource: z.enum(["UPLOAD", "EMBED"]).optional(),
    videoKey: z.string().optional(),
    embedUrl: z.string().url().optional(),
  })
  .refine(
    (data) =>
      data.videoSource === "UPLOAD" ? !!data.videoKey : !!data.embedUrl,
    {
      message: "Video source data missing",
      path: ["videoSource"],
    },
  );

export const quizSchema = z
  .object({
    title: z.string().min(3, "Quiz title is required"),
    googleFormUrl: z.string().url("Invalid Google Form URL"),
    type: z.enum(quizTypeEnum),
    courseId: z.string().optional(),
    chapterId: z.string().optional(),
    slug: z.string().optional(),
    smallDescription: z.string().optional(),
    description: z.string().optional(),
    thumbnailKey: z.string().optional(),
    totalMarks: z
      .union([z.undefined(), z.literal(""), z.string(), z.number()])
      .optional()
      .transform((v) => {
        if (v === "" || v === undefined) return undefined;
        const n = typeof v === "number" ? v : parseInt(String(v), 10);
        return !Number.isNaN(n) && n >= 1 ? n : undefined;
      }),
  })
  .refine(
    (data) => {
      if (data.type === "STANDALONE") return true;
      return !!data.courseId && data.courseId.length > 0;
    },
    {
      message: "Course or Classroom is required when quiz is not standalone",
      path: ["courseId"],
    },
  )
  .refine(
    (data) => {
      if (data.type !== "CHAPTER") return true;
      return !!data.chapterId && data.chapterId.length > 0;
    },
    { message: "Chapter is required for chapter quiz", path: ["chapterId"] },
  )
  .refine(
    (data) => {
      if (data.type !== "STANDALONE") return true;
      return !!data.slug && data.slug.trim().length >= 3;
    },
    {
      message: "Slug is required for standalone quiz (min 3 characters)",
      path: ["slug"],
    },
  );

export const questionTypeEnum = [
  "SHORT_TEXT",
  "LONG_TEXT",
  "SINGLE_CHOICE",
  "MULTIPLE_CHOICE",
] as const;

// Allow empty text; the refine on quizQuestionSchema validates filled options for choice questions
export const quizOptionSchema = z.object({
  text: z.string(),
  isCorrect: z.boolean(),
});

export const quizQuestionSchema = z
  .object({
    text: z.string().min(3, "Question text is required"),
    questionType: z.enum(questionTypeEnum),
    options: z.array(quizOptionSchema).default([]),
  })
  .superRefine((q, ctx) => {
    if (q.questionType === "SHORT_TEXT" || q.questionType === "LONG_TEXT")
      return;
    const filled = q.options.filter((o) => o.text.trim().length > 0);
    if (filled.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Choice questions need at least 2 options with text.",
        path: ["options"],
      });
      return;
    }
    if (q.questionType === "SINGLE_CHOICE") {
      const correctCount = filled.filter((o) => o.isCorrect).length;
      if (correctCount > 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Choose one: select at most one option as correct (or leave all unchecked).",
          path: ["options"],
        });
      }
      return;
    }
    // MULTIPLE_CHOICE: correct answer is optional (0 or more)
  });

export const inAppQuizSchema = z
  .object({
    title: z.string().min(3, "Quiz title is required"),
    type: z.enum(quizTypeEnum),
    courseId: z.string().optional(),
    chapterId: z.string().optional(),
    slug: z.string().optional(),
    smallDescription: z.string().optional(),
    description: z.string().optional(),
    thumbnailKey: z.string().optional(),
    isPublished: z.boolean().optional().default(false),
    totalMarks: z
      .union([z.undefined(), z.literal(""), z.string(), z.number()])
      .optional()
      .transform((v) => {
        if (v === "" || v === undefined) return undefined;
        const n = typeof v === "number" ? v : parseInt(String(v), 10);
        return !Number.isNaN(n) && n >= 1 ? n : undefined;
      }),
    questions: z.array(quizQuestionSchema).min(1, "Add at least one question"),
  })
  .refine(
    (data) => {
      if (data.type !== "CHAPTER") return true;
      return !!data.chapterId && data.chapterId.length > 0;
    },
    { message: "Chapter is required for chapter quiz", path: ["chapterId"] },
  )
  .refine(
    (data) => {
      if (data.type !== "STANDALONE") return true;
      return !!data.slug && data.slug.trim().length >= 3;
    },
    {
      message: "Slug is required for standalone quiz (min 3 characters)",
      path: ["slug"],
    },
  );

export const baseUserSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  cnic: z
    .string()
    .regex(/^\d{5}-\d{7}-\d$/, "CNIC format must be xxxxx-xxxxxxx-x"),
  departmentId: z.string().min(1, "Select a department"),
  role: z.number(),
});

export const studentSchema = baseUserSchema.extend({
  phone: z.string().min(10),
  address: z.string().min(5),
});

export const teacherSchema = baseUserSchema.extend({
  // teacher-specific fields (if any later)
});

export const classroomSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().nullable(),
  price: z.number().min(0),
  isFree: z.boolean(),
  status: z.enum(courseStatus),
  isActive: z.boolean(),
  teacherId: z.string().uuid(),
  departmentId: z.number().min(1),
});

export const classPostSchema = z.object({
  title: z.string().min(3, "Title is required"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  classId: z.string(),
  link: z.string().optional(),
  quizTitle: z.string(),
  type: z.string(),
  quizId: z.string().optional(),
});

export const teacherQuizSchema = z.object({
  title: z.string().min(3, "Content must be at least 3 characters"),

  classroomId: z.string().uuid(),

  slug: z
    .string()
    .min(1, "Quiz Slug required! Click generate button to generate slug."),
  smallDescription: z.string().optional(),
  description: z.string().optional(),
  thumbnailKey: z.string().optional(),
  isPublished: z.boolean().optional().default(false),

  totalMarks: z
    .string()
    .optional()
    .transform((v) => {
      if (!v || v.trim() === "") return undefined;
      const n = parseInt(v, 10);
      return !Number.isNaN(n) ? n : undefined;
    }),

  googleFormUrl: z.string().url().optional(),
  questions: z.array(quizQuestionSchema).optional(),
});

export type QuizSchemaInput = z.input<typeof quizSchema>; // for forms
export type QuizSchemaType = z.output<typeof quizSchema>; // for server/db
export type CourseSchemaType = z.infer<typeof courseSchema>;
export type ChapterSchemaType = z.infer<typeof chapterSchema>;
export type LessonSchemaType = z.infer<typeof lessonSchema>;
export type StudentSchemaType = z.infer<typeof studentSchema>;
export type TeacherSchemaType = z.infer<typeof teacherSchema>;
export type BaseUserSchemaType = z.infer<typeof baseUserSchema>;
export type ClassroomSchemaType = z.infer<typeof classroomSchema>;
export type ClassPostSchemaType = z.infer<typeof classPostSchema>;
export type InAppQuizSchemaInput = z.input<typeof inAppQuizSchema>;
export type InAppQuizSchemaType = z.output<typeof inAppQuizSchema>;
export type TeacherQuizSchemaInput = z.input<typeof teacherQuizSchema>; // for forms
export type TeacherQuizSchemaType = z.output<typeof teacherQuizSchema>; // for server/db
