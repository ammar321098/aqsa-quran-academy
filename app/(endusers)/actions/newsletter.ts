"use server";

import { prisma } from "@/lib/db";

export type NewsletterState = {
  success?: boolean;
  error?: string;
};

export async function subscribeNewsletter(
  _prevState: NewsletterState,
  formData: FormData
): Promise<NewsletterState> {
  const email = (formData.get("email") as string)?.trim();

  if (!email) {
    return { error: "Please enter your email address." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  try {
    await prisma.newsletterSubscription.upsert({
      where: { email },
      update: {},
      create: { email },
    });
    return { success: true };
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("Newsletter subscribe error:", err);
    }
    return { error: "Failed to subscribe. Please try again." };
  }
}
