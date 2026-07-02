"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { PublicCourseCard } from "@/app/(endusers)/courses/_components/PublicCourseCard";
import { LearningClassCard } from "./LearningClassCard";
import { PublicQuizCard } from "./PublicQuizCard";
import { EmptyState } from "@/components/general/EmptyState";
import type { PublicCourseType as CourseType } from "@/app/data/course/get-all-courses";
import type { PublicCourseType as ClassType } from "@/app/data/classes/get-all-classes";
import type { StandaloneQuizItem } from "@/app/data/user/get-standalone-quizzes";

type FilterType = "all" | "courses" | "classes" | "quizzes";
type LevelFilter = "all" | "Beginner" | "Intermediate" | "Advanced";

interface LearningPageClientProps {
  courses: CourseType[];
  classes: (ClassType & { _isEnrolled?: boolean })[];
  quizzes: StandaloneQuizItem[];
  enrollmentStatuses: Record<string, boolean>;
}

export function LearningPageClient({
  courses,
  classes: rawClasses,
  quizzes,
  enrollmentStatuses,
}: LearningPageClientProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("all");

  const classes = useMemo(
    () =>
      rawClasses.map((c) => ({
        ...c,
        _isEnrolled: enrollmentStatuses[c.id] ?? false,
      })),
    [rawClasses, enrollmentStatuses]
  );

  const filtered = useMemo(() => {
    const searchLower = search.trim().toLowerCase();
    const matchesSearch = (text: string) =>
      !searchLower || text.toLowerCase().includes(searchLower);

    let filteredCourses = courses.filter(
      (c) =>
        matchesSearch(c.title) ||
        matchesSearch(c.smallDescription) ||
        matchesSearch(c.category)
    );
    let filteredClasses = classes.filter(
      (c) =>
        matchesSearch(c.title) ||
        matchesSearch(c.description ?? "") ||
        matchesSearch(c.teacher?.teacherProfile?.fullName ?? "")
    );
    let filteredQuizzes = quizzes.filter(
      (q) =>
        matchesSearch(q.title) ||
        matchesSearch(q.smallDescription ?? "")
    );

    if (levelFilter !== "all") {
      filteredCourses = filteredCourses.filter((c) => c.level === levelFilter);
    }

    if (typeFilter === "courses") {
      filteredClasses = [];
      filteredQuizzes = [];
    } else if (typeFilter === "classes") {
      filteredCourses = [];
      filteredQuizzes = [];
    } else if (typeFilter === "quizzes") {
      filteredCourses = [];
      filteredClasses = [];
    }

    return {
      courses: filteredCourses,
      classes: filteredClasses,
      quizzes: filteredQuizzes,
      total:
        filteredCourses.length +
        filteredClasses.length +
        filteredQuizzes.length,
    };
  }, [courses, classes, quizzes, search, typeFilter, levelFilter]);

  const hasAnyContent =
    courses.length > 0 || classes.length > 0 || quizzes.length > 0;
  const hasFilteredContent = filtered.total > 0;

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search courses, classes, quizzes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-muted-foreground shrink-0" />
            <Select
              value={typeFilter}
              onValueChange={(v) => setTypeFilter(v as FilterType)}
            >
              <SelectTrigger className="w-35">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="courses">Courses</SelectItem>
                <SelectItem value="classes">Classes</SelectItem>
                <SelectItem value="quizzes">Quizzes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Select
            value={levelFilter}
            onValueChange={(v) => setLevelFilter(v as LevelFilter)}
          >
            <SelectTrigger className="w-35">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filtered.total} result{filtered.total !== 1 ? "s" : ""}
      </p>

      {/* Content grid */}
      {!hasAnyContent ? (
        <EmptyState
          title="No learning content available"
          description="There are no courses, classes, or quizzes available yet."
          buttonText="Go to Home"
          href="/"
        />
      ) : !hasFilteredContent ? (
        <EmptyState
          title="No results found"
          description="Try adjusting your search or filters."
          buttonText="Clear filters"
          href="/learning"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
          {filtered.courses.map((course) => (
            <PublicCourseCard key={`course-${course.id}`} data={course} />
          ))}
          {filtered.classes.map((cls) => (
            <LearningClassCard
              key={`class-${cls.id}`}
              classroom={cls}
              isEnrolled={cls._isEnrolled ?? false}
            />
          ))}
          {filtered.quizzes.map((quiz) => (
            <PublicQuizCard key={`quiz-${quiz.id}`} quiz={quiz} />
          ))}
        </div>
      )}
    </div>
  );
}
