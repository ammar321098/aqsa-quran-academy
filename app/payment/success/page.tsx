"use client";

import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useConfetti } from "@/hooks/use-confetti";
import { ArrowLeftIcon, CheckIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function PaymentSuccessfull() {
  const { triggerConfetti } = useConfetti();

  useEffect(() => {
    triggerConfetti();
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-1 justify-center items-center">
      <Card className="w-96 p-10">
        <div className="flex justify-center w-full">
          <CheckIcon className="size-20 p-2 bg-green-500/30 text-green-500 rounded-full" />
        </div>
        <div className="w-full mt-2 text-center sm:mt-4">
          <h2 className="text-xl font-semibold">Payment Successfull</h2>
          <p className="text-sm mt-2 text-muted-foreground tracking-tight text-balance">
            Congrats your payment successfull. You should now have access to the
            course
          </p>
          <Link
            href="/dashboard"
            className={buttonVariants({ className: "w-full mt-5" })}
          >
            <ArrowLeftIcon className="size-4" />
            Go to Dashboard
          </Link>
        </div>
      </Card>
    </div>
  );
}
