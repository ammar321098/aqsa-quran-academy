"use server";

import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";

interface LoginInput {
  rollNumber: string;
  password: string;
}

export async function loginWithRoll({ rollNumber, password }: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { rollNumber },
    include: { studentProfile: true, teacherProfile: true },
  });

  if (!user) return { success: false, message: "Invalid roll number" };
  if (!user.password)
    return { success: false, message: "User has no password set" };

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return { success: false, message: "Incorrect password" };

  // Create a session token
  const sessionToken = randomUUID();

  // Save session in database
  await prisma.session.create({
    data: {
      id: randomUUID(), // session id
      token: sessionToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day
    },
  });

  // Set cookie for client
  const cookieStore = await cookies();
  cookieStore.set("roll_session", sessionToken, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
  });

  return {
    success: true,
    message: "Logged in successfully",
    user: {
      id: user.id,
      role: user.role, // make sure role exists in your Prisma schema
      name: user.name,
      email: user.email,
    },
  };
}
