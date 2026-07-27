"use client";

import { authClient } from "@/lib/auth-client";
import { notifyAuthChange } from "@/lib/auth-events";
import { signOutRoll } from "@/lib/SignoutRoll";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useSignout() {
  const router = useRouter();

  const handleSignOut = async () => {
    notifyAuthChange();

    try {
      // Sign out from Better Auth if exists
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed out successfully");
          },
          onError: () => {
            toast.error("Failed to sign out from auth");
          },
        },
      });

      // Sign out from Roll-number session
      await signOutRoll();
    } catch (err) {
      console.error(err);
      toast.error("Failed to sign out");
    } finally {
      // Redirect to homepage
      router.push("/");
      router.refresh();
    }
  };

  return handleSignOut;
}
