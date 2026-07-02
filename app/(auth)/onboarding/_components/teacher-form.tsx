"use client";

import { StudentSchemaType, TeacherSchemaType } from "@/lib/zodSchema";
import { useState } from "react";
import { FormStep2 } from "./SecondForm";
import { TeacherFormStep1 } from "./TeacherFirstForm";
import { registerTeacher } from "../action";
import { toast } from "sonner";

export default function MultiStepTeacherForm() {
  const [step, setStep] = useState(1);
  const [teacherData, setTeacherData] = useState<TeacherSchemaType | null>(
    null,
  );

  return (
    <>
      {step === 1 && (
        <TeacherFormStep1
          onNext={(data) => {
            setTeacherData(data); // store Step 1 data
            setStep(2); // move to Step 2
          }}
          defaultVals={teacherData ?? undefined}
        />
      )}

      {step === 2 && teacherData && (
        <FormStep2
          step1Data={teacherData}
          onBack={() => setStep(1)}
          onSubmitComplete={() => {
            setStep(1);
            setTeacherData(null);
          }}
          onSubmitFinal={async (data: any) => {
            const res = await registerTeacher(data);
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
