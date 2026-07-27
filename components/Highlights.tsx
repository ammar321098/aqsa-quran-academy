"use client";

import AnimationWrapper from "@/app/(endusers)/_compoments/AnimationWraper";
import { BookOpen, GraduationCap, LayoutDashboard, CalendarCheck } from "lucide-react";

const features = [
  {
    title: "Smart Course Management",
    description:
      "Create, organize, and manage courses with ease. Upload lessons, videos, PDFs, quizzes, and assignments—all in one place",
    icon: GraduationCap,
  },
  {
    title: "Teacher-Friendly Dashboard",
    description:
      "Teachers can manage classes, take attendance, create quizzes, share announcements, and track student performance in real time",
    icon: LayoutDashboard,
  },
  {
    title: "Student Learning Portal",
    description:
      "Students get a simple, focused dashboard to access courses, submit assignments, attempt quizzes, and track their progress",
    icon: BookOpen,
  },
  {
    title: "Attendance & Progress Tracking",
    description:
      "Mark daily attendance, monitor learning progress, and generate detailed reports for students and classes",
    icon: CalendarCheck,
  },
];

export default function Highlights() {
  return (
    <section className="pb-25 overflow-x-hidden">
      <AnimationWrapper>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 rounded-2xl sm:rounded-3xl p-6 sm:p-10 bg-primary text-primary-foreground dark:bg-primary/90 min-w-0">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center text-center"
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-background text-primary dark:bg-black/30 dark:text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm opacity-90">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </AnimationWrapper>
    </section>
  );
}
