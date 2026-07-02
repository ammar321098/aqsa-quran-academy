"use server";

import { prisma } from "@/lib/db";

export type ContactFormState = {
  success?: boolean;
  error?: string;
};

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();

  if (!name || !email || !message) {
    return { error: "Please fill in all fields." };
  }

  if (message.length < 10) {
    return { error: "Message must be at least 10 characters." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  try {
    await prisma.contactSubmission.create({
      data: { name, email, message },
    });
    return { success: true };
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("Contact form submit error:", err);
    }
    return { error: "Failed to send message. Please try again." };
  }
}
