"use client";

import Image from "next/image";
import { Clock } from "lucide-react";
import AnimationWrapper from "@/app/(endusers)/_compoments/AnimationWraper";

const learners = [
  {
    name: "Hamza Rehman",
    date: "Dec 22, 2025",
    image: "/avatar.jpeg",
    text: "Alhamdulillah, my Quran reading has improved so much. The teacher explains Tajweed rules clearly and corrects mistakes patiently. I feel more confident while reciting now.",
  },
  {
    name: "Abdullah Qasim",
    date: "Jan 28, 2025",
    image: "/avatar.jpeg",
    text: "The online classes are very organized and easy to follow. I have memorized several Surahs with proper pronunciation. The supportive environment keeps me motivated.",
  },
  {
    name: "Huzafa Ijaz",
    date: "Feb 10, 2025",
    image: "/avatar.jpeg",
    text: "I appreciate the dedication and kindness of the instructor. Learning Quran with correct Tajweed has been a beautiful journey for me. Highly recommended for anyone who wants to improve their recitation.",
  },
];


export default function FeaturedLearners() {
  return (
    <section className="py-16 md:py-20 bg-muted/40">
      <AnimationWrapper>
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
            Featured Learners
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {learners.map((learner) => (
              <div
                key={learner.name}
                className="bg-card rounded-xl border border-border shadow-sm overflow-hidden"
              >
                <div className="relative aspect-4/3 bg-muted">
                  <Image
                    src={learner.image}
                    alt={learner.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                    <Clock className="h-4 w-4" />
                    <span>{learner.date}</span>
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-2">{learner.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {learner.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimationWrapper>
    </section>
  );
}
