import { AlertCircle } from "lucide-react";
import React from "react";

const FormError = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <div className="bg-destructive/25 font-medium text-sm my-2  flex items-center gap-2 text-secondary-foreground p-3 rounded-md">
      <AlertCircle className="w-4 h-4" />
      <p>{message}</p>
    </div>
  );
};

export default FormError;
