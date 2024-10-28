"use client";

import * as React from "react";
import { useToast as useToastBase } from "@/components/ui/use-toast";

export function useToast() {
  const { toast, ...rest } = useToastBase();

  React.useEffect(() => {
    return () => {
      toast.dismiss();
    };
  }, []);

  return { toast, ...rest };
}