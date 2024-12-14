import React from "react";
import { CheckCircle, Loader, XCircle } from "lucide-react";

type Step = {
  label: string;
  status: "idle" | "loading" | "complete" | "error";
};

export type StepStatus = "idle" | "loading" | "complete" | "error";

interface ApplicationStepperProps {
  steps: Step[];
}

export const ApplicationStepper: React.FC<ApplicationStepperProps> = ({
  steps,
}) => {
  return (
    <div className="flex flex-col space-y-4">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
            {step.status === "idle" && (
              <div className="w-3 h-3 bg-[#1E3A8A] rounded-full" />
            )}
            {step.status === "loading" && (
              <Loader className="w-6 h-6 text-[#FF5C00] animate-spin" />
            )}
            {step.status === "complete" && (
              <CheckCircle className="w-6 h-6 text-green-500" />
            )}
            {step.status === "error" && (
              <XCircle className="w-6 h-6 text-red-500" />
            )}
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-[#1E3A8A]">{step.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StepperModalProps {
  isOpen: boolean;
  steps: { label: string; status: "idle" | "loading" | "complete" | "error" }[];
}

export const StepperModal: React.FC<StepperModalProps> = ({
  isOpen,
  steps,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md border-2 border-[#1E3A8A] shadow-[0_6px_0_0_#1E3A8A]">
        <CardHeader className="bg-[#FFE1A1] border-b-2 border-[#1E3A8A]">
          <CardTitle className="text-2xl font-bold text-[#1E3A8A]">
            Accepting Application
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 bg-[#FDF7F0]">
          <ApplicationStepper steps={steps} />
        </CardContent>
      </Card>
    </div>
  );
};
