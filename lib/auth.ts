
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { env } from "./env";
import { admin, emailOTP } from "better-auth/plugins";
import { resend } from "./resend";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  socialProviders: {
    google: {
      clientId: env.AUTH_GOOGLE_CLIENT_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    },
  },

  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        //  Implement sending the email to the user
        await resend.emails.send({
          from: "Aqsa Quran Academy <onboarding@resend.dev>",
          to: [email],
          subject: "Aqsa Quran Academy - Verify Your Email",
          html: `Your OTP is <strong>${otp}</strong>`,
        });
      },
    }),
    admin(),
  ],
});
