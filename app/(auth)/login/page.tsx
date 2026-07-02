import { auth } from "@/lib/auth";
import { LoginForm } from "./_components/page";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Login() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    return redirect("/");
  }
  return <LoginForm />;
}
