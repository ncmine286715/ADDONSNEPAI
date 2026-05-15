import { createContext, useContext, ReactNode } from "react";
import { useCompare } from "@/hooks/useCompare";

const CompareContext = createContext<<ReturnType<<typeof useCompare> | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const value = useCompare();
  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompareContext() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompareContext must be used within CompareProvider");
  return ctx;
}