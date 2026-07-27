"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import AnimationWrapper from "@/app/(endusers)/_compoments/AnimationWraper";
import { staffData } from "@/lib/staff-data";

const STAFF_LIMIT = 4;

export default function StaffSection() {
  const featuredStaff = staffData.slice(0, STAFF_LIMIT);

  return (
    <section className="py-20 md:py-28 bg-background overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 min-w-0">
        <AnimationWrapper>
          <div className="flex flex-col items-center text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Users className="h-4 w-4" />
              <span className="text-sm font-semibold">Our Team</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-3">
              Meet Our Staff
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Experienced teachers and coordinators dedicated to your Quranic education.
            </p>
          </div>

          {/* Staff row - horizontal scroll on mobile */}
          <div className="overflow-x-auto snap-x snap-mandatory md:overflow-visible -mx-4 sm:-mx-6 px-4 sm:px-6 md:mx-0 md:px-0 pb-4 md:pb-0 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/15">
            <div className="flex gap-6 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8 lg:gap-12 min-w-max md:min-w-0 justify-items-center">
              {featuredStaff.map((staff) => (
                <Link
                  key={staff.name}
                  href="about#staff"
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

          {staffData.length > STAFF_LIMIT && (
            <div className="flex justify-center mt-12 md:mt-14">
              <Link
                href="/about#staff"
                className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                View All Staff
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </AnimationWrapper>
      </div>
    </section>
  );
}
