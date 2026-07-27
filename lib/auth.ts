import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, emailOTP } from "better-auth/plugins";
import { prisma } from "./db";
import { env } from "./env";
import { resend } from "./resend";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  socialProviders: {
    google: {
      clientId: env.AUTH_GOOGLE_CLIENT_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    },
  },

  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        await resend.emails.send({
          from: "Aqsa Quran Academy <onboarding@resend.dev>",
          to: [email],
          subject: "Verify Your Email",
          html: `<strong>${otp}</strong>`,
        });
      },
    }),
    admin(),
  ],
});
