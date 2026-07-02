"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { Loader } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function OTPVerificationClient() {
  const [otp, setOtp] = useState("");
  const [emailPending, startEmailTransition] = useTransition();

  const params = useSearchParams();
  const email = params.get("email");

  const router = useRouter();
  const isOtpCompleted = otp.length === 6;

  function verifyOtp() {
    if (!email) {
      toast.error("Email not found");
      return;
    }

    startEmailTransition(async () => {
      await authClient.signIn.emailOtp({
        email,
        otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Account verification successful");
            router.push("/");
          },
          onError: () => {
            toast.error("Account verification failed");
          },
        },
      });
    });
  }

  return (
    <Card>
      <CardHeader className="text-center space-y-1">
        <CardTitle className="text-2xl font-bold bg-linear-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
          OTP Verification
        </CardTitle>
        <CardDescription>
          We have sent a verification code to your email.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <InputOTP value={otp} onChange={setOtp} maxLength={6}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            -
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code
          </p>
        </div>

        <Button
          onClick={verifyOtp}
          disabled={emailPending || !isOtpCompleted}
          className="w-full py-5 font-medium bg-linear-to-r from-blue-500 to-blue-700 text-white"
        >
          {emailPending ? (
            <>
              <Loader className="size-4 animate-spin mr-2" />
              Loading...
            </>
          ) : (
            "Verify Account"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
