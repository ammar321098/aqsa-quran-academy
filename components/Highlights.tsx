"use client";

import AnimationWrapper from "@/app/(endusers)/_compoments/AnimationWraper";
import { BookOpen, Calendar, Users, Puzzle } from "lucide-react";

const features = [
  {
    title: "Online Learning Platform",
    description:
      "Following a structured course plan, your teacher will guide and help you learn faster & correctly.",
    icon: BookOpen,
  },
  {
    title: "Flexible Schedule",
    description:
      "Schedule your Arabic and Quran classes when it works for you! Teachers available 24/7.",
    icon: Calendar,
  },
  {
    title: "Live Teachers",
    description:
      "Qualified teachers guide you live to ensure correct learning and consistent progress.",
    icon: Users,
  },
  {
    title: "Games & Activities",
    description:
      "Interactive games, worksheets, and activities designed for engaging Quran learning.",
    icon: Puzzle,
  },
];

export default function Highlights() {
  return (
    <section className="pb-25 dark:bg-black/80 bg-black/10">
      <AnimationWrapper>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 rounded-3xl p-10 bg-primary text-primary-foreground dark:bg-primary/90">
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
