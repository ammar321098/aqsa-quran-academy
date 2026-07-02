"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  const { theme, setTheme } = useTheme();

  return (
    <section className="relative h-175 overflow-hidden w-full ">
      {/* Background Image */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <Image
          src="/heroImage.png"
          alt="Quran"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay */}
        <div className="absolute inset-0 dark:bg-black/80 bg-black/10" />
      </motion.div>

      {/* HERO CONTENT */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.25,
            },
          },
        }}
        className="relative z-10 flex flex-col items-center justify-center h-full w-full text-center"
      >
        <motion.h1
          variants={{
            hidden: { y: 30, opacity: 0 },
            visible: { y: 0, opacity: 1 },
          }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-4xl md:text-5xl font-bold leading-tight max-w-3xl"
        >
          <span className="mt-6 pb-4 text-4xl md:text-5xl font-bold tracking-tight bg-linear-to-r from-primary/75 to-primary bg-clip-text text-transparent">
            Elevuate Your Learning Experience
          </span>

          <p className="max-w-175 mx-auto mt-4 text-muted-foreground md:text-xl">
            Discover a modern, interactive learning management system. Access
            high-quality courses anytime, anywhere.
          </p>
        </motion.h1>

        <motion.button
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: { y: 0, opacity: 1 },
          }}
          transition={{ duration: 0, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 mb-25 border-2 border-primary px-8 py-3 text-muted-foreground dark:text-white  rounded-4xl hover:bg-primary transition"
        >
          <Link href="/courses">Explore Courses</Link>
        </motion.button>
      </motion.div>
    </section>
  );
}
