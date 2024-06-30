import { CheckCircle2 } from "lucide-react";
import React from "react";

const FormSuccess = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <div className="bg-teal-400/25 font-medium text-sm  flex items-center gap-2 my-2 text-secondary-foreground p-3 rounded-md">
      <CheckCircle2 className="w-4 h-4" />
      <p>{message}</p>
    </div>
  );
};

export default FormSuccess;
