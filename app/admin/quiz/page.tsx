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
import { Textarea } from "@/components/ui/textarea";
import { Uploader } from "@/components/file-upoader/Uploader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Award,
  Copy,
  Download,
  ExternalLink,
  EyeIcon,
  FileQuestion,
  Loader2,
  MoreVerticalIcon,
  PencilIcon,
  PlusIcon,
  Share2,
  Trash2Icon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { toast } from "sonner";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { quizSchema, QuizSchemaInput, QuizSchemaType } from "@/lib/zodSchema";
import Link from "next/link";
import { tryCatch } from "@/hooks/try-catch";
import { CreateQuiz, deleteQuiz, toggleQuizStatus } from "./action";
import { InAppQuizForm } from "./_components/InAppQuizForm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconExternalLink } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QRCodeCanvas } from "qrcode.react";
import { GoogleFormQuizForm } from "./_components/GoogleQuizForm";

type CourseOption = { id: string; title: string };
type ChapterOption = { id: string; title: string };

type QuizRow = {
  id: string;
  title: string;
  googleFormUrl: string | null;
  type: string;
  isPublished: boolean;
  createdAt: string;
  courseId: string | null;
  chapterId: string | null;
  course: { id: string; title: string } | null;
  chapter: { id: string; title: string } | null;
};

type ActiveForm = "in-app" | "google-form" | null;

export default function CreateQuizForm() {
  const [isPending, startTransition] = useTransition();
  const [activeForm, setActiveForm] = useState<ActiveForm>(null);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [chapters, setChapters] = useState<ChapterOption[]>([]);
  const [quizzes, setQuizzes] = useState<QuizRow[]>([]);
  const [quizzesLoading, setQuizzesLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [shareQuizId, setShareQuizid] = useState<string | null>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  const form = useForm<QuizSchemaInput>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: "",
      googleFormUrl: "",
      type: "CHAPTER",
      courseId: "",
      chapterId: "",
      slug: "",
      smallDescription: "",
      description: "",
      thumbnailKey: "",
      totalMarks: undefined as number | undefined,
    },
  });

  const courseId = form.watch("courseId");
  const quizType = form.watch("type");

  const fetchQuizzes = useCallback(() => {
    fetch("/api/admin/quizzes")
      .then((res) => res.json())
      .then((data) => setQuizzes(data))
      .catch(() => toast.error("Failed to load quizzes"))
      .finally(() => setQuizzesLoading(false));
  }, []);

  useEffect(() => {
    fetch("/api/admin/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  useEffect(() => {
    if (!courseId || quizType !== "CHAPTER") {
      setChapters([]);
      return;
    }
    fetch(`/api/admin/chapters?courseId=${courseId}`)
      .then((res) => res.json())
      .then((data) => setChapters(data))
      .catch(console.error);
  }, [courseId, quizType]);

  function onSubmit(values: QuizSchemaInput) {
    startTransition(async () => {
      const parsed = quizSchema.safeParse(values);
      if (!parsed.success) return;

      const data: QuizSchemaType = parsed.data;

      const { data: result, error } = await tryCatch(CreateQuiz(data));

      if (error) {
        toast.error("Something went wrong");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        form.reset();
        setActiveForm(null);
        fetchQuizzes();
      } else {
        toast.error(result.message);
      }
    });
  }

  const url =
    typeof window !== "undefined" && shareQuizId
      ? `${window.location.origin}/quizzes/${shareQuizId}`
      : "";

  useEffect(() => {
    if (shareQuizId) setIsOpen(true);
  }, [shareQuizId]);

  const downnloadQR = () => {
    setTimeout(() => {
      const canvas = qrRef.current?.querySelector("canvas");

      if (!canvas) {
        toast.error("QR not ready yet...");
        return;
      }

      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = `quiz-${shareQuizId}.png`;
      link.click();
    }, 150);
  };

  return (
    <div className="px-4 lg:px-6 space-y-6">
      <div className="flex flex-col items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-primary">All Quizzes</h1>
          <p className="text-muted-foreground">
            Create and manage quizes for courses, chapters and standalone. Use
            these when creating or editing a quiz.
          </p>
        </div>
      </div>
      <div className="h-px bg-border" />

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

      {/* In-app quiz form - shown when "Create quiz" is active */}
      {activeForm === "in-app" && (
        <InAppQuizForm
          onSuccess={() => {
            fetchQuizzes();
            setActiveForm(null);
          }}
          courses={courses}
        />
      )}

      {/* Google Form quiz form - shown when "Create Google Form quiz" is active */}
      {activeForm === "google-form" && (
        <GoogleFormQuizForm
          courses={courses}
          onSuccess={() => {
            fetchQuizzes();
            setActiveForm(null);
          }}
        />
      )}

      {/* All quizzes table */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>All quizzes</CardTitle>
          <CardDescription>
            In-app quizzes and Google Form quizzes. Click a button above to
            create a new one.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {quizzesLoading ? (
            <p className="text-muted-foreground py-4 text-center text-sm">
              Loading quizzes...
            </p>
          ) : quizzes.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center text-sm">
              No quizzes yet. Click &quot;Create quiz&quot; or &quot;Create
              Google Form quiz&quot; to get started.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Chapter</TableHead>
                    <TableHead>Link</TableHead>
                    <TableHead>Status</TableHead>

                    <TableHead className="text-center">Results</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quizzes.map((q) => (
                    <TableRow key={q.id}>
                      <TableCell className="font-medium">{q.title}</TableCell>
                      <TableCell>{q.type}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {q.course?.title ?? "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {q.chapter?.title ?? "—"}
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

                      <TableCell className="flex justify-center">
                        <Link
                          href={`/admin/quiz/${q.id}/results`}
                          className={buttonVariants({
                            variant: "ghost",
                            size: "sm",
                            className: "text-primary p-0",
                          })}
                        >
                          <Award />
                          Results
                        </Link>
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
                              <Link href={`/admin/quiz/${q.id}`}>
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
                              {q.isPublished ? "Inactive Quiz" : "Publish Quiz"}
                            </DropdownMenuItem>
                            {q.type === "STANDALONE" && (
                              <DropdownMenuItem
                                onClick={() => {
                                  setShareQuizid(q.id);
                                  setIsOpen(true);
                                }}
                              >
                                <Share2 className="size-4" />
                                Share Quiz
                              </DropdownMenuItem>
                            )}
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

      {/* Dialogue for copy and share quiz */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">Share Quiz</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            {/* QR Code */}
            <div ref={qrRef} className="bg-white p-2">
              <QRCodeCanvas value={url} size={180} level="H" />
            </div>

            {/* Course URL */}
            <p className="text-xs text-muted-foreground text-center break-all">
              {url}
            </p>

            {/* Copy Button */}
            <Button
              className="w-full"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(url);
                  toast.success("Link copied!");
                } catch {
                  toast.error("Clipboard blocked — copy manually");
                }
              }}
            >
              Copy Link <Copy />
            </Button>

            <Button variant="outline" className="w-full" onClick={downnloadQR}>
              Download QR <Download />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
