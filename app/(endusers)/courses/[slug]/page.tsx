import { getIndivisualCourse } from "@/app/data/course/get-course";
import { RenderDescription } from "@/components/rich-text-editor/RenderDescription";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useConstructUrl } from "@/hooks/use-contstruct-url";
import {
  IconBook,
  IconCategory,
  IconChartBar,
  IconCheck,
  IconClock,
} from "@tabler/icons-react";
import Image from "next/image";
import { checkIfCourseBoughtOptional } from "@/app/data/user/check-enrollment-optional";
import { getOptionalUser } from "@/app/data/user/get-optional-user";
import Link from "next/link";
import { EnrollmentButton } from "./_components/EnrollmentButton";
import { CourseContent } from "../_components/CourseContent";
import Cookies from "js-cookie";
import { ProtectedLink } from "@/components/general/ProtectedLink";

type Params = Promise<{ slug: string }>;

export default async function SlugPage({ params }: { params: Params }) {
  const { slug } = await params;
  const course = await getIndivisualCourse(slug);
  const thumbnailUrl = useConstructUrl(course.fileKey);
  const [isEnrolled, user] = await Promise.all([
    checkIfCourseBoughtOptional(course.id),
    getOptionalUser(),
  ]);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mt-10 mb-20 px-4 md:px-6 lg:px-8">
      <div className="order-1 lg:col-span-2">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
          <Image
            src={thumbnailUrl}
            alt="Thumbnail Image"
            width={600}
            height={400}
            style={{ width: "100%", height: "auto" }}
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent"></div>
        </div>
        <div className="mt-8 space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              {course.title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed line-clamp-2">
              {course.smallDescription}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 ">
            <Badge className="flex items-center gap-1 px-3 py-1">
              <IconChartBar className="size-4" />
              <span>{course.level}</span>
            </Badge>
            <Badge className="flex items-center gap-1 px-3 py-1">
              <IconCategory className="size-4" />
              <span>{course.category}</span>
            </Badge>
            <Badge className="flex items-center gap-1 px-3 py-1">
              <IconClock className="size-4" />
              <span>
                {course.duration} {course.duration === 1 ? "Day" : "Days"}
              </span>
            </Badge>
          </div>
          <Separator className="" />
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight">
              Course Description
            </h2>
            <RenderDescription json={JSON.parse(course.description)} />
          </div>
        </div>
        <div className="mt-12 space-y-6 ">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold tracking-tight">
              Course Content
            </h2>
            <div>
              {course.chapters.length} Chapters |{" "}
              {course.chapters.reduce(
                (total: any, chapter: any) => total + chapter.lessons.length,
                0,
              ) || 0}{" "}
              Lessons
            </div>
          </div>
          <div className="space-y-2">
            <CourseContent chapters={course.chapters} />
          </div>
        </div>
      </div>

      {/* Enrolment Card */}
      <div className="order-2 lg:col-span-1">
        <div className="sticky top-20">
          <Card className="py-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-lg font-medium">Price:</span>
                {course.isFree ? (
                  <Badge className="bg-green-500 text-white px-3 py-1">
                    Free
                  </Badge>
                ) : (
                  <>
                    <span className="text-2xl font-bold text-primary">
                      {new Intl.NumberFormat("en-PK", {
                        style: "currency",
                        currency: "PKR",
                      }).format(course.price)}
                    </span>
                  </>
                )}
              </div>

              <div className="mb-6 space-y-3 bg-accent p-4 rounded-2xl w-full">
                <h4 className="font-bold">What you will get:</h4>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                      <IconClock className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Course Duration</p>
                      <p className="text-sm text-muted-foreground">
                        {course.duration}{" "}
                        {course.duration === 1 ? "Day" : "Days"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                      <IconChartBar className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Diffculty Level</p>
                      <p className="text-sm text-muted-foreground">
                        {course.level}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                      <IconCategory className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Category</p>
                      <p className="text-sm text-muted-foreground">
                        {course.category}{" "}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                      <IconBook className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Total Lessons</p>
                      <p className="text-sm text-muted-foreground">
                        {course.chapters.reduce(
                          (total: any, chapter: any) =>
                            total + chapter.lessons.length,
                          0,
                        ) || 0}{" "}
                        Lessons
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6 space-y-3">
                <h4 className="font-bold">This course includes:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <div className="rounded-full bg-green-500/10 p-0.5 text-green-500">
                      <IconCheck className="size-4" />
                    </div>
                    <span>Full Lifetime Access</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="rounded-full bg-green-500/10 p-0.5 text-green-500">
                      <IconCheck className="size-4" />
                    </div>
                    <span>Access on Mobile & Desktop</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="rounded-full bg-green-500/10 p-0.5 text-green-500">
                      <IconCheck className="size-4" />
                    </div>
                    <span>Cerfification of Completion</span>
                  </li>
                </ul>
              </div>

              {/* Enrollment / Buy / Watch Button */}
              {isEnrolled ? (
                <Link
                  className={buttonVariants({
                    variant: "outline",
                    className: "w-full",
                  })}
                  href={`/dashboard/course/${course.slug}`}
                >
                  Watch Course
                </Link>
              ) : user ? (
                <EnrollmentButton
                  courseId={course.id}
                  isFree={course.isFree}
                  slug={course.slug}
                />
              ) : (
                <ProtectedLink href={`/courses/${course.slug}`}>
                  <Button className="w-full cursor-pointer">
                    Login to Enroll
                  </Button>
                </ProtectedLink>
              )}
              <p className="mt-5 text-center text-xs text-muted-foreground">
                30-day money-back guarantee
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
