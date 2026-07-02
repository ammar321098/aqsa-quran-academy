"use client"

import { BookOpen, Lightbulb } from "lucide-react";
import AnimationWrapper from "@/app/(endusers)/_compoments/AnimationWraper";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function VisionMission() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Heading */}
        <AnimationWrapper>
          <h3 className="text-3xl font-bold text-center mb-12 text-primary">
            Vision & Mission
          </h3>
        </AnimationWrapper>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vision */}
          <AnimationWrapper>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center rounded-full p-5  text-primary dark:text-white dark:bg-primary/30">
                <Lightbulb className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 mt-6 text-center">
                Our Vision
              </h3>
              <p className="text-muted-foreground leading-relaxed text-center">
                Our vision is to become a globally trusted Quran learning
                platform—nurturing spiritually strong, knowledgeable, and
                confident Muslims by combining traditional Islamic values with
                innovative online education.
              </p>
            </div>
          </AnimationWrapper>

          <AnimationWrapper>
            {/* Mission */}
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center rounded-full p-5  text-primary dark:text-white dark:bg-primary/30">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 mt-6 text-center">
                Our Mission
              </h3>
              <p className="text-muted-foreground leading-relaxed text-center">
                At Aqsa Quran Academy, our mission is to provide high-quality,
                authentic Quran and Arabic education through qualified teachers,
                modern technology, and structured learning paths—making Quran
                learning accessible for students of all ages worldwide.
              </p>
            </div>
          </AnimationWrapper>
        </div>
      </div>
    </section>
  );
}
