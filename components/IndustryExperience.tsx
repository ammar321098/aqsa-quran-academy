"use client"

import AnimationWrapper from "@/app/(endusers)/_compoments/AnimationWraper";
import { Users, BookOpen, Globe, Award } from "lucide-react";

const stats = [
  {
    title: "Years of Experience",
    value: "10+",
    icon: Award,
  },
  {
    title: "Students Enrolled",
    value: "5,000+",
    icon: Users,
  },
  {
    title: "Courses Offered",
    value: "25+",
    icon: BookOpen,
  },
  {
    title: "Countries Reached",
    value: "40+",
    icon: Globe,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function IndustryExperience() {
  return (
    <section className="py-20 bg-muted/30 dark:bg-muted/10">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Heading */}
        <AnimationWrapper>
          <h3 className="text-3xl font-bold text-center mb-12 text-primary">
            Industry Experience
          </h3>
        </AnimationWrapper>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <AnimationWrapper key={index}>
                <div className="rounded-3xl bg-muted-foreground/10 p-8 text-center shadow-sm">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </AnimationWrapper>
            );
          })}
        </div>

        {/* Bottom Description */}
        <AnimationWrapper>
          <p className="text-muted-foreground leading-relaxed text-center mt-10 w-4xl mx-auto">
            With a decade of experience in online Quran teaching, Aqsa Quran
            Academy blends traditional Islamic education with modern learning
            tools—ensuring quality, consistency, and spiritual growth for every
            learner.
          </p>
        </AnimationWrapper>
      </div>
    </section>
  );
}
