"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[70vh] flex items-center overflow-hidden bg-linear-to-b from-background via-background to-muted/30 min-w-0">
      <div className="absolute inset-0 z-0">
        <Image
          src="/banner.png"
          alt="Quran"
          fill
          className="object-cover object-right opacity-90"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-r from-background/95 via-background/50 to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24 min-w-0 max-w-full">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-foreground">
            Deepen Your Connection With The Quran
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Join thousands of students on a transformative journey of Quranic learning. Access authentic Islamic teachings from experienced scholars.
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition"
          >
            Explore Courses
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
