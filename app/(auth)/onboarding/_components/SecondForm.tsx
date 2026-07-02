"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Copy, Eye, EyeOff } from "lucide-react";
import { generateRollNumber } from "@/lib/generate-roll";

type Step1Base = {
  departmentId: string;
  role: number;
};

interface Step2Props<T extends Step1Base> {
  step1Data: T;
  onBack: () => void;
  onSubmitComplete: () => void;
  onSubmitFinal: (
    data: T & { rollNumber: string; password: string },
  ) => Promise<void>;
}

export function FormStep2<T extends Step1Base>({
  step1Data,
  onBack,
  onSubmitComplete,
  onSubmitFinal,
}: Step2Props<T>) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm({
    defaultValues: {
      rollNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Generate Roll Number
  useEffect(() => {
    async function loadRoll() {
      const roll = await generateRollNumber(
        Number(step1Data.departmentId),
        step1Data.role,
      );
      form.setValue("rollNumber", roll);
      setLoading(false);
    }

    loadRoll();
  }, [form, step1Data.departmentId]);

  async function onSubmit(values: any) {
    if (values.password !== values.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setSubmitting(true);

      await onSubmitFinal({
        ...step1Data,
        rollNumber: values.rollNumber,
        password: values.password,
      });

      onSubmitComplete();
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit form");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <Card className="p-6 text-center">Generating Roll Number...</Card>;
  }

  // Copy roll number to clipboard
  const copyRollNumber = () => {
    const value = form.getValues("rollNumber");
    navigator.clipboard.writeText(value);
    toast.success("Roll number copied to clipboard");
  };

  return (
    <Card className="p-6 w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Roll Number Field with Copy Button */}
          <FormField
            control={form.control}
            name="rollNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mx-2 font-bold">
                  Roll No
                  <span className="font-normal text-muted-foreground text-xs">
                    (must remember your roll no)
                  </span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input {...field} readOnly className="pr-10" />
                    <Button
                      type="button"
                      className="absolute right-0"
                      onClick={copyRollNumber}
                    >
                      <Copy size={16} />
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mx-2 font-bold">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="pr-10"
                      required
                    />
                    <Button
                      type="button"
                      className="absolute right-0"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password Field */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mx-2 font-bold">
                  Confirm Password
                  <span className="font-normal text-muted-foreground text-xs">
                    (must remember your password)
                  </span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      className="pr-10"
                      required
                    />
                    <Button
                      type="button"
                      className="absolute right-0"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="w-full"
              disabled={submitting}
            >
              Back
            </Button>

            <Button
              type="submit"
              className="w-full font-bold"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
