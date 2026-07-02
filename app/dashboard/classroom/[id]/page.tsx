import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ClassHeader } from "./_components/ClassHeader";
import { ClassStream } from "./_components/ClassStream";
import { ClassMembers } from "./_components/ClassMembers";
import { getClassroomById } from "@/app/data/classes/get-single-class";
import { requireStudent } from "@/app/data/user/requireStudent";
import { ClassroomEnrollmentButton } from "@/app/(endusers)/classes/_components/ClassEnrollmentButton";

type Params = Promise<{ id: string }>;

export default async function ClassroomViewPage({
  params,
}: {
  params: Params;
}) {
  const user = await requireStudent();
  const { id } = await params;

  const classroom = await getClassroomById(id, user.id);
  if (!classroom) notFound();

  // Check if the user is a member of this classroom
  const membership = await prisma.classroomMember.findUnique({
    where: {
      classroomId_userId: {
        classroomId: classroom.id,
        userId: user.id,
      },
    },
    select: {
      status: true,
    },
  });

  const isMember = !!membership;
  const isApproved = membership?.status === "APPROVED";

  return (
    <div className="space-y-6 py-10 mb-20">
      {/* Header */}
      <ClassHeader classroom={classroom} />

      {!isMember ? (
        <div className="p-4 mx-5 bg-blue-100 border-l-4 border-blue-500 text-blue-800 rounded-md flex flex-col items-start gap-4">
          <span>
            ⚠️ You are not enrolled in this class yet. So, enroll this class
            first
          </span>
          <ClassroomEnrollmentButton classroomId={classroom.id}/>
        </div>
      ) : !isApproved ? (
        <div className="p-4 mx-5 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-md">
          ⚠️ Your enrollment is not yet approved. Approval usually takes up to 3
          days.
          <br />
          Please contact the admin if you need immediate access.
        </div>
      ) : (
        // Content
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-6">
          <div className="lg:col-span-3">
            <ClassStream posts={classroom.posts} />
          </div>

          <div className="lg:col-span-1">
            <ClassMembers
              teacher={classroom.teacher}
              students={classroom.students}
            />
          </div>
        </div>
      )}
    </div>
  );
}
