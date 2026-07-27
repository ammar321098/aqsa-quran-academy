import { ReactNode } from "react";
import Footer from "@/components/Footer";
import { Navbar } from "./_compoments/Navbar";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-w-0 overflow-x-hidden">
      <Navbar />
      {children}
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
