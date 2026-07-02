"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import AnimationWrapper from "@/app/(endusers)/_compoments/AnimationWraper";

// data/testimonials.js
export const testimonials = [
  {
    id: 1,
    name: "Alan Abdulla",
    role: "UX Designer",
    image: "/avatar.jpeg",
    text: "Hear from our learners who have transformed their knowledge and skills with our courses. From mastering new concepts to achieving real-world results, our students share their experiences and how our courses helped them grow professionally and personally.",
  },
  {
    id: 2,
    name: "Sarah Khan",
    role: "Product Manager",
    image: "/avatar.jpeg",
    text: "Hear from our learners who have transformed their knowledge and skills with our courses. From mastering new concepts to achieving real-world results, our students share their experiences and how our courses helped them grow professionally and personally.",
  },
  {
    id: 3,
    name: "John Smith",
    role: "Developer",
    image: "/avatar.jpeg",
    text: "Hear from our learners who have transformed their knowledge and skills with our courses. From mastering new concepts to achieving real-world results, our students share their experiences and how our courses helped them grow professionally and personally.",
  },
  {
    id: 4,
    name: "Ayesha Noor",
    role: "Founder",
    image: "/avatar.jpeg",
    text: "Hear from our learners who have transformed their knowledge and skills with our courses. From mastering new concepts to achieving real-world results, our students share their experiences and how our courses helped them grow professionally and personally.",
  },
  {
    id: 5,
    name: "David Lee",
    role: "CEO",
    image: "/avatar.jpeg",
    text: "Hear from our learners who have transformed their knowledge and skills with our courses. From mastering new concepts to achieving real-world results, our students share their experiences and how our courses helped them grow professionally and personally.",
  },
];

const CARD_WIDTH = 400;
const GAP = 5;

export default function TestimonialsCarousel() {
  const [active, setActive] = useState(0);

  const total = testimonials.length;

  const next = () => setActive((prev) => (prev + 1) % total);
  const prev = () => setActive((prev) => (prev - 1 + total) % total);

  return (
    <section className="py-20 overflow-hidden bg-muted-foreground/20">
      <AnimationWrapper>
        {/* Heading */}
        <div className="text-center mb-5">
          <h3 className="text-4xl font-bold text-center text-primary">
            Our Testimonials
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto">
            What our clients say about us
          </p>
        </div>

        {/* Carousel */}
        <div className="relative flex items-center justify-center">
          {/* Prev */}
          <button
            onClick={prev}
            className="absolute top-5 left-85 z-20 text-4xl dark:text-gray-300 dark:bg-accent-foreground/30 bg-white rounded-full p-2 hover:scale-110"
          >
            <ChevronLeftIcon className="size-5" />
          </button>

          <div className="relative h-80 w-full max-w-6xl">
            {testimonials.map((item, index) => {
              // Distance from active card
              let offset = index - active;

              // Infinite loop fix
              if (offset > total / 2) offset -= total;
              if (offset < -total / 2) offset += total;

              const isActive = offset === 0;

              return (
                <motion.div
                  key={item.id}
                  animate={{
                    x: offset * (CARD_WIDTH + GAP),
                    scale: isActive ? 1.2 : 0.85,
                    opacity: Math.abs(offset) > 2 ? 0 : 1,
                    zIndex: isActive ? 10 : 5 - Math.abs(offset),
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 30 }}
                  className={`absolute left-1/2 bottom-0 -translate-x-1/2 w-105 p-8 shadow-xl transition-colors`}
                >
                  <div className={`${isActive ? "-translate-y-1/5" : ""}`}>
                    <p
                      className={`text-sm leading-relaxed ${
                        isActive
                          ? "text-white text-xs bg-primary flex flex-col justify-end rounded-2xl p-4 pb-10 leading-relaxed text-center"
                          : "bg-gray-200 dark:bg-muted-foreground/30 text-gray-700 dark:text-gray-300 leading-relaxed text-center pb-10 rounded-2xl p-4"
                      }`}
                    >
                      {item.text.slice(0, 150)}
                    </p>

                    <div className="flex flex-col items-center -mt-5">
                      <Image
                        width={14}
                        height={14}
                        src={item.image}
                        alt="avatar"
                        className={`w-14 h-14 rounded-full border-2 ${
                          isActive
                            ? "border-primary"
                            : "border-gray-200 dark:border-muted-foreground/30"
                        }`}
                      />
                      <h4
                        className={`font-semibold mt-1 ${
                          isActive ? "text-primary" : ""
                        }`}
                      >
                        {item.name}
                      </h4>
                      <span className="text-xs opacity-70">{item.role}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Next */}
          <button
            onClick={next}
            className="absolute top-5 right-85 z-20 text-4xl bg-white dark:text-gray-300 dark:bg-accent-foreground/30 rounded-full p-2 hover:scale-110"
          >
            <ChevronRightIcon className="size-5" />
          </button>
        </div>
      </AnimationWrapper>
    </section>
  );
}
