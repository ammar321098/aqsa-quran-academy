import "server-only";
import { redirect } from "next/navigation";
import { requireUser } from "./require-user";

export async function requireTeacher() {
  const user = await requireUser();

  const hasTeacherProfile = user.teacherProfile;

  if (!user.isTeacher || !hasTeacherProfile) {
    redirect("/onboarding");
  }

  return user;
}
