"use client";

import { StudentSchemaType } from "@/lib/zodSchema";
import { useState } from "react";
import { StudentFormStep1 } from "./StudentFirstForm";
import { FormStep2 } from "./SecondForm";
import { registerStudent } from "../action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function MultiStepStudentForm() {
  const [step, setStep] = useState(1);
  const [studentData, setStudentData] = useState<StudentSchemaType | null>(
    null,
  );
  const router = useRouter();

  return (
    <>
      {step === 1 && (
        <StudentFormStep1
          onNext={(data) => {
            setStudentData(data); // store Step 1 data
            setStep(2); // move to Step 2
          }}
          defaultVals={studentData ?? undefined}
        />
      )}

      {step === 2 && studentData && (
        <FormStep2
          step1Data={studentData}
          onBack={() => setStep(1)}
          onSubmitComplete={() => {
            setStep(1); 
            setStudentData(null);
          }}
          onSubmitFinal={async (data: any) => {
            const res = await registerStudent(data);
            if (!res.success) {
              toast.error(res.message);
            } else {
              toast.success(res.message);
            }
          }}
        />
      )}
    </>
  );
}
