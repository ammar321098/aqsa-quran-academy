"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { getRollSession } from "@/lib/get-roll-session";
import bcrypt from "bcryptjs";

export async function changePassword(newPassword: string) {
  const user = await requireUser();
  if (!user) throw new Error("Unauthorized");

  const hashed = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed },
  });

  return { success: true };
}

export async function updateProfile(data: { name: string; image: string }) {
  const session = await getRollSession();
  if (!session) throw new Error("Unauthorized");

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: data.name,
      image: data.image,
    },
  });

  return { success: true };
}
