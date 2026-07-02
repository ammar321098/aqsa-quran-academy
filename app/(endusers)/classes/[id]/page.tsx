import { getPublicClassById } from "@/app/data/classes/get-public-class";
import { checkIfClassroomEnrolledOptional } from "@/app/data/user/check-enrollment-optional";
import { getOptionalUser } from "@/app/data/user/get-optional-user";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Users } from "lucide-react";
import Image from "next/image";
import { ClassroomEnrollmentButton } from "../_components/ClassEnrollmentButton";
import { ProtectedLink } from "@/components/general/ProtectedLink";

type Params = Promise<{ id: string }>;

export default async function PublicClassDetailsPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;

  const classroom = await getPublicClassById(id);
  const [isEnrolled, user] = await Promise.all([
    checkIfClassroomEnrolledOptional(id),
    getOptionalUser(),
  ]);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mt-10 mb-20 px-4 md:px-6 lg:px-8">
      <div className="lg:col-span-3">
        <Link
          href="/learning"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4 mr-2" />
          Back to learning
        </Link>
      </div>

      <div className="order-1 lg:col-span-2 space-y-8">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg bg-emerald-600">
          <Image
            src="/coverpage.jpg"
            alt={classroom.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              {classroom.title}
            </h1>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-wrap gap-3">
            <Badge
              variant={classroom.isActive ? "default" : "destructive"}
              className="flex items-center gap-1 px-3 py-1"
            >
              <Users className="size-4" />
              {classroom.isActive ? "Active" : "Ended"}
            </Badge>
            {classroom.department?.name && (
              <Badge variant="outline" className="px-3 py-1">
                {classroom.department.name}
              </Badge>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">About this class</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {classroom.description ??
                "Join this live class to learn and grow with other students."}
            </p>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
            {classroom.teacher?.image ? (
              <Image
                src={classroom.teacher.image}
                alt={classroom.teacher.teacherProfile?.fullName ?? "Teacher"}
                width={64}
                height={64}
                className="rounded-full"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center text-2xl font-semibold">
                {classroom.teacher?.teacherProfile?.fullName?.charAt(0) ?? "T"}
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Teacher</p>
              <p className="font-medium">
                {classroom.teacher?.teacherProfile?.fullName ?? "Instructor"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="order-2 lg:col-span-1">
        <div className="sticky top-20">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-lg font-medium">Price:</span>
                {classroom.isFree ? (
                  <Badge className="bg-green-500 text-white px-3 py-1">
                    Free
                  </Badge>
                ) : (
                  <span className="text-xl font-bold text-primary">
                    Rs. {classroom.price}
                  </span>
                )}
              </div>

              <Separator className="mb-6" />

              {isEnrolled ? (
                <Link
                  className={buttonVariants({
                    variant: "outline",
                    className: "w-full",
                  })}
                  href={`/dashboard/classroom/${classroom.id}`}
                >
                  Enter Classroom
                </Link>
              ) : user ? (
                <ClassroomEnrollmentButton classroomId={classroom.id} />
              ) : (
                <ProtectedLink href={`/classes/${classroom.id}`}>
                  <Button className="w-full cursor-pointer">
                    Login to Join
                  </Button>
                </ProtectedLink>
              )}

              <p className="mt-4 text-center text-xs text-muted-foreground">
                {classroom.isFree
                  ? "Free to join."
                  : "Payment required to join."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
