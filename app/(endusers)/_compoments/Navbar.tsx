"use client";

import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { UserDropdown } from "./UserDropdown";

interface navigationProps {
  name: string;
  href: string;
}

const navigationItems: navigationProps[] = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Courses",
    href: "/courses",
  },
  {
    name: "Dashboard",
    href: "/dashboard",
  },
];

export function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  return (
    <>
      <header className="sticky top-0 z-100 w-full bg-background/80 backdrop-blur-[backdrop-filter]:bg-background/10">
        <div className="container flex min-h-16 items-center mx-auto px-4 md:px-6 lg:px-8">
          <Link href="/" className="flex items-center space-x-2 mr-4">
            <Image
              src="/aqsaeducomp.png"
              width={36}
              height={36}
              alt="logo"
              className="size-9 rounded-md"
            />
            <span className="font-bold text-primary">Aqsa Quran Academy</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:flex-1 md:items-center md:justify-between">
            <div className="flex items-center space-x-2">
              {navigationItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <ThemeToggle />
              {isPending ? null : session ? (
                <UserDropdown
                  email={session.user.email}
                  image={session.user.image || ""}
                  name={session.user.name}
                />
              ) : (
                <>
                  <Link
                    href="/login"
                    className={`rounded-xl ${buttonVariants({
                      variant: "outline",
                    })}`}
                  >
                    Login
                  </Link>
                  <Link href="/login" className={buttonVariants()}>
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
