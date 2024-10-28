"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export function LoadingSpinner({ size = "md", className, ...props }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div
      role="status"
      className={cn("animate-spin text-muted-foreground", className)}
      {...props}
    >
      <Loader2 className={sizeClasses[size]} />
      <span className="sr-only">Loading...</span>
    </div>
  );
}