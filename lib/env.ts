import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.string().url(),
    AUTH_GOOGLE_CLIENT_ID: z.string().min(1),
    AUTH_GOOGLE_SECRET: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    AWS_ACCESS_KEY_ID: z.string().min(1),
    AWS_SECRET_ACCESS_KEY: z.string().min(1),
    AWS_ENDPOINT_URL_S3: z.string().min(1),
    AWS_ENDPOINT_URL_IAM: z.string().min(1),
    AWS_REGION: z.string().min(1),
    TWOCHECKOUT_MERCHANT_CODE: z.string().min(1),
    TWOCHECKOUT_PRIVATE_KEY: z.string().min(1),
    TWOCHECKOUT_PUBLIC_KEY: z.string().min(1),
    TWOCHECKOUT_TEST_MODE: z.string().min(1),
    TWOCHECKOUT_INS_SECRET_WORD: z.string().min(1),
    PUBLIC_APP_URL: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES: z.string().min(1),
  },
  // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    AUTH_GOOGLE_CLIENT_ID: process.env.AUTH_GOOGLE_CLIENT_ID,
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_ENDPOINT_URL_S3: process.env.AWS_ENDPOINT_URL_S3,
    AWS_ENDPOINT_URL_IAM: process.env.AWS_ENDPOINT_URL_IAM,
    AWS_REGION: process.env.AWS_REGION,
    NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES:
      process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
    TWOCHECKOUT_MERCHANT_CODE: process.env.TWOCHECKOUT_MERCHANT_CODE,
    TWOCHECKOUT_PRIVATE_KEY: process.env.TWOCHECKOUT_PRIVATE_KEY,
    TWOCHECKOUT_PUBLIC_KEY: process.env.TWOCHECKOUT_PUBLIC_KEY,
    TWOCHECKOUT_TEST_MODE: process.env.TWOCHECKOUT_TEST_MODE,
    PUBLIC_APP_URL: process.env.PUBLIC_APP_URL,
    TWOCHECKOUT_INS_SECRET_WORD: process.env.TWOCHECKOUT_INS_SECRET_WORD,
  },
  // For Next.js >= 13.4.4, you only need to destructure client variables:
  // experimental__runtimeEnv: {
  //   NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
  // }
});
