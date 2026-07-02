// app/onboarding/page.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MultiStepStudentForm from "./_components/student-form";
import MultiStepTeacherForm from "./_components/teacher-form";
import { redirect } from "next/navigation";
import { getStudent } from "@/app/data/user/get-student";
import { getTeacher } from "@/app/data/user/get-teachet";
import { cookies } from "next/headers";

export default async function OnboardingPage() {
  const [student, teacher] = await Promise.all([getStudent(), getTeacher()]);

  // Read redirect URL from cookies
  const cookieStore = await cookies();
  const redirectAfterLogin = cookieStore.get("redirectAfterLogin")?.value;

  if (student) {
    if (redirectAfterLogin) {
      redirect(redirectAfterLogin); // redirect to original clicked page
    } else {
      redirect("/dashboard"); // default for student
    }
  }

  if (teacher) {
    if (redirectAfterLogin) {
      redirect(redirectAfterLogin); // redirect to original clicked page
    } else {
      redirect("/teacher"); // default for teacher
    }
  }

  // If neither student nor teacher exists, render onboarding
  return (
    <div className="w-full mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Complete Your Registration
      </h1>

      <Tabs defaultValue="student" className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="student">Student</TabsTrigger>
          <TabsTrigger value="teacher">Teacher</TabsTrigger>
        </TabsList>

        <TabsContent value="student">
          <MultiStepStudentForm />
        </TabsContent>

        <TabsContent value="teacher">
          <MultiStepTeacherForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
