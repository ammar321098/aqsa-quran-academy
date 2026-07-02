"use client";

import { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { FileText, Video, Newspaper, Plus } from "lucide-react";
import { classPostSchema, ClassPostSchemaType } from "@/lib/zodSchema";
import { createClassPost } from "../action";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PostType = "document" | "video" | "quiz" | null;

export function NewAnnouncement({ classId }: { classId: string }) {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<PostType>(null);
  const [classQuizzes, setClassQuizzes] = useState<
    { id: string; title: string; link: string; isPublished: boolean }[]
  >([]);

  const fetchQuizzes = useCallback(async () => {
    const res = await fetch(`/api/teacher/classrooms/${classId}/allQuizes`);
    if (res.ok) {
      const data = await res.json();
      setClassQuizzes(data);
    }
  }, [classId]);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  const form = useForm<ClassPostSchemaType>({
    resolver: zodResolver(classPostSchema),
    defaultValues: {
      title: "",
      content: "",
      link: "",
      classId,
      quizTitle: "",
      type: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: ClassPostSchemaType) {
    const res = await createClassPost(values);

    if (res.success) {
      toast.success(res.message);
      setOpen(false);
      form.reset();
      setSelectedType(null);
    } else {
      toast.error(res.message);
    }
  }

  const renderLinkField = () => {
    if (!selectedType) return null;

    if (selectedType === "document" || selectedType === "video") {
      return (
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="ml-2 font-bold">
                {selectedType === "document" ? "Document Link" : "Video Link"}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={`Paste ${selectedType} link`}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    form.setValue("type", selectedType); // set type dynamically
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    } else if (selectedType === "quiz") {
      return (
        <FormField
          control={form.control}
          name="quizId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="ml-2 font-bold">Select quiz</FormLabel>

              <Select
                value={field.value || ""}
                onValueChange={(quizId) => {
                  field.onChange(quizId); // now Select controls quizId
                  form.setValue("type", "quiz");

                  const selected = classQuizzes.find((q) => q.id === quizId);
                  if (selected) form.setValue("quizTitle", selected.title);
                }}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a class quiz" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {classQuizzes
                    ?.filter((q) => q.isPublished)
                    .map((quiz) => (
                      <SelectItem key={quiz.id} value={quiz.id}>
                        {quiz.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
      );
    }
  };

  return (
    <>
      <Button
        variant="secondary"
        className="flex-1 justify-center"
        onClick={() => setOpen(true)}
      >
        <Plus />
        New announcement
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Announcement</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="ml-2 font-bold">Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Announcement title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Content */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="ml-2 font-bold">Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your announcement..."
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Conditional fields */}
              {renderLinkField()}

              {/* Type selection buttons */}
              <div className="flex gap-2 mb-4">
                <Button
                  type="button"
                  variant={selectedType === "document" ? "default" : "outline"}
                  className="rounded-full p-2"
                  onClick={() => setSelectedType("document")}
                >
                  <FileText size={20} />
                </Button>
                <Button
                  type="button"
                  variant={selectedType === "video" ? "default" : "outline"}
                  className="rounded-full p-2"
                  onClick={() => setSelectedType("video")}
                >
                  <Video size={20} />
                </Button>
                <Button
                  type="button"
                  variant={selectedType === "quiz" ? "default" : "outline"}
                  className="rounded-full p-2"
                  onClick={() => setSelectedType("quiz")}
                >
                  <Newspaper size={20} />
                </Button>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Posting..." : "Post"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
