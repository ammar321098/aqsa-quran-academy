"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import AnimationWrapper from "@/app/(endusers)/_compoments/AnimationWraper";

const reviews = [
  {
    id: 1,
    name: "Tracye Lawyer",
    location: "Warsaw, Poland",
    image: "/avatar.jpeg",
    text: "Ali’s professionalism and dedication led our software project to success, delivering high-quality results on time and within budget.",
    rating: 3,
  },
  {
    id: 2,
    name: "Tracye Lawyer",
    location: "Warsaw, Poland",
    image: "/avatar.jpeg",
    text: "Ali’s expertise and reliability make him our top choice for any future tech or software needs.",
    rating: 5,
  },
  {
    id: 3,
    name: "Tracye Lawyer",
    location: "Warsaw, Poland",
    image: "/avatar.jpeg",
    text: "High-quality results, great communication, and strong commitment throughout the project.",
    rating: 2,
  },
  {
    id: 4,
    name: "Tracye Lawyer",
    location: "Warsaw, Poland",
    image: "/avatar.jpeg",
    text: "Very professional experience from start to finish.",
    rating: 1,
  },
];

const CARD_WIDTH = 360;

export default function ReviewsCrousal() {
  const [index, setIndex] = useState(0);

  const next = () => {
    if (index < reviews.length - 3) setIndex(index + 1);
  };

  const prev = () => {
    if (index > 0) setIndex(index - 1);
  };

  return (
    <section className="py-20 bg-background">
      <AnimationWrapper>
        {/* Title */}

        <div className="max-w-7xl mx-auto px-6 text-center mb-10">
          <h3 className="text-3xl font-bold text-center text-primary">
            Real Reviews
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Real feedback from our students
          </p>
        </div>

        {/* Carousel */}
        <div className="overflow-hidden max-w-6xl mx-auto">
          <motion.div
            className="flex gap-6"
            animate={{ x: -index * (CARD_WIDTH + 24) }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          >
            {reviews.map((review) => (
              <div
                key={review.id}
                className="w-90 shrink-0 border rounded-xl p-6 bg-gray-50 dark:bg-muted-foreground/30 flex flex-col justify-between"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={review.image}
                      alt={review.name}
                      width={44}
                      height={44}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-sm">{review.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {review.location}
                      </p>
                    </div>
                  </div>
                  <Quote className="w-5 h-5 text-primary" />
                </div>

                {/* Text */}
                <p className="text-sm  leading-relaxed mb-6">{review.text}</p>

                {/* Stars */}
                <div className="flex justify-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-5 mt-10">
          <button
            onClick={prev}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 dark:bg-accent-foreground/30 text-white hover:scale-110 transition"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={next}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 dark:bg-accent-foreground/30 text-white hover:scale-110 transition"
          >
            <ChevronRight />
          </button>
        </div>
      </AnimationWrapper>
    </section>
  );
}
