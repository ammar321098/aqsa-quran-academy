"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

interface UpdateUserProps {
  userId: string;
  email: string;
  fullName: string;
  phone: string;
  address: string;
}

export async function updateUser(data: UpdateUserProps) {
  // Check if the email is already used by another user
  const existingEmailUser = await prisma.user.findFirst({
    where: {
      email: data.email,
      NOT: { id: data.userId }, // exclude current user
    },
  });

  if (existingEmailUser) {
    throw new Error("This email is already in use.");
  }

  const user = await prisma.user.findUnique({
    where: { id: data.userId },
    include: {
      studentProfile: true,
      teacherProfile: true,
    },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  // Update user's email
  await prisma.user.update({
    where: { id: data.userId },
    data: {
      email: data.email,
    },
  });

  // Update student profile if exists
  if (user.studentProfile) {
    await prisma.studentProfile.update({
      where: { userId: data.userId },
      data: {
        fullName: data.fullName,
        phone: data.phone,
        address: data.address,
      },
    });
  }

  // Update teacher profile if exists
  if (user.teacherProfile) {
    await prisma.teacherProfile.update({
      where: { userId: data.userId },
      data: {
        fullName: data.fullName,
        phone: data.phone,
        address: data.address,
      },
    });
  }

  // Revalidate profile page cache
  revalidatePath("/profile");
}
