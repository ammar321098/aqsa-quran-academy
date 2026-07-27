"use client";

import { useEffect, useState, useRef } from "react";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserDropdown } from "./UserDropdown";
import { subscribeAuthChange } from "@/lib/auth-events";
import { Menu, X, Home, BookOpen, Sparkles, Info } from "lucide-react";

// We will fetch roll session via an API route
async function fetchRollSession() {
  const res = await fetch("/api/get-roll-session");
  if (!res.ok) return null;
  return res.json();
}

interface navigationProps {
  name: string;
  href?: string;
  icon?: React.ReactNode;
  children?: navigationProps[];
}

const navigationItems: navigationProps[] = [
  { name: "Home", href: "/", icon: <Home className="w-4 h-4" /> },
  {
    name: "Learning",
    href: "/learning",
    icon: <BookOpen className="w-4 h-4" />,
  },
  {
    name: "Features",
    href: "/features",
    icon: <Sparkles className="w-4 h-4" />,
  },
  { name: "About", href: "/about", icon: <Info className="w-4 h-4" /> },
  // { name: "Contact", href: "/contact", icon: <Mail className="w-4 h-4" /> },
];

export function Navbar() {
  const { data: betterAuthSession } = authClient.useSession();
  const pathname = usePathname();
  const [rollSession, setRollSession] = useState<any>(null);
  const [loggedOut, setLoggedOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    return subscribeAuthChange(() => {
      setLoggedOut(true);
      setRollSession(null);
    });
  }, []);

  useEffect(() => {
    // fallback to roll session if Better Auth session is not available
    if (!betterAuthSession) {
      fetchRollSession().then((session) => setRollSession(session));
    }
  }, [betterAuthSession, loggedOut]);

  const session = loggedOut ? null : (betterAuthSession ?? rollSession);

  const displayName =
    session?.user?.studentProfile?.fullName ??
    session?.user?.teacherProfile?.fullName ??
    session?.user?.name ??
    session?.user?.email?.split("@")[0];

  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-2 sm:gap-3 md:gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 min-w-fit">
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0">
              <Image
                src="/aqsaquranac.png"
                width={36}
                height={36}
                alt="Aqsa Quran Academy"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-md"
              />
            </div>
            <span className="hidden lg:inline font-bold text-sm sm:text-base md:text-lg bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent whitespace-nowrap">
              Aqsa Academy
            </span>
          </Link>

          {/* Desktop Navigation - Hidden on tablet and below */}
          <nav className="hidden lg:flex flex-1 items-center justify-center ">
            <div className="flex items-center gap-0.5 bg-secondary/20 rounded-lg p-1">
              {navigationItems.map(
                (item) =>
                  item.href && (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-3 xl:px-4 py-2 text-xs xl:text-sm font-medium rounded-md inline-flex items-center gap-2 transition-all duration-200 whitespace-nowrap ${
                        isActive(item.href)
                          ? "bg-primary text-white shadow-lg shadow-primary/20"
                          : "text-foreground/70 hover:text-foreground hover:bg-background/50"
                      }`}
                      aria-current={isActive(item.href) ? "page" : undefined}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  ),
              )}
            </div>
          </nav>

          {/* Tablet Navigation - Icons only, shown on md and up but hidden on lg */}
          <nav className="hidden md:flex lg:hidden flex-1 items-center justify-center ">
            <div className="flex items-center gap-0.5 bg-secondary/20 rounded-lg p-1">
              {navigationItems.slice(0, 2).map(
                (item) =>
                  item.href && (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-2.5 py-2 text-xs font-medium rounded-md inline-flex items-center justify-center transition-all duration-200 w-10 h-10 ${
                        isActive(item.href)
                          ? "bg-primary text-white shadow-lg shadow-primary/20"
                          : "text-foreground/70 hover:text-foreground hover:bg-background/50"
                      }`}
                      title={item.name}
                      aria-label={item.name}
                      aria-current={isActive(item.href) ? "page" : undefined}
                    >
                      {item.icon}
                    </Link>
                  ),
              )}
            </div>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3 ml-auto shrink-0">
            <ThemeToggle />

            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center gap-2">
              {session ? (
                <UserDropdown
                  email={session.user?.email ?? session.user.rollNumber}
                  image={session.user?.image}
                  name={displayName}
                  role={session.user.role}
                />
              ) : (
                <>
                  <Link
                    href="/contact"
                    className="hidden lg:block px-3 xl:px-4 py-2 text-xs xl:text-sm font-medium rounded-lg border border-input hover:bg-accent/5 transition-colors duration-200 whitespace-nowrap"
                  >
                    Contact Us
                  </Link>
                  <Link
                    href="/login"
                    className="px-3 xl:px-4 py-2 text-xs xl:text-sm font-medium text-white bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 whitespace-nowrap"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Auth Button */}
            <div className="flex md:hidden items-center gap-1">
              {!session && (
                <Link
                  href="/login"
                  className="px-3 py-2 text-xs font-medium text-white bg-linear-to-r from-primary to-primary/90 rounded-lg transition-all duration-200 whitespace-nowrap"
                >
                  Get Started
                </Link>
              )}
            </div>

            {/* Mobile/Tablet Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-accent/10 transition-colors duration-200 active:bg-accent/20 shrink-0"
              aria-label={
                mobileMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Full menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/40 bg-linear-to-b from-background to-background/80 animate-in slide-in-from-top-2">
            <div className="flex flex-col gap-1 py-3">
              {navigationItems.map(
                (item) =>
                  item.href && (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-3 py-3 text-sm font-medium inline-flex items-center gap-3 rounded-md transition-all duration-200 min-h-11 ${
                        isActive(item.href)
                          ? "bg-primary text-white shadow-md"
                          : "text-foreground/70 hover:text-foreground hover:bg-accent/5"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                      aria-current={isActive(item.href) ? "page" : undefined}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  ),
              )}
            </div>

            {/* Mobile Auth Section */}
            <div className="border-t border-border/40 py-3 flex flex-col gap-2 px-0">
              {session ? (
                <div className="px-3">
                  <UserDropdown
                    email={session.user?.email ?? "user@example.com"}
                    image={session.user?.image}
                    name={
                      session.user?.studentProfile?.fullName ??
                      session.user?.teacherProfile?.fullName ??
                      session.user?.name ??
                      "User Name"
                    }
                    role={session.user.role}
                  />
                </div>
              ) : (
                <>
                  <Link
                    href="/contact"
                    className="mx-3 px-3 py-3 text-sm font-medium text-center rounded-lg border border-input hover:bg-accent/5 transition-colors duration-200 min-h-11 flex items-center justify-center"
                  >
                    Contact Us
                  </Link>
                  <Link
                    href="/login"
                    className="mx-3 px-3 py-3 text-sm font-medium text-center text-white bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary rounded-lg transition-all duration-200 min-h-11 flex items-center justify-center"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
