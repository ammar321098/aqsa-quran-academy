"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import AnimationWrapper from "@/app/(endusers)/_compoments/AnimationWraper";

const testimonials = [
  { id: 1, name: "Dr Khalid", role: "Student", image: "/avatar.jpeg", rating: 5, text: "Aqsa Quran Academy has transformed my Quran recitation. The teachers are patient and knowledgeable. I started as a complete beginner and now I can read fluently. Highly recommend to anyone who wants to learn properly." },
  { id: 2, name: "Ahmed Hussain", role: "Parent", image: "/avatar.jpeg", rating: 5, text: "My children have been learning with Aqsa Academy for over a year. The structured courses and live classes have helped them progress so much. As a parent, I appreciate the qualified teachers and the focus on authentic Islamic values." },
  { id: 3, name: "Fatima Ali", role: "Student", image: "/girlavatar.png", rating: 5, text: "The online format makes it easy to learn from home. The teachers explain Tajweed beautifully and the course materials are well organized. I feel more connected to the Quran than ever before." },
];

const CARD_WIDTH = 380;
const GAP = 24;

export default function Testimonials() {
  const [active, setActive] = useState(1);

  const next = () => setActive((prev) => (prev + 1) % testimonials.length);
  const prev = () => setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-16 md:py-20 bg-background overflow-x-hidden">
      <AnimationWrapper>
        <div className="text-center mb-10 px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">
            Our Testimonials
          </h2>
          <p className="text-muted-foreground mt-2">
            What our clients say about us.
          </p>
        </div>

        <div className="relative flex items-center justify-center min-h-[320px] overflow-x-hidden">
          <button
            onClick={prev}
            className="absolute left-4 md:left-8 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background border border-border shadow-md hover:bg-background hover:text-foreground transition"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="relative w-full max-w-5xl mx-auto h-[320px] flex items-start justify-center">
            {testimonials.map((item, index) => {
              const offset = index - active;
              const isActive = offset === 0;

              return (
                <motion.div
                  key={item.id}
                  animate={{
                    x: offset * (CARD_WIDTH + GAP),
                    scale: isActive ? 1 : 0.9,
                    opacity: Math.abs(offset) > 1 ? 0 : 1,
                    zIndex: isActive ? 10 : 5 - Math.abs(offset),
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 30 }}
                  className="absolute left-1/2 top-0 w-[90vw] max-w-[380px] -translate-x-1/2"
                >
                  <div
                    className={`rounded-2xl p-6 md:p-8 shadow-lg ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-foreground"
                    }`}
                  >
                    <p className="text-sm leading-relaxed mb-6">{item.text}</p>
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            isActive
                              ? i < item.rating
                                ? "fill-primary-foreground text-primary-foreground"
                                : "text-primary-foreground/40"
                              : i < item.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={48}
                        height={48}
                        className="rounded-full border-2 border-white/50"
                      />
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className={`text-sm ${isActive ? "opacity-90" : "text-muted-foreground"}`}>
                          {item.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <button
            onClick={next}
            className="absolute right-4 md:right-8 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background border border-border shadow-md hover:bg-background hover:text-foreground transition"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </AnimationWrapper>
    </section>
  );
}
