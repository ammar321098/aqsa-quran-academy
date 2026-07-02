"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function signOutRoll() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("roll_session")?.value;

  if (sessionToken) {
    // Delete session from database
    await prisma.session.deleteMany({
      where: { token: sessionToken },
    });

    // Clear cookie
    cookieStore.set("roll_session", "", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
    });
  }
  revalidatePath("/");
  return { success: true, message: "Signed out successfully" };
}
