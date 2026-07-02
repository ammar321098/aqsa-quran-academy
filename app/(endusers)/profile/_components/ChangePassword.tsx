"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { changePassword } from "../action";
import { toast } from "sonner";

interface ChangePasswordProps {
  hasPassword: boolean;
  password?: string; // decrypted password passed from server
}

export function ChangePassword({ hasPassword }: ChangePasswordProps) {
  const [newPassword, setNewPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleChange() {
    if (!newPassword.trim()) return;
    setLoading(true);

    try {
      await changePassword(newPassword);

      toast.success("Password updated successfully!");
      setNewPassword("");
    } catch (error: any) {
      console.error("Password update failed:", error);
      toast.error(
        error?.message || "Failed to update password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-6 space-y-4">
      <h3 className="font-semibold text-foreground">Change Password</h3>

      {/* New Password */}
      <div className="relative">
        <Input
          type={showNew ? "text" : "password"}
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Button
          onClick={() => setShowNew(!showNew)}
          className="absolute right-0"
        >
          {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
        </Button>
      </div>

      <Button
        onClick={handleChange}
        className="w-full"
        disabled={!newPassword.trim() || loading} // disable if new password empty
      >
        {loading
          ? "Updating..."
          : hasPassword
            ? "Update Password"
            : "Set Password"}
      </Button>
    </div>
  );
}
