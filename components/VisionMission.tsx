"use client";

import { BookOpen, Lightbulb } from "lucide-react";
import AnimationWrapper from "@/app/(endusers)/_compoments/AnimationWraper";

const vision = {
  icon: Lightbulb,
  title: "Our Vision",
  description:
    "Our vision is to become a globally trusted Quran learning platform—nurturing spiritually strong, knowledgeable, and confident Muslims by combining traditional Islamic values with innovative online education.",
};

const mission = {
  icon: BookOpen,
  title: "Our Mission",
  description:
    "At Aqsa Quran Academy, our mission is to provide high-quality, authentic Quran and Arabic education through qualified teachers, modern technology, and structured learning paths—making Quran learning accessible for students of all ages worldwide.",
};

export default function VisionMission() {
  return (
    <section className="py-20 md:py-28 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 min-w-0">
        {/* Subtle background pattern - use max-w-full to avoid overflow on small screens */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(800px,100vw)] h-[400px] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[min(500px,100vw)] h-[300px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        <AnimationWrapper>
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold uppercase tracking-widest text-primary/80 mb-3">
              What We Stand For
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
              Vision & Mission
            </h2>
          </div>
        </AnimationWrapper>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {[vision, mission].map((item, index) => {
            const Icon = item.icon;
            return (
              <AnimationWrapper key={index}>
                <article className="group relative h-full rounded-2xl border border-border/60 bg-card p-8 md:p-10 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 overflow-hidden">
                  {/* Accent line */}
                  <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-primary to-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-l-2xl" />

                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="shrink-0">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-primary/20 to-primary/5 text-primary ring-1 ring-primary/10">
                        <Icon className="h-8 w-8" strokeWidth={1.5} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-[15px] md:text-base">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </article>
              </AnimationWrapper>
            );
          })}
        </div>

        {/* Decorative divider */}
        <div className="mt-16 flex items-center justify-center gap-4">
          <div className="h-px flex-1 max-w-[100px] bg-linear-to-r from-transparent to-primary/30" />
          <div className="h-1.5 w-1.5 rounded-full bg-primary/50" />
          <div className="h-px flex-1 max-w-[100px] bg-linear-to-l from-transparent to-primary/30" />
        </div>
      </div>
    </section>
  );
}
