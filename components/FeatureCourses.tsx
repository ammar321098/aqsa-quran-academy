"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, BarChart3, Users, ListChecks, BookOpen } from "lucide-react";
import AnimationWrapper from "@/app/(endusers)/_compoments/AnimationWraper";
import { useConstructUrl } from "@/hooks/use-contstruct-url";
import type { LearningItem } from "@/app/data/learning/get-recent-learning";

interface FeatureCoursesProps {
  items: LearningItem[];
}

function FeatureCourseCard({
  item,
}: {
  item: Extract<LearningItem, { type: "course" }>;
}) {
  const thumbnailUrl = useConstructUrl(item.fileKey);
  const priceDisplay = item.isFree ? "Free" : `Rs. ${item.price}`;

  return (
    <div className="bg-card rounded-xl shadow-md border border-border overflow-hidden">
      <div className="relative aspect-video bg-muted">
        <Image src={thumbnailUrl} alt={item.title} fill className="object-cover" />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-1.5 mb-2">
          <BookOpen className="h-4 w-4 text-primary shrink-0" />
          <span className="text-xs font-medium text-primary uppercase tracking-wide">Course</span>
        </div>
        <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-2">{item.title}</h3>
        <p className="text-primary font-semibold text-lg mb-3">{priceDisplay}</p>
        <div className="flex gap-2 flex-wrap mb-4">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs">
            <Clock className="h-3.5 w-3.5" /> {item.duration} {item.duration === 1 ? "Day" : "Days"}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs">
            <BarChart3 className="h-3.5 w-3.5" /> {item.level}
          </span>
        </div>
        <div className="flex gap-2">
          <Link href="/login" className="flex-1 py-2.5 text-center text-sm font-medium bg-foreground text-background rounded-lg hover:opacity-90 transition">
            Register Now
          </Link>
          <Link href={`/courses/${item.slug}`} className="flex-1 py-2.5 text-center text-sm font-medium border border-border rounded-lg hover:bg-muted transition">
            See Details
          </Link>
        </div>
      </div>
    </div>
  );
}

function FeatureClassCard({
  item,
}: {
  item: Extract<LearningItem, { type: "class" }>;
}) {
  return (
    <div className="bg-card rounded-xl shadow-md border border-border overflow-hidden">
      <div className="relative aspect-video bg-muted">
        <Image src="/coverpage.jpg" alt={item.title} fill className="object-cover" />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-1.5 mb-2">
          <Users className="h-4 w-4 text-primary shrink-0" />
          <span className="text-xs font-medium text-primary uppercase tracking-wide">Class</span>
        </div>
        <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-2">{item.title}</h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-1">
          {item.teacher?.teacherProfile?.fullName ?? "Live class"}
        </p>
        <div className="flex gap-2 flex-wrap mb-4">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs ${item.isActive ? "bg-green-500/20 text-green-700 dark:text-green-400" : "bg-muted text-muted-foreground"}`}>
            {item.isActive ? "Active" : "Ended"}
          </span>
        </div>
        <div className="flex gap-2">
          <Link href="/login" className="flex-1 py-2.5 text-center text-sm font-medium bg-foreground text-background rounded-lg hover:opacity-90 transition">
            Register Now
          </Link>
          <Link href={`/classes/${item.id}`} className="flex-1 py-2.5 text-center text-sm font-medium border border-border rounded-lg hover:bg-muted transition">
            See Details
          </Link>
        </div>
      </div>
    </div>
  );
}

function FeatureQuizCard({ item }: { item: Extract<LearningItem, { type: "quiz" }> }) {
  const thumbnailUrl = useConstructUrl(item.thumbnailKey ?? "");

  return (
    <div className="bg-card rounded-xl shadow-md border border-border overflow-hidden">
      <div className="relative aspect-video bg-muted">
        {item.thumbnailKey ? (
          <Image src={thumbnailUrl} alt={item.title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ListChecks className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-1.5 mb-2">
          <ListChecks className="h-4 w-4 text-amber-500 shrink-0" />
          <span className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wide">Quiz</span>
        </div>
        <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-2">{item.title}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {item.smallDescription ?? "Test your knowledge."}
        </p>
        <div className="flex gap-2">
          <Link href="/login" className="flex-1 py-2.5 text-center text-sm font-medium bg-foreground text-background rounded-lg hover:opacity-90 transition">
            Register Now
          </Link>
          <Link href={`/quizzes/${item.id}`} className="flex-1 py-2.5 text-center text-sm font-medium border border-border rounded-lg hover:bg-muted transition">
            See Details
          </Link>
        </div>
      </div>
    </div>
  );
}

function FeatureLearningCard({ item }: { item: LearningItem }) {
  if (item.type === "course") return <FeatureCourseCard item={item} />;
  if (item.type === "class") return <FeatureClassCard item={item} />;
  return <FeatureQuizCard item={item} />;
}

export default function FeatureCourses({ items }: FeatureCoursesProps) {
  return (
    <section className="py-16 md:py-20 bg-muted/40 overflow-x-hidden">
      <AnimationWrapper>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 min-w-0">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Latest <span className="text-primary">Learning Components</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.length === 0 ? (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                No learning content available yet. Check back soon!
              </div>
            ) : (
              items.map((item) => (
                <FeatureLearningCard key={`${item.type}-${item.id}`} item={item} />
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="flex justify-center mt-10">
              <Link
                href="/learning"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
              >
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </AnimationWrapper>
    </section>
  );
}
