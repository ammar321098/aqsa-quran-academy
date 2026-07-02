import { getStandaloneQuizDetails } from "@/app/data/user/get-standalone-quiz-details";
import { getQuizEnrollmentStatusOptional } from "@/app/data/user/check-enrollment-optional";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, FileQuestion } from "lucide-react";
import Image from "next/image";
import { constructQuizThumbnailUrl } from "@/lib/construct-url";
import { PublicQuizDetailsClient } from "./_components/PublicQuizDetailsClient";
import { RenderDescription } from "@/components/rich-text-editor/RenderDescription";

type Params = Promise<{ quizId: string }>;

export default async function PublicQuizDetailsPage({
  params,
}: {
  params: Params;
}) {
  const { quizId } = await params;

  const [quiz, enrollmentStatus] = await Promise.all([
    getStandaloneQuizDetails(quizId),
    getQuizEnrollmentStatusOptional(quizId),
  ]);

  if (!quiz) return notFound();

  const isLoggedIn = enrollmentStatus !== null;
  const isEnrolled = enrollmentStatus?.isEnrolled ?? false;
  const hasSubmitted = enrollmentStatus?.hasSubmitted ?? false;

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
        <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
          {quiz.thumbnailKey ? (
            <>
              <Image
                src={constructQuizThumbnailUrl(quiz.thumbnailKey)}
                alt={quiz.title}
                width={600}
                height={400}
                style={{ width: "100%", height: "auto" }}
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
            </>
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <FileQuestion className="size-16 text-muted-foreground/50" />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">{quiz.title}</h1>
            {quiz.smallDescription && (
              <p className="text-lg text-muted-foreground leading-relaxed line-clamp-2">
                {quiz.smallDescription}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <Badge className="flex items-center gap-1 px-3 py-1">
              <FileQuestion className="size-4" />
              <span>Quiz</span>
            </Badge>
            <Badge className="bg-green-500 text-white px-3 py-1">Free</Badge>
          </div>
          <Separator />
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight">
              Quiz Description
            </h2>
            {quiz.description ? (
              <div className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                <RenderDescription json={JSON.parse(quiz.description)} />
              </div>
            ) : (
              <p className="text-muted-foreground">
                Test your knowledge with this quiz. Enroll to get started.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="order-2 lg:col-span-1">
        <div className="sticky top-20">
          <Card className="py-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-lg font-medium">Price:</span>
                <Badge className="bg-green-500 text-white px-3 py-1">
                  Free
                </Badge>
              </div>

              <div className="mb-6 space-y-3 bg-accent p-4 rounded-2xl w-full">
                <h4 className="font-bold">What you will get:</h4>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                      <FileQuestion className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Self-paced Quiz</p>
                      <p className="text-sm text-muted-foreground">
                        Take the quiz when you&apos;re ready
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                      <FileQuestion className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Instant Results</p>
                      <p className="text-sm text-muted-foreground">
                        Get your score after submission
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6 space-y-3">
                <h4 className="font-bold">This quiz includes:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <span className="rounded-full bg-green-500/10 p-0.5 text-green-500">
                      ✓
                    </span>
                    <span>Multiple question types</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="rounded-full bg-green-500/10 p-0.5 text-green-500">
                      ✓
                    </span>
                    <span>Access on Mobile & Desktop</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="rounded-full bg-green-500/10 p-0.5 text-green-500">
                      ✓
                    </span>
                    <span>One attempt after enrollment</span>
                  </li>
                </ul>
              </div>

              <PublicQuizDetailsClient
                quizId={quiz.id}
                isLoggedIn={isLoggedIn}
                isEnrolled={isEnrolled}
                hasSubmitted={hasSubmitted}
              />
              <p className="mt-5 text-center text-xs text-muted-foreground">
                Free to enroll. One attempt per enrollment.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
