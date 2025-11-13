"use client";

import { createContext, useContext } from "react";
import type { User } from "@/app/example-user"; // adjust if path differs

const PatientContext = createContext<User | null>(null);

export function PatientProvider({
  value,
  children,
}: {
  value: User;
  children: React.ReactNode;
}) {
  return (
    <PatientContext.Provider value={value}>{children}</PatientContext.Provider>
  );
}

export function usePatient() {
  const ctx = useContext(PatientContext);
  if (!ctx) {
    throw new Error("usePatient must be used within a PatientProvider");
  }
  return ctx;
}
