import "server-only";
import { redirect } from "next/navigation";
import { requireUser } from "./require-user";

export async function requireStudent() {
  const user = await requireUser();

  const hasStudentProfile = user.studentProfile;

  if (!user.isStudent || !hasStudentProfile) {
    redirect("/onboarding");
  }

  return user;
}
