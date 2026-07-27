"use client";

import { useActionState } from "react";
import Link from "next/link";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import Image from "next/image";
import { subscribeNewsletter } from "@/app/(endusers)/actions/newsletter";

const initialState: { success?: boolean; error?: string } = {};

function NewsletterForm() {
  const [state, formAction, isPending] = useActionState(subscribeNewsletter, initialState);

  if (state?.success) {
    return (
      <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400">
        Thank you! You&apos;re subscribed to our newsletter.
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <div className="flex gap-0">
        <input
          type="email"
          name="email"
          required
          placeholder="Your email address"
          disabled={isPending}
          className="flex-1 min-w-0 px-4 py-2.5 bg-background border border-border rounded-l-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-r-lg hover:opacity-90 transition shrink-0 disabled:opacity-50"
        >
          {isPending ? "..." : "Subscribe"}
        </button>
      </div>
      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
    </form>
  );
}

export default function Footer() {
  return (
    <footer className="overflow-x-hidden">
      {/* Main section - light grey */}
      <div className="bg-muted/50 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6 min-w-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12">
            {/* Column 1: Brand + Social */}
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <Image src="/aqsaeducomp.png" alt="logo" width={80} height={80} />
                <span className="font-semibold text-primary lg:text-2xl">Aqsa Quran Academy</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour,
              </p>
              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-foreground text-sm">Connect with social media</h4>
                <div className="flex gap-4 text-foreground">
                  <a href="https://www.facebook.com/share/17sb3YdSEZ/" className="flex items-center gap-1.5 hover:text-primary transition text-sm" aria-label="Facebook" target="_blank">
                    <FaFacebookF className="h-5 w-5" />
                    <span>facebook</span>
                  </a>
                  <a href="https://www.instagram.com/markazaqsagrw" className="flex items-center gap-1.5 hover:text-primary transition text-sm" aria-label="Instagram" target="_blank">
                    <FaInstagram className="h-5 w-5" />
                    <span>instagram</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Column 2: Newsletter */}
            <div className="space-y-4 grid grid-cols-1 md:grid-cols-2">
              <div className="col-span-2">
                <h4 className="font-bold text-foreground">Sign up for our news</h4>
                <NewsletterForm />
              </div>

              {/* Column 3: Service */}
              <div className="space-y-3">
                <h4 className="font-bold text-foreground">Service</h4>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                  <li><Link href="/about" className="hover:text-foreground transition">About Us</Link></li>
                  <li><Link href="/learning" className="hover:text-foreground transition">Quran Learning</Link></li>
                  <li><Link href="/features" className="hover:text-foreground transition">Features</Link></li>
                  <li><Link href="/contact" className="hover:text-foreground transition">Contact Us</Link></li>
                </ul>
              </div>

              {/* Column 4: Quick Links */}
              <div className="space-y-3">
                <h4 className="font-bold text-foreground">Quick Links</h4>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                  <li><Link href="/" className="hover:text-foreground transition">Home</Link></li>
                  <li><Link href="/learning" className="hover:text-foreground transition">Learning</Link></li>
                  <li><Link href="/about" className="hover:text-foreground transition">About</Link></li>
                  <li><Link href="/contact" className="hover:text-foreground transition">Contact</Link></li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom strip - black */}
      <div className="bg-foreground py-4 px-4 md:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-background min-w-0 flex-wrap">
          <span>© 2025 Aqsa Quran Academy. All rights reserved.</span>
          <div className="flex gap-6 text-background">
            <Link href="/terms" className="hover:underline">Terms &amp; Agreements</Link>
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
