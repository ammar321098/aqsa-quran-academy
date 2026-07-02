import { Suspense } from "react";
import OTPVerificationClient from "./_components/otp-verification-client";

export default function VerifyRequestPage() {
  return (
    <Suspense fallback={<div className="text-center">Loading...</div>}>
      <OTPVerificationClient />
    </Suspense>
  );
}
