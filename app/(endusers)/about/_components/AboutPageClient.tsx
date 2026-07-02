"use client";

import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { staffData } from "@/lib/staff-data";
import { ContactForm } from "@/app/(endusers)/_compoments/ContactForm";
import { Mail, Phone, MapPin } from "lucide-react";
import type { SuccessStatsData } from "@/components/SuccessStatics";
import SuccessStatics from "@/components/SuccessStatics";

export default function AboutPageClient({ stats }: { stats: SuccessStatsData }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Intro + Statistics */}
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            Aqsa <span className="text-primary">Quran Academy</span>
          </h1>
          <p className="text-foreground leading-relaxed text-lg">
            Aqsa Quran Academy, under Markaz Aqsa, is an online Quran learning platform
            dedicated to making authentic Islamic education accessible worldwide. We offer Quran
            Nazra with Tajweed, Hifz (memorization), and foundational Islamic studies—all delivered
            by qualified scholars through one-on-one and live classes. Students from Pakistan,
            Saudi Arabia, the UK, USA, and beyond learn at their own pace in a supportive,
            faith-centered environment.
          </p>
        </div>
      </section>

      <SuccessStatics stats={stats} />

      {/* Our Mission - image left, text right */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative">
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/a (2).png"
                  alt="Students learning"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-[45%] aspect-3/4 rounded-xl overflow-hidden shadow-lg border-4 border-background rotate-3">
                <Image src="/a (3).png" alt="" fill className="object-cover" />
              </div>
              <div className="absolute -bottom-4 right-8 w-[40%] aspect-square rounded-xl overflow-hidden shadow-lg border-4 border-background -rotate-6">
                <Image src="/a (1).png" alt="" fill className="object-cover" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Our Mission
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                At Aqsa Quran Academy, our mission is to provide high-quality, authentic Quran
                and Arabic education through qualified teachers, modern technology, and
                structured learning paths. We combine traditional Islamic values with innovative
                online tools—making Quran learning accessible for students of all ages, whether
                they seek Nazra, Tajweed, Hifz, or basic Islamic studies. Every student deserves
                the chance to connect with the Quran; we are here to guide that journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Vision - text left, image right */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Our Vision
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Our vision is to become a globally trusted Quran learning platform—nurturing
                spiritually strong, knowledgeable, and confident Muslims by combining traditional
                Islamic values with innovative online education. Through Markaz Aqsa, we aim to
                reach every corner of the world, offering structured courses, qualified
                instructors, and a supportive community so that learners of every age can
                build a lasting connection with the Quran and Islamic knowledge.
              </p>
            </div>
            <div className="relative order-1 lg:order-2">
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/a (4).png"
                  alt="Learning environment"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 w-[35%] aspect-3/4 rounded-xl overflow-hidden shadow-lg border-4 border-background -rotate-6">
                <Image src="/a (3).png" alt="" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We do Work - video placeholder */}
      {/* <section className="py-16 md:py-24 px-4 md:px-6 bg-background">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            How We do Work
          </h2>
          <p className="text-muted-foreground mb-10 max-w-2xl mx-auto">
            We offer flexible schedules with live classes and self-paced courses. Qualified
            teachers conduct one-on-one and group sessions, track progress, and provide
            structured feedback—so every student advances with confidence.
          </p>
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl bg-muted">
            <Image
              src="/banner.png"
              alt="How we work"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <button
                type="button"
                className="flex h-20 w-20 items-center justify-center rounded-full bg-white/95 text-foreground shadow-lg hover:scale-105 transition"
                aria-label="Play video"
              >
                <Play className="h-10 w-10 fill-foreground ml-1" />
              </button>
            </div>
          </div>
        </div>
      </section> */}

      {/* Meet Our Staff */}
      <section id="staff" className="py-16 md:py-24 px-4 md:px-6 bg-muted/30 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-sm font-semibold uppercase tracking-widest text-primary/80 mb-2">
              Our Team
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Meet Our Staff
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              The educators and coordinators behind Aqsa Quran Academy.
            </p>
          </div>
          <div className="overflow-x-auto snap-x snap-mandatory md:overflow-visible -mx-4 px-4 md:mx-0 md:px-0 pb-4 md:pb-0 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/15">
            <div className="flex gap-10 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8 lg:gap-12 min-w-max md:min-w-0 justify-items-center">
              {staffData.map((staff) => (
                <Link
                  key={staff.name}
                  href="#contact"
                  className="shrink-0 w-[min(70vw,220px)] snap-center md:w-auto md:shrink flex flex-col items-center text-center group"
                >
                  <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden">
                    <Image
                      src={staff.photo}
                      alt={staff.name}
                      fill
                      className="object-cover group-hover:opacity-95 transition-opacity"
                      sizes="(max-width: 768px) 128px, 160px"
                    />
                  </div>
                  <h3 className="mt-4 text-base md:text-lg font-bold text-foreground">
                    {staff.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {staff.role}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 md:py-28 px-4 md:px-6 bg-muted/30 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-sm font-semibold uppercase tracking-widest text-primary/80 mb-3">
              Reach Out
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Get in Touch
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Whether you have questions about our courses, want to enroll your child, or would
              like to connect with our team—we&apos;re here to help. Send us a message and we&apos;ll
              respond as soon as possible.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <h3 className="text-xl font-semibold text-foreground">
                Contact Information
              </h3>
              <div className="space-y-6">
                <a
                  href="mailto:garish.engr405@gmail.com"
                  className="flex items-center gap-4 group"
                >
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground group-hover:text-primary transition">
                    garish.engr405@gmail.com
                  </span>
                </a>
                <a
                  href="tel:+923224659062"
                  className="flex items-center gap-4 group"
                >
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground group-hover:text-primary transition">
                    +92 322 465 9062
                  </span>
                </a>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground">
                    Lahore, Punjab, Pakistan
                  </span>
                </div>
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
