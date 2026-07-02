import * as z from "zod";

export const courseLevels = ["Beginner", "Intermediate", "Advanced"] as const;
export const courseStatus = ["Draft", "Published", "Archieved"] as const;
export const courseCategory = [
  "Education",
  "Development",
  "Business",
  "Finance",
  "Marketing",
  "Teaching",
  "IT & Sofaware",
] as const;
export const quizTypeEnum = ["CHAPTER", "COURSE"] as const;

export const courseSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters long")
    .max(50, "Title must be at most 50 characters long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  fileKey: z.string().min(1, "File is required"),
  price: z.number().min(0, "Price must be a positive number"),
  duration: z
    .number()
    .min(1, "Duration must be at least 1 hour")
    .max(500, "Duration must be at most 1 hour"),
  level: z.enum(courseLevels, "Level is required"),
  category: z.enum(courseCategory, "Categoru is required"),
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

    videoSource: z.enum(["UPLOAD", "EMBED"]),
    videoKey: z.string().optional(),
    embedUrl: z.string().url().optional(),
  })
  .refine(
    (data) =>
      data.videoSource === "UPLOAD" ? !!data.videoKey : !!data.embedUrl,
    {
      message: "Video source data missing",
      path: ["videoSource"],
    }
  );

export const quizSchema = z.object({
  title: z.string().min(3, "Quiz title is required"),
  googleFormUrl: z.string().url("Invalid Google Form URL"),
  type: z.enum(quizTypeEnum),
  courseId: z.string().min(1, "Course ID is required"),
  chapterId: z.string().optional(),
});

export type QuizSchemaType = z.infer<typeof quizSchema>;
export type CourseSchemaType = z.infer<typeof courseSchema>;
export type ChapterSchemaType = z.infer<typeof chapterSchema>;
export type LessonSchemaType = z.infer<typeof lessonSchema>;
