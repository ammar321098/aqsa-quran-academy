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
import { loginWithRoll } from "@/lib/login-with-roll";
import { RiGoogleFill } from "@remixicon/react";
import { Loader, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import Cookies from "js-cookie";

export function LoginForm() {
  const [googlePending, startGoogleTransition] = useTransition();
  const [emailPending, startEmailTransition] = useTransition();
  const [rollPending, startRollTransition] = useTransition();
  const [rollLogin, setRollLogin] = useState(true);

  const [email, setEmail] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  // Google login
  async function signInWithGoogle() {
    startGoogleTransition(async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/login",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed in with Google! Redirecting...");
          },
          onError: () => {
            toast.error("Internal server error");
          },
        },
      });
    });
  }

  // // Email OTP login
  // async function signInWithEmail() {
  //   startEmailTransition(async () => {
  //     await authClient.emailOtp.sendVerificationOtp({
  //       email: email,
  //       type: "sign-in",
  //       fetchOptions: {
  //         onSuccess: () => {
  //           toast.success("OTP sent to your email");
  //           router.push(`/verify-request?email=${email}`);
  //         },
  //         onError: () => {
  //           toast.error("Error sending email OTP");
  //         },
  //       },
  //     });
  //   });
  // }

  // Roll number + password login
  async function signInWithRoll() {
    startRollTransition(async () => {
      const res = await loginWithRoll({ rollNumber, password });

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success("Logged in successfully");

      // Get redirect URL from cookie
      const redirectAfterLogin = Cookies.get("redirectAfterLogin");

      // Remove cookie after reading
      if (redirectAfterLogin) Cookies.remove("redirectAfterLogin");

      // Redirect based on role + cookie
      if (res.user?.role === "teacher") {
        router.push(redirectAfterLogin ?? "/teacher");
      } else {
        router.push(redirectAfterLogin ?? "/dashboard");
      }
    });
  }

  return (
    <Card>
      <CardHeader className="text-center space-y-1">
        <CardTitle className="text-2xl font-bold">Welcome back!</CardTitle>
        <CardDescription className="text-gray-500">
          Login with your Google account or Roll Number
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
            <Loader className="animate-spin w-4 h-4" />
          ) : (
            <RiGoogleFill />
          )}
          Sign in with Google
        </Button>

        {/* Divider */}
        <div className="relative text-center text-sm text-gray-500">
          <div className="absolute inset-0 top-1/2 border-t border-gray-300" />
          <span className="relative bg-white dark:bg-card px-2">
            Or continue with
          </span>
        </div>

        {/* Email OTP */}
        {/* <form
          onSubmit={(e) => {
            e.preventDefault();
            signInWithEmail();
          }}
          className="grid gap-4"
        >
          <div className="grid gap-2">
            <Label className="mx-2 font-bold">Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="email@example.com"
            />
          </div>
          <Button type="submit" disabled={email.trim().length === 0}>
            {emailPending ? "Loading..." : "Continue with Email"}
          </Button>
        </form> */}

        {/* <Button
          variant="secondary"
          onClick={() => setRollLogin(true)}
          disabled={rollLogin}
        >
          Continue with Roll Number
        </Button> */}

        {/* Roll number login */}
        {rollLogin && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              signInWithRoll();
            }}
            className="grid gap-4"
          >
            <div className="grid gap-2">
              <Label className="mx-2 font-bold">Roll Number</Label>
              <Input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                required
                placeholder="Enter your roll number"
              />
            </div>
            <div className="grid gap-2">
              <Label className="mx-2 font-bold">Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
            <Button
              type="submit"
              disabled={!rollNumber || !password || rollPending}
            >
              {rollPending ? "Loading..." : "Login with Roll Number"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
