"use client";

import { Button } from "@/components/ui/button";
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
  courseCategory,
  courseLevels,
  courseSchema,
  CourseSchemaType,
  courseStatus,
} from "@/lib/zodSchema";
import { Loader2, Sparkle, Star, UploadIcon } from "lucide-react";

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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import { editCourse } from "../actions";
import { AdminCourseSingularType } from "@/app/data/admin/admin-get-course";
import { Checkbox } from "@/components/ui/checkbox";

interface iAppProps {
  data: AdminCourseSingularType;
}

export function EditCourseForm({ data }: iAppProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<CourseSchemaType>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: data.title,
      description: data.description,
      fileKey: data.fileKey,
      price: data.price,
      duration: data.duration,
      level: data.level,
      category: data.category as CourseSchemaType["category"],
      status: data.status,
      slug: data.slug,
      smallDescription: data.smallDescription,
      isFree: false,
      isFeatured: data.isFeatured,
    },
  });

  function onSubmit(values: CourseSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        editCourse(values, data.id)
      );

      if (error) {
        toast.error("Error in course creation. Please try again later");
        return;
      }

      if (result.status === "success") {
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
  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Basic title section */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mx-4 font-bold">Course Title</FormLabel>
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
                <FormLabel className="mx-4 font-bold">Course Slug</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Course Slug" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            onClick={() => {
              const tileValue = form.getValues("title");
              const slug = slugify(tileValue);
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
              <FormLabel className="mx-4 font-bold">
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
              <FormLabel className="mx-4 font-bold">Description</FormLabel>
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
              <FormLabel className="mx-4 font-bold">Thumbnail Image </FormLabel>
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
                <FormLabel className="mx-4 font-bold">
                  Course Category{" "}
                </FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {courseCategory.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
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
            name="level"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="mx-4 font-bold">Course Level </FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
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
                <FormLabel className="mx-4 font-bold">
                  Course Duration (Hour(s))
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    placeholder="Enter Course Duration"
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
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
                    <FormLabel className="mx-4 font-bold">
                      Course Price (Rs.)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        placeholder="Enter Course Price"
                        disabled={form.watch("isFree")}
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
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
                            field.value ? "translate-x-full" : "translate-x-0"
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
              <FormLabel className="mx-4 font-bold">Course Status </FormLabel>
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
                  Featured Course <Star size={14} className="text-yellow-500" />
                </FormLabel>
              </div>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isPending}
          className="font-bold hover:cursor-pointer"
        >
          {isPending ? (
            <>
              Updation...
              <Loader2 className="animate-spin " />
            </>
          ) : (
            <>
              Update Course <UploadIcon size={16} />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
