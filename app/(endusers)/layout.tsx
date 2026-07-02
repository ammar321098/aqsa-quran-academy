import { ReactNode } from "react";
import { Navbar } from "./_compoments/Navbar";
import Footer from "@/components/Footer";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/");
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
