import { ReactNode } from "react";
import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";
import { CourseSidebar } from "../../_components/CourseSidebar";


interface iAppProps {
  params: Promise<{ slug: string }>;
  children: ReactNode;
}

export default async function CourseLayout({ params, children }: iAppProps) {
  const { slug } = await params;

  // server-side security check and lightweight data fetching
  const courseData = await getCourseSidebarData(slug);

  return (
    <div className="flex flex-1">
      {/* sidebar - 30% */}
      <div className="w-80 border-r border-border shrink-0">
        <CourseSidebar course={courseData.course} />
      </div>

      {/* Main content - 70% */}
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
