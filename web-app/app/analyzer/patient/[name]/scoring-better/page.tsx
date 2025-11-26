"use client";

import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { exampleUsers, User } from "@/app/example-user";
import { CategoryRing } from "../../../../components/analyzer/CategoryRing";

type Category = {
  key: string;
  label: string;
  baseValue: number;
};

const categories: Category[] = [
  { key: "anthropometry", label: "Körperliche\nGrunddaten", baseValue: 30 },
  { key: "activity", label: "Bewegung & Aktivität", baseValue: 50 },
  {
    key: "cardio-metabolic",
    label: "Herz- Kreislauf &\nStoffwechselrisiken",
    baseValue: 34,
  },
  { key: "lifestyle", label: "Lifestyle-Risiken", baseValue: 71 },
  { key: "nutrition", label: "Ernährung", baseValue: 85 },
];

export default function PlanPage() {
  const params = useParams<{ name: string }>();
  const rawName = params?.name ?? "";
  const decodedName = decodeURIComponent(rawName);

  const user: User | undefined = useMemo(
    () => exampleUsers.find((u) => u.name === decodedName),
    [decodedName]
  );

  const [intensity, setIntensity] = useState(50); // 0–100 → +0–20 points

  if (!user) {
    return (
      <div className="h-full bg-background flex items-center justify-center">
        <p className="text-sm text-font-secondary">Patient nicht gefunden.</p>
      </div>
    );
  }

  const nextHref = `/analyzer/patient/${encodeURIComponent(
    decodedName
  )}/lifepath-analyzer`; // as you had

  return (
    <div className="h-full bg-background flex items-start justify-center px-4 pt-5">
      <div className="flex flex-col items-center text-center w-full max-w-5xl">
        <h1 className="text-xl md:text-2xl font-semibold text-font-primary">
          Auswertung aus dem Test
        </h1>
        <p className="mt-3 max-w-xl text-xs md:text-sm text-font-secondary">
          Es ist ganz normal, dass man nicht die 100% bei allen oder auch bei
          keinem Wert erreichen kann.
        </p>

        <div className="mt-10 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-10 gap-y-10 justify-items-center">
          {categories.map((cat) => (
            <CategoryRing
              key={cat.key}
              label={cat.label}
              baseValue={cat.baseValue}
              mode="improvement"
              intensity={intensity}
              extraMax={20}
            />
          ))}
        </div>

        <div className="mt-14 w-full max-w-2xl">
          <div className="flex justify-between text-[11px] text-font-secondary mb-2">
            <span>niedrige Intensität</span>
            <span>hohe Intensität</span>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <p className="mt-10 text-sm text-font-primary">
          Stelle jetzt ein, wie intensiv deine Veränderungen sein sollen.*
        </p>
        <p className="mt-2 text-[11px] text-font-secondary max-w-md">
          *Je intensiver die Umstellung, desto mehr kannst du aus deiner
          Gesundheit rausholen.
        </p>

        <Link
          href={nextHref}
          className="mt-8 inline-flex items-center justify-center rounded-full bg-primary px-10 py-3 text-sm font-medium text-card hover:opacity-90 transition-opacity"
        >
          Veränderungen speichern
        </Link>
      </div>
    </div>
  );
}
