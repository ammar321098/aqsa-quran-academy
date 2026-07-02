import { requireUser } from "@/app/data/user/require-user";
import { EmptyState } from "@/components/general/EmptyState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, PlusIcon } from "lucide-react";
import { NewAnnouncement } from "./NewAnnouncment";
import Link from "next/link";

export async function ClassStream({ posts, classId }: any) {
  const user = await requireUser();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 px-4">
        {/* Teacher Post Box */}
        <NewAnnouncement classId={classId} />
        <Link
          href={`/teacher/classes/${classId}/quiz`}
          className={buttonVariants()}
        >
          See Class Quizes
        </Link>
      </div>

      {/* Posts */}
      <Card>
        {posts.length === 0 ? (
          <div className="px-4">
            <EmptyState
              title="No Announcments"
              description="This class still have not any announcment(s). Create it now"
              buttonText=""
              href=""
            />
          </div>
        ) : (
          posts.map((post: any) => (
            <CardContent
              key={post.id}
              className="p-6 space-y-2 border-b-2 mx-2"
            >
              <div className="flex items-center justify-between">
                {/* Author info */}
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8 border-2">
                    {post.author.image ? (
                      <AvatarImage
                        src={post.author.image}
                        alt={post.author.fullName || "Author"}
                      />
                    ) : (
                      <AvatarFallback>
                        {post.author.fullName?.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span className="text-sm font-medium">
                    {post.author.fullName}
                  </span>
                </div>

                {/* Post time */}
                <span className="text-xs text-muted-foreground">
                  {new Date(post.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* Post title & content */}
              <h2 className="font-semibold">{post.title}</h2>
              <p className="text-sm text-muted-foreground">{post.content}</p>

              {/* Link for Document / Video */}
              {post.link && !post?.link?.includes("docs.google.com") && (
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm"
                >
                  {post?.link?.includes("youtube")
                    ? "Open Video"
                    : post?.link?.includes("google")
                      ? "Open Document"
                      : ""}
                </a>
              )}

              {/* Quizzes */}
              {post.quizes && post.quizes.length > 0 && (
                <Card className="mt-5">
                  <CardContent>
                    <div className="mt-2 space-y-2">
                      {post.quizes.map((quiz: any) => (
                        <div key={quiz.id} className="grid items-center gap-2">
                          <span className="text-lg font-bold mb-2 text-primary">
                            Quiz: {quiz.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          ))
        )}
      </Card>
    </div>
  );
}
