"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { RiGoogleFill } from "@remixicon/react";
import { Loader, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export function LoginForm() {
  const [googlePending, startGoogleTransition] = useTransition();
  const [emailPending, startEmailTransition] = useTransition();
  const [email, setEmail] = useState("");
  const router = useRouter();

  async function signInWithGoogle() {
    startGoogleTransition(async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed in with Google, you will be redirecting...");
          },
          onError: (error) => {
            toast.error("Internal server error");
          },
        },
      });
    });
  }

  async function signInWithEmail() {
    startEmailTransition(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email: email,
        type: "sign-in",
        fetchOptions: {
          onSuccess: () => {
            toast.success("OTP send to your provided email");
            router.push(`/verify-request?email=${email}`);
          },
          onError: () => {
            toast.error("Error in sending email");
          },
        },
      });
    });
  }

  return (
    <Card>
      <CardHeader className="text-center space-y-1">
        <CardTitle className="text-2xl font-bold bg-linear-to-r from-primary/20 to-primary bg-clip-text text-transparent">
          Welcome back!
        </CardTitle>
        <CardDescription className="text-gray-500">
          Login with your Google account
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        {/* Google Button */}
        <Button
          onClick={signInWithGoogle}
          disabled={googlePending}
          variant="outline"
          className="w-full flex items-center gap-2 py-5 hover:cursor-pointer"
        >
          {googlePending ? (
            <>
              <Loader className="size-4 animate-spin" />
              <span>Loading...</span>
            </>
          ) : (
            <>
              <RiGoogleFill className="w-5 h-5" />
              Sign in with Google
            </>
          )}
        </Button>

        {/* Divider */}
        <div className="relative text-center text-sm text-gray-500">
          <div className="absolute inset-0 top-1/2 border-t border-gray-300" />
          <span className="relative bg-white dark:bg-card px-2">
            Or Continue with
          </span>
        </div>

        {/* Email Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            signInWithEmail();
          }}
          className="grid gap-4"
        >
          {/* Email Input */}
          <div className="grid gap-2">
            <Label className="text-primary">Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              placeholder="email@example.com"
              className="border-primary/10 focus-visible:ring-2"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={email.trim().length === 0}
            className="w-full py-5 font-medium text-white  shadow-md hover:cursor-pointer"
          >
            {emailPending ? (
              <>
                <Loader className="size-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <Send className="size-4" />
                Continue With Email
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
