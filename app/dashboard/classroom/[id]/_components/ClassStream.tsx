"use client";

import { StartQuizButton } from "@/app/dashboard/_components/StartQuizButton";
import { requireUser } from "@/app/data/user/require-user";
import { EmptyState } from "@/components/general/EmptyState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ClassStream({ posts }: any) {
  return (
    <div className="space-y-4">
      {/* Empty State */}
      <Card>
        <CardHeader>
          <p className="text-2xl">
            This is class stream where you can see all updates
          </p>
          <p className="text-sm mt-1 text-muted-foreground">
            Here Shared announcements, posted assignments, and quizes.
          </p>
        </CardHeader>

        {posts.length === 0 ? (
          <div className="px-4">
            <EmptyState
              title="No Announcments"
              description="There are no announcments available publically for this perticular class. So, Please check it out later."
              buttonText="Explore More Classes"
              href="/classes"
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
              {post.link && !post.link.includes("docs.google.com") && (
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm"
                >
                  {post.link.includes("youtube")
                    ? "Open Video"
                    : post.link.includes("youtube")
                      ? "Open Document"
                      : ""}
                </a>
              )}

              {/* Quizzes */}
              {post.quizes && post.quizes.length > 0 && (
                <Card className="mt-5">
                  <CardContent>
                    <div className="mt-2 space-y-2">
                      <h3>
                        This Announcment have a quiz. So, click on start button
                        and take quiz
                      </h3>
                      {post.quizes.map((quiz: any) => {
                        // Already taken if there is at least one submission by current user
                        const alreadyTaken = quiz.submition?.length > 0;
                        return (
                          <div
                            key={quiz.id}
                            className="grid items-center gap-2"
                          >
                            <span className="text-sm font-bold mb-2 text-primary">
                              Quiz Name: {quiz.title}
                            </span>
                            <StartQuizButton
                              key={quiz.id}
                              quizId={quiz.id}
                              disabled={alreadyTaken}
                              label={
                                alreadyTaken ? "Already Taken" : "Start Quiz"
                              }
                            />
                          </div>
                        );

                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          ))
        )}
      </Card>

      {/* Show EmptyState if no posts */}
      {posts.length === 0 && (
        <EmptyState
          title="No Announcements"
          description="This class does not have any announcements yet. Check back later."
          buttonText="Go Back"
          href="/classes"
        />
      )}
    </div>
  );
}
