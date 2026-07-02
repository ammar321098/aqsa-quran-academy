import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";
import { redirect } from "next/navigation";

interface iAppProps {
  params: Promise<{ slug: string }>;
}

export default async function CourseSlugRoute({ params }: iAppProps) {
  const { slug } = await params;

  const courseData = await getCourseSidebarData(slug);

  const chapters = courseData?.course?.chapters ?? [];

  const firstLesson = chapters
    .flatMap((chapter: any) => chapter.lessons ?? [])
    .sort((a: any, b: any) => a.position - b.position)[0];

  if (firstLesson) {
    redirect(`/dashboard/course/${slug}/${firstLesson.id}`);
  }

  return (
    <div className="flex items-center justify-center h-full text-center">
      <div>
        <h2 className="text-2xl font-bold mb-2">No lessons available</h2>
        <p className="text-muted-foreground">
          This course doesn't have any lessons yet!
        </p>
      </div>
    </div>
  );
}
