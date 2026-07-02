// components/ProtectedLink.tsx
"use client";

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export function ProtectedLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    const isLoggedIn = false; // Replace with your auth logic

    if (!isLoggedIn) {
      e.preventDefault();

      // Store redirect URL in cookie
      Cookies.set("redirectAfterLogin", href, { path: "/", expires: 1 }); // expires in 1 day

      // Send user to login page
      router.push("/login");
    }
  };

  return (
    <a href={href} onClick={handleClick}>
      {children}
    </a>
  );
}
