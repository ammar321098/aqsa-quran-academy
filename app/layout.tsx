import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ui/theme-provider";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "./context/session-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aqsa Quran Academy",
  description:
    "Discover a modern, interactive learning management system. Access high-quality courses anytime, anywhere.",
};

// Session is fetched client-side by Navbar (authClient.useSession + /api/get-roll-session)
// when needed. No DB query on every request = major performance gain.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider session={null}>{children}</SessionProvider>
          <Toaster closeButton position="bottom-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
