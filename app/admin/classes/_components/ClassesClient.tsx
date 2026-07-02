"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Sparkle, Trash2Icon } from "lucide-react";
import { IconBuilding } from "@tabler/icons-react";
import { toast } from "sonner";
import slugify from "slugify";
import { createClassroom } from "../action";
import DeleteClassroom from "./DeleteClassroom";
import { AdminCourseCard } from "../../courses/_components/AdminCourseCard";
import { AdminClassroomCard } from "./AdminClassCard";

interface courseData {
  name: string;
  slug: string;
}

export type ClassroomCardData = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  teacher: {
    image: string | null;
    teacherProfile: {
      fullName: string;
    } | null;
  };
};

export default function ClassesClient({
  classes,
}: {
  classes: ClassroomCardData[];
}) {
  const [data, setData] = useState<courseData>({ name: "", slug: "" });
  const [loading, setLoading] = useState(false);

  return (
    <div className="px-4 lg:px-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-primary">Classes</h1>
        <p className="text-muted-foreground">
          Add & Manage academic classes for students
        </p>
      </div>
        <div className="h-px bg-border my-4" />

      {/* Add Department */}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);

          if (!data.name || !data.slug) {
            toast.error("Name and slug are required");
            setLoading(false);
            return;
          }

          const res = await createClassroom({
            name: data.name,
            slug: data.slug,
          });

          if (res.status === "error") {
            toast.error(res.message);
            setLoading(false);
            return;
          }

          toast.success(res.message);

          // Reset form
          setData({ name: "", slug: "" });
          setLoading(false);
        }}
      >
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2 pb-5">
              Add Class
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div className="space-y-1">
                <Label className="mx-2 mb-2">Class Name</Label>
                <Input
                  required
                  name="name"
                  placeholder="Class Name"
                  value={data.name}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex justify-between items-end gap-2">
                <div className="space-y-1 w-full">
                  <Label className="mx-2 mb-2">Slug</Label>
                  <Input
                    required
                    disabled
                    name="slug"
                    placeholder="Unique slug"
                    value={data.slug}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        slug: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Button
                    type="button"
                    onClick={() => {
                      const sluged = slugify(data.name, { lower: true });
                      setData((prev) => ({ ...prev, slug: sluged }));
                    }}
                    className="hover:cursor-pointer"
                  >
                    Generate Slug <Sparkle className="ml-1" size={16} />
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex items-end">
              <Button
                type="submit"
                className="w-full font-bold"
                disabled={loading}
              >
                {loading ? (
                  "Creating..."
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Create New Class
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Department List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <AdminClassroomCard key={cls.id} classroom={cls} />
        ))}
      </div>
    </div>
  );
}
