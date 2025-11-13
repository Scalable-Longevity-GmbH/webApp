import React from "react";
import { notFound } from "next/navigation";
import { exampleUsers, User } from "@/app/example-user";
import { PatientProvider } from "../PatientContext";

type Params = { name: string };

export default async function PatientLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<Params>; // <= in your Next version params is a Promise
}) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);

  const patient: User | undefined = exampleUsers.find(
    (u) => u.name === decodedName
  );

  if (!patient) {
    notFound();
  }

  return (
    <PatientProvider value={patient}>
      <div className="h-full bg-background flex items-center justify-center px-4 py-8">
        {children}
      </div>
    </PatientProvider>
  );
}
