"use client";

import AnimationWrapper from "@/app/(endusers)/_compoments/AnimationWraper";
import { Users, BookOpen, Globe, Award, GraduationCap } from "lucide-react";

function formatNumber(n: number): string {
  return n.toLocaleString();
}

export type SuccessStatsData = {
  studentsEnrolled: number;
  coursesOffered: number;
  teachersCount: number;
};

export default function SuccessStatics({ stats }: { stats: SuccessStatsData }) {
  const statItems = [
    {
      title: "Years of Experience",
      value: "12+",
      icon: Award,
    },
    {
      title: "Students Enrolled",
      value: formatNumber(stats.studentsEnrolled + 60),
      icon: Users,
    },
    {
      title: "Courses Offered",
      value: formatNumber(stats.coursesOffered + 3),
      icon: BookOpen,
    },
    {
      title: "Teachers",
      value: formatNumber(stats.teachersCount + 7),
      icon: GraduationCap,
    }
  ];

  return (
    <section className="py-20 md:py-28 overflow-hidden relative">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(900px,100vw)] h-[400px] bg-primary/8 rounded-full blur-3xl" />
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 min-w-0">
        <AnimationWrapper>
          <div className="text-center mb-14">
            <span className="inline-block text-sm font-semibold uppercase tracking-widest text-primary/80 mb-3">
              Our Impact
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              Success <span className="text-primary">Statics</span>
            </h2>
          </div>
        </AnimationWrapper>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {statItems.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <AnimationWrapper key={index}>
                <article className="group relative rounded-2xl backdrop-blur-sm md:p-8 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative flex flex-col items-center text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-primary/15 to-primary/5 text-primary ring-1 ring-primary/10 group-hover:ring-primary/25 transition-all duration-300">
                      <Icon className="h-6 w-6" strokeWidth={1.5} />
                    </div>
                    <span className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-1.5">
                      {stat.value}
                    </span>
                    <p className="text-sm text-muted-foreground font-bold">
                      {stat.title}
                    </p>
                  </div>
                </article>
              </AnimationWrapper>
            );
          })}
        </div>

        <AnimationWrapper>
          <div className="mt-14 md:mt-16 max-w-3xl mx-auto">
            <p className="text-muted-foreground leading-relaxed text-center text-[15px] md:text-base">
              With a decade of experience in online Quran teaching, Aqsa Quran
              Academy blends traditional Islamic education with modern learning
              tools—ensuring quality, consistency, and spiritual growth for
              every learner.
            </p>
          </div>
        </AnimationWrapper>

        <div className="mt-12 flex items-center justify-center gap-4">
          <div className="h-px flex-1 max-w-[80px] bg-linear-to-r from-transparent to-primary/30" />
          <div className="h-1.5 w-1.5 rounded-full bg-primary/50" />
          <div className="h-px flex-1 max-w-[80px] bg-linear-to-l from-transparent to-primary/30" />
        </div>
      </div>
    </section>
  );
}
