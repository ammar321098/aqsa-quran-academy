import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { LoginForm } from "./_components/LoginForm";

export default async function Login() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });


  if (session) {
    if (session.user.role === "admin") {
      return redirect("/admin");
    }
    return redirect("/onboarding");
  }
  return <LoginForm />;
}
