"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { submitContactForm } from "../actions/contact";

const initialState = { success: false, error: undefined };

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    initialState
  );

  return (
    <div className="rounded-2xl">
      {state.success ? (
        <div className="rounded-xl border border-border bg-primary/5 p-6 text-center">
          <p className="font-medium text-foreground">
            Thank you! Your message has been sent. We&apos;ll get back to you soon.
          </p>
        </div>
      ) : (
        <form action={formAction} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-5">
            <input
              type="text"
              name="name"
              required
              placeholder="Your Name"
              className="border border-input p-3 rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
            <input
              type="email"
              name="email"
              required
              placeholder="Your Email"
              className="border border-input p-3 rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>

          <textarea
            name="message"
            required
            minLength={10}
            rows={5}
            placeholder="Your Message"
            className="w-full border border-input p-3 rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary transition resize-none"
          />

          {state?.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}

          <Button type="submit" className="w-full md:w-auto px-8" disabled={isPending}>
            {isPending ? "Sending..." : "Send Message"}
          </Button>
        </form>
      )}
    </div>
  );
}
