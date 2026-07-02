import { adminGetCourse } from "@/app/data/admin/admin-get-course";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditCourseForm } from "./_components/EditCourseForm";
import { CourseStructure } from "./_components/CourseStructure";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Suspense } from "react";

type Params = Promise<{ id: string }>;

export default async function EditRoute({ params }: { params: Params }) {
  const { id } = await params;
  const data = await adminGetCourse(id);
  return (
    <div>
      <div className="flex gap-4">
        <Link
          href="/admin/courses"
          className={buttonVariants({
            variant: "outline",
            size: "icon-sm",
          })}
        >
          <ArrowLeftIcon className="size-4" />
        </Link>

        <h1 className="text-2xl font-bold mb-8">
          Edit Course: <span className="text-primary">{data.title}</span>
        </h1>
      </div>

      {/* tabs section here */}
      <Tabs defaultValue="basic-info" className="mt-6 mx-10">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="basic-info">Basic Information </TabsTrigger>
          <TabsTrigger value="course-structure">Course Structure</TabsTrigger>
        </TabsList>
        <TabsContent value="basic-info">
          <Card>
            <CardHeader>
              <CardTitle>Edit Basic Information</CardTitle>
              <CardDescription>
                Edit & upddate basic information about this perticulat course.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EditCourseForm data={data} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="course-structure">
          <Card>
            <CardHeader>
              <CardTitle>Edit Course Structure</CardTitle>
              <CardDescription>
                Edit & update structure of this perticulat course.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CourseStructure data={data} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
