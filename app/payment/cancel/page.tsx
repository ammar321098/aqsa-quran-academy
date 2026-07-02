import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeftIcon, XIcon } from "lucide-react";
import Link from "next/link";

export default function PaymentCancelled() {
  return (
    <div className="w-full min-h-screen flex flex-1 justify-center items-center">
      <Card className="w-96 px-10">
        <div className="flex justify-center w-full">
          <XIcon className="size-20 p-2 bg-red-500/30 text-red-500 rounded-full" />
        </div>
        <div className="w-full mt-2 text-center sm:mt-4">
          <h2 className="text-xl font-semibold">Payment Cancelled</h2>
          <p className="text-sm mt-2 text-muted-foreground tracking-tight text-balance">
            No worries, you won't be charged. Please try again!
          </p>
          <Link
            href="/"
            className={buttonVariants({ className: "w-full mt-5" })}
          >
            <ArrowLeftIcon className="size-4" />
            Back to Homapage
          </Link>
        </div>
      </Card>
    </div>
  );
}
