import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/aqsaeducomp.jpg";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <Link href="/" className={buttonVariants({ variant: "outline" , className: "absolute top-4 left-4" })}>
                <ArrowLeft className="size-4"/>
                home
            </Link>

            <div className="flex items-center gap-2 mb-6">
                <Image src={logo} alt="logo" width={50} height={50} className="rounded-md" />
                <Link href="/" className="text-xl font-bold">
                    Aqsa Quran Academy
                </Link>
            </div>
            <div className="w-full max-w-md flex flex-col gap-6">
                {children}
                <div className="text-balance text-center text-muted-foreground">By clicking continue, you agree to our <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link></div>
            </div>
        </div>
    )
}