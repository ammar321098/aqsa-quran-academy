"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateUser } from "../action";
import { changePassword } from "../../action";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Save } from "lucide-react";
import { toast } from "sonner";

interface EditUserFormProps {
  user: any;
}

export default function EditUserForm({ user }: EditUserFormProps) {
  const router = useRouter();

  const profile = user.studentProfile || user.teacherProfile;
  const existingEmail = user.email;

  const [fullName, setFullName] = useState(profile?.fullName || "");
  const [email, setEmail] = useState(existingEmail || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [address, setAddress] = useState(profile?.address || "");
  const [newPassword, setNewPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const hasPassword = !!user.password;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (!fullName.trim() || !email.trim()) {
      toast.error("Full Name and Email are required.");
      return;
    }

    try {
      // Update profile
      await updateUser({
        userId: user.id,
        fullName,
        email,
        phone,
        address,
      });

      // Update password if provided
      if (newPassword.trim()) {
        await changePassword(newPassword);
        toast.success("Password updated successfully!");
        setNewPassword("");
      }

      toast.success("Profile updated successfully!");
      router.push("/");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border rounded-2xl shadow-sm p-8 space-y-6"
    >
      {/* Full Name */}
      <div>
        <Label className="text-sm text-muted-foreground ml-2">Full Name</Label>
        <Input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </div>

      {/* Email */}
      <div>
        <Label className="text-sm text-muted-foreground ml-2">Email</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={!!existingEmail} // prevent editing existing email
        />
      </div>

      {/* Phone */}
      <div>
        <Label className="text-sm text-muted-foreground ml-2">Phone</Label>
        <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>

      {/* Address */}
      <div>
        <Label className="text-sm text-muted-foreground ml-2">Address</Label>
        <Input value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>

      {/* New Password */}
      <div className="relative">
        <Label className="text-sm text-muted-foreground ml-2">
          New Password
        </Label>
        <Input
          type={showNew ? "text" : "password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder={hasPassword ? "Enter New Password" : "Set Password"}
        />
        <Button
          type="button"
          className="absolute right-0"
          onClick={() => setShowNew(!showNew)}
        >
          {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
        </Button>
      </div>

      <Button
        type="submit"
        disabled={!fullName.trim() || !email.trim() || loading} // disable if required fields empty
        className="w-full"
      >
        {loading ? (
          "Updating..."
        ) : (
          <>
            <Save />
            Update Profile
          </>
        )}
      </Button>
    </form>
  );
}
