import { ClassHeader } from "./_components/ClassHeader";
import { ClassStream } from "./_components/ClassStream";
import { ClassMembers } from "./_components/ClassMembers";
import { getTeacherClassroomById } from "@/app/data/teacher/get-teacher-single-class";

type Params = Promise<{ id: string }>;

export default async function ClassroomViewPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const classroom = await getTeacherClassroomById(id);

  return (
    <div className="space-y-6 py-10 mb-20">
      {/* Header */}
      <ClassHeader classroom={classroom} />

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-6">
        <div className="lg:col-span-3">
          <ClassStream posts={classroom.posts} classId={id} />
        </div>
        <div className="lg:col-span-1">
          <ClassMembers
            teacher={classroom.teacher}
            students={classroom.students}
          />
        </div>
      </div>
    </div>
  );
}
