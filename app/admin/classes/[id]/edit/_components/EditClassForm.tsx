"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeftIcon,
  Loader2,
  SaveIcon,
  Sparkle,
  UploadIcon,
} from "lucide-react";
import slugify from "slugify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  classroomSchema,
  ClassroomSchemaType,
  courseStatus,
} from "@/lib/zodSchema";

type CourseStatus = (typeof courseStatus)[number];
import { editClassroom } from "../action";
import { useUnsavedChangesGuard } from "@/hooks/use-unsaved-guard";

interface EditClassFormProps {
  data: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    price: number;
    isFree: boolean;
    status: CourseStatus;
    isActive: boolean;
    teacherId: string;
    departmentId: number | null;
  };
  departments: {
    id: number;
    name: string;
  }[];
  teachers: {
    id: string;
    department: { id: number; name: string } | null;
    teacherProfile: { fullName: string } | null;
  }[];
}

export default function EditClassForm({
  data,
  teachers,
  departments,
}: EditClassFormProps) {
  const [filteredTeachers, setFilteredTeachers] = useState(teachers);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<ClassroomSchemaType>({
    resolver: zodResolver(classroomSchema),
    defaultValues: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      price: data.price,
      isFree: data.isFree,
      status: data.status,
      isActive: data.isActive,
      teacherId: data.teacherId,
      departmentId: data.departmentId ?? 0,
    },
  });

  const selectedDepartment = form.watch("departmentId");
  useEffect(() => {
    if (selectedDepartment) {
      setFilteredTeachers(
        teachers.filter((t) => t.department?.id === selectedDepartment),
      );
      // Reset teacherId if it doesn't belong to new department
      if (
        !teachers.some(
          (t) =>
            t.id === form.getValues("teacherId") &&
            t.department?.id === selectedDepartment,
        )
      ) {
        form.setValue("teacherId", "");
      }
    } else {
      setFilteredTeachers(teachers);
    }
  }, [selectedDepartment, teachers]);

  function onSubmit(values: ClassroomSchemaType) {
    startTransition(async () => {
      const res = await editClassroom(values, data.id);
      if (res.status === "error") {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
      router.push("/admin/classes");
    });
  }

  const isDirty = form.formState.isDirty;
  useUnsavedChangesGuard({ isDirty });

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mx-2 font-bold">Class Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter class title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Slug */}
        <div className="flex gap-4 items-end">
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="mx-2 font-bold">Slug</FormLabel>
                <FormControl>
                  <Input readOnly {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="button"
            onClick={() => {
              const slug = slugify(form.getValues("title"), {
                lower: true,
              });
              form.setValue("slug", slug, { shouldValidate: true });
            }}
          >
            Generate <Sparkle size={16} />
          </Button>
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mx-2 font-bold">Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Class description"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  className="min-h-40"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Department */}
          <FormField
            control={form.control}
            name="departmentId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="mx-2 font-bold">Department</FormLabel>
                <Select
                  value={field.value?.toString() || ""} // convert number to string
                  onValueChange={(val) => field.onChange(Number(val))} // convert back to number
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departments.map((d) => (
                      <SelectItem key={d.id} value={d.id.toString()}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Teacher */}
          <FormField
            control={form.control}
            name="teacherId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="mx-2 font-bold">Teacher</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select teacher" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredTeachers.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.teacherProfile?.fullName ?? "Unnamed Teacher"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mx-2 font-bold">Status</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {courseStatus.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Price + Free */}
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
                      <div className="relative inline-flex rounded-lg border bg-muted w-full md:w-auto">
                        {/* Sliding indicator */}
                        <div
                          className={`absolute top-1 bottom-1 left-0 w-1/2 rounded-md bg-primary shadow transition-transform duration-200 ${
                            field.value ? "translate-x-full" : "translate-x-0"
                          }`}
                        />

                        {/* PAID */}
                        <button
                          type="button"
                          className={`relative z-10 flex-1 px-4 py-2 text-center text-sm font-medium transition-colors ${
                            !field.value
                              ? "text-white"
                              : "text-muted-foreground"
                          }`}
                          onClick={() => field.onChange(false)}
                        >
                          Paid
                        </button>

                        {/* FREE */}
                        <button
                          type="button"
                          className={`relative z-10 flex-1 px-4 py-2 text-center text-sm font-medium transition-colors${
                            field.value
                              ? "text-background"
                              : "text-muted-foreground"
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

        {/* Active */}
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Class Active</FormLabel>
            </FormItem>
          )}
        />

        <Button disabled={isPending} type="submit" className="w-full font-bold">
          {isPending ? (
            <>
              Updating <Loader2 className="animate-spin ml-2" />
            </>
          ) : (
            <>
              Update Class <SaveIcon />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
