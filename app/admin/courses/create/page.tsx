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
  courseLevels,
  courseSchema,
  CourseSchemaType,
  courseStatus,
} from "@/lib/zodSchema";
import {
  ArrowLeft,
  ArrowLeftIcon,
  Loader2,
  PlusIcon,
  Sparkle,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import slugify from "slugify";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { Uploader } from "@/components/file-upoader/Uploader";
import { useEffect, useState, useTransition } from "react";
import { tryCatch } from "@/hooks/try-catch";
import { CreateCourse } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useConfetti } from "@/hooks/use-confetti";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createCourseCategory } from "@/app/admin/course-categories/actions";
import { Label } from "@/components/ui/label";
import { useUnsavedChangesGuard } from "@/hooks/use-unsaved-guard";

type CategoryOption = { id: string; name: string };

export default function CourseCreationPage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { triggerConfetti } = useConfetti();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryPending, setCategoryPending] = useState(false);

  const form = useForm<CourseSchemaType>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      fileKey: "",
      price: 0,
      duration: 1,
      level: "Beginner",
      category: "",
      needsToWorkOn: "",
      status: "Draft",
      slug: "",
      smallDescription: "",
      isFree: false,
      isFeatured: false,
    },
  });

  useEffect(() => {
    fetch("/api/admin/course-categories")
      .then((res) => res.json())
      .then((data: CategoryOption[]) => setCategories(data))
      .catch(console.error);
  }, []);

  async function handleCreateCategory() {
    if (!newCategoryName.trim()) return;
    setCategoryPending(true);
    const { data, error } = await tryCatch(
      createCourseCategory(newCategoryName.trim()),
    );
    setCategoryPending(false);
    if (error) {
      toast.error("Something went wrong");
      return;
    }
    if (data?.status === "success") {
      const res = await fetch("/api/admin/course-categories");
      const list = await res.json();
      setCategories(list);
      form.setValue("category", newCategoryName.trim());
      setNewCategoryName("");
      setCategoryDialogOpen(false);
      toast.success(data.message);
    } else {
      toast.error(data?.message ?? "Failed");
    }
  }

  function onSubmit(values: CourseSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(CreateCourse(values));

      if (error) {
        toast.error("Error in course creation. Please try again later");
        return;
      }

      if (result.status === "success") {
        // confetti animation
        triggerConfetti();
        //reset the form values
        form.reset();
        //redirect the courses page
        router.push("/admin/courses");
        toast.success(result.message);
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }

  const isDirty = form.formState.isDirty;
  useUnsavedChangesGuard({ isDirty });

  return (
    <>
      <div className="flex items-center gap-2">
        <Link
          href="/admin/courses"
          className={buttonVariants({
            variant: "outline",
            size: "icon-sm",
          })}
        >
          <ArrowLeftIcon className="size-4" />
        </Link>
        <h1 className="text-2xl">Create Courses</h1>
      </div>

      <Card className="mt-6 mx-10">
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Provide basic information about the course
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              {/* Basic title section */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mx-2 font-bold">
                      Course Title
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Course Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Slug generatio section */}
              <div className="flex items-end gap-4 mb-10">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="mx-2 font-bold">
                        Course Slug
                      </FormLabel>
                      <FormControl>
                        <Input
                          readOnly
                          placeholder="Enter Course Slug"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  onClick={() => {
                    const tileValue = form.getValues("title");
                    const slug = slugify(tileValue, { lower: true });
                    form.setValue("slug", slug, { shouldValidate: true });
                  }}
                  className="hover:cursor-pointer"
                >
                  Generate Slug <Sparkle className="ml-1" size={16} />
                </Button>
              </div>

              {/* small description section here */}
              <FormField
                control={form.control}
                name="smallDescription"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="mx-2 font-bold">
                      Small Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter Small Description"
                        {...field}
                        className="min-h-20"
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

              {/* File Section here */}
              <FormField
                control={form.control}
                name="fileKey"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="mx-2 font-bold">
                      Thumbnail Image{" "}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="mx-2 font-bold">
                        Course Category
                      </FormLabel>
                      <div className="flex gap-2">
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="Select or create category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.name}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Dialog
                          open={categoryDialogOpen}
                          onOpenChange={setCategoryDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button type="button" variant="outline">
                              <PlusIcon className="h-4 w-4 mr-1" />
                              New
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Create category</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-2">
                              <div className="space-y-2">
                                <Label htmlFor="new-cat-name">Name</Label>
                                <Input
                                  id="new-cat-name"
                                  value={newCategoryName}
                                  onChange={(e) =>
                                    setNewCategoryName(e.target.value)
                                  }
                                  placeholder="e.g. Tafseer"
                                />
                              </div>
                              <Button
                                onClick={handleCreateCategory}
                                disabled={
                                  categoryPending || !newCategoryName.trim()
                                }
                              >
                                {categoryPending ? "Creating…" : "Create"}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="needsToWorkOn"
                  render={({ field }) => (
                    <FormItem className="w-full md:col-span-2">
                      <FormLabel className="mx-2 font-bold">
                        What do you need to work on for this course?
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g. Recitation practice, memorization, understanding tafseer"
                          className="min-h-20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="mx-2 font-bold">
                        Course Level{" "}
                      </FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {courseLevels.map((lvl) => (
                            <SelectItem key={lvl} value={lvl}>
                              {lvl}
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
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="mx-2 font-bold">
                        Course Duration (Days)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          placeholder="Enter duration in days"
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="md:flex-3">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="mx-2 font-bold">
                            Course Price (Rs.)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              placeholder="Enter Course Price"
                              disabled={form.watch("isFree")}
                              value={field.value}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="md:flex-1">
                    <FormField
                      control={form.control}
                      name="isFree"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="relative inline-flex rounded-lg border bg-muted">
                              {/* Sliding indicator */}
                              <div
                                className={`absolute top-1 bottom-1 w-1/2 rounded-md bg-primary shadow transition-transform duration-200 ${
                                  field.value
                                    ? "translate-x-full"
                                    : "translate-x-0"
                                }`}
                              />

                              {/* PAID */}
                              <button
                                type="button"
                                className={`relative z-10 px-4 py-2 text-sm font-medium transition-colors ${
                                  !field.value ? "" : "text-muted-foreground"
                                }`}
                                onClick={() => field.onChange(false)}
                              >
                                Paid
                              </button>

                              {/* FREE */}
                              <button
                                type="button"
                                className={`relative z-10 px-4 py-2 text-sm font-medium transition-colors ${
                                  field.value ? "" : "text-muted-foreground"
                                }`}
                                onClick={() => {
                                  field.onChange(true);
                                  form.setValue("price", 0, {
                                    shouldValidate: true,
                                  });
                                }}
                              >
                                Free
                              </button>
                            </div>
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="mx-2 font-bold">
                      Course Status{" "}
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courseStatus.map((sts) => (
                          <SelectItem key={sts} value={sts}>
                            {sts}
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
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start gap-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={form.watch("status") !== "Published"}
                      />
                    </FormControl>

                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-bold flex items-center gap-1">
                        Featured Course{" "}
                        <Star size={14} className="text-yellow-500" />
                      </FormLabel>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isPending}
                className="font-bold w-full"
              >
                {isPending ? (
                  <>
                    Creating...
                    <Loader2 className="animate-spin " />
                  </>
                ) : (
                  <>
                    Create Course
                    <PlusIcon size={16} />
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
