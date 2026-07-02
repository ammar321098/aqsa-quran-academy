import { adminGetClassroom } from "@/app/data/admin/admin-get-classroom";
import EditClassForm from "./_components/EditClassForm";
import { prisma } from "@/lib/db";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeftIcon, Edit, Users } from "lucide-react";
import ClassMembers from "./_components/ClassMembers";
import { adminGetClassroomMembers } from "@/app/data/admin/admin-get-class-members";
import { AddStudentsToClass } from "./_components/AddStudentsToClass";
import { getNonMemberStudents } from "@/app/data/classes/get-non-members";

export default async function ClassEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const departments = await prisma.department.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  const data = await adminGetClassroom(id);
  const membersData = await adminGetClassroomMembers(id);
  const rawStudents = await getNonMemberStudents(id);

  const nonMembers = rawStudents.map((u) => ({
    id: u.id,
    fullName: u.studentProfile?.fullName ?? "Unnamed Student",
    rollNumber: u.rollNumber ?? "N/A",
    photo: u.image,
  }));

  const teachers = await prisma.user.findMany({
    where: { isTeacher: true },
    select: {
      id: true,
      department: {
        select: {
          id: true,
          name: true,
        },
      },
      teacherProfile: {
        select: {
          fullName: true,
        },
      },
    },
  });

  return (
    <>
      <div className="flex items-center gap-2">
        <Link
          href="/admin/classes"
          className={buttonVariants({
            variant: "outline",
            size: "icon-sm",
          })}
        >
          <ArrowLeftIcon className="size-4" />
        </Link>
        <h1 className="text-2xl">Edit Class</h1>
      </div>
      {/* tabs section here */}
      <Tabs defaultValue="class-info" className="mt-6 mx-10">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="class-info">
            <Edit /> Class Information
          </TabsTrigger>
          <TabsTrigger value="class-members">
            <Users /> Class Members
          </TabsTrigger>
        </TabsList>
        <TabsContent value="class-info">
          <Card>
            <CardHeader>
              <CardTitle>Edit Class Information</CardTitle>
              <CardDescription>
                Provide total information about the class.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EditClassForm
                data={data}
                teachers={teachers}
                departments={departments}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="class-members">
          <Card>
            <CardHeader>
              <CardTitle>Verify Class Members</CardTitle>
              <CardDescription>
                Verify members for join this class.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-10">
                <ClassMembers
                  teachers={membersData.teachers}
                  students={membersData.students}
                  classroomId={data.id}
                />
                <AddStudentsToClass
                  students={nonMembers}
                  classroomId={data.id}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
