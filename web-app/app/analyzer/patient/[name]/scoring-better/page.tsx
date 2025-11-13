// app/analyzer/patient/[name]/plan/page.tsx

"use client";

import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { exampleUsers, User } from "@/app/example-user";

type Category = {
  key: string;
  label: string;
  baseValue: number; // current score (0–100)
};

const categories: Category[] = [
  {
    key: "anthropometry",
    label: "Körperliche\nGrunddaten",
    baseValue: 30,
  },
  {
    key: "activity",
    label: "Bewegung & Aktivität",
    baseValue: 50,
  },
  {
    key: "cardio-metabolic",
    label: "Herz- Kreislauf &\nStoffwechselrisiken",
    baseValue: 34,
  },
  {
    key: "lifestyle",
    label: "Lifestyle-Risiken",
    baseValue: 71,
  },
  {
    key: "nutrition",
    label: "Ernährung",
    baseValue: 85,
  },
];

export default function PlanPage() {
  const params = useParams<{ name: string }>();
  const rawName = params?.name ?? "";
  const decodedName = decodeURIComponent(rawName);

  const user: User | undefined = useMemo(
    () => exampleUsers.find((u) => u.name === decodedName),
    [decodedName]
  );

  // 0–100 → maps to +0–20 percentage points
  const [intensity, setIntensity] = useState(50);

  if (!user) {
    return (
      <div className="h-full bg-background flex items-center justify-center">
        <p className="text-sm text-font-secondary">Patient nicht gefunden.</p>
      </div>
    );
  }

  const nextHref = `/analyzer/patient/${encodeURIComponent(
    decodedName
  )}/lifepath-analyzer`; // adjust route later if needed

  return (
    <div className="h-full bg-background flex items-start justify-center px-4 pt-5">
      <div className="flex flex-col items-center text-center w-full max-w-5xl">
        {/* Heading */}
        <h1 className="text-xl md:text-2xl font-semibold text-font-primary">
          Auswertung aus dem Test
        </h1>
        <p className="mt-3 max-w-xl text-xs md:text-sm text-font-secondary">
          Es ist ganz normal, dass man nicht die 100% bei allen oder auch bei
          keinem Wert erreichen kann.
        </p>

        {/* Rings with potential improvement */}
        <div className="mt-10 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-10 gap-y-10 justify-items-center">
          {categories.map((cat) => (
            <RingWithImprovement
              key={cat.key}
              label={cat.label}
              baseValue={cat.baseValue}
              intensity={intensity}
            />
          ))}
        </div>

        {/* Slider */}
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

        {/* Explanation */}
        <p className="mt-10 text-sm text-font-primary">
          Stelle jetzt ein, wie intensiv deine Veränderungen sein sollen.*
        </p>
        <p className="mt-2 text-[11px] text-font-secondary max-w-md">
          *Je intensiver die Umstellung, desto mehr kannst du aus deiner
          Gesundheit rausholen.
        </p>

        {/* CTA */}
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

/**
 * Big ring with:
 * - dark primary = current base value
 * - lighter primary = potential additional improvement (up to +20 points)
 * - top text "+X" and center text "Y%"
 */
function RingWithImprovement({
  label,
  baseValue,
  intensity,
}: {
  label: string;
  baseValue: number;
  intensity: number; // 0–100
}) {
  const radius = 60;
  const strokeWidth = 14;
  const size = 160;

  const clampedBase = Math.max(0, Math.min(100, baseValue));

  // Extra potential: 0–20 points based on intensity
  const extraMax = 20;
  const extra = (Math.max(0, Math.min(100, intensity)) / 100) * extraMax;
  const targetValue = Math.min(100, clampedBase + extra);

  const circumference = 2 * Math.PI * radius;
  const baseOffset = circumference * (1 - clampedBase / 100);
  const targetOffset = circumference * (1 - targetValue / 100);
  const delta = Math.round(targetValue - clampedBase);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          aria-hidden="true"
        >
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            className="stroke-card-border"
            fill="none"
          />

          {/* Potential improvement – lighter primary */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            className="stroke-primary/40"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={targetOffset}
            transform={`rotate(90 ${size / 2} ${size / 2})`} // start at bottom
          />

          {/* Current value – dark primary, drawn on top */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            className="stroke-primary"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={baseOffset}
            transform={`rotate(90 ${size / 2} ${size / 2})`}
          />
        </svg>

        {/* Percentage & delta in the middle */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[11px] text-font-secondary mb-1">
            {delta > 0 ? `+${delta}` : "+0"}
          </span>
          <span className="text-2xl font-semibold text-font-primary">
            {Math.round(targetValue)}
            <span className="text-sm align-top">%</span>
          </span>
        </div>
      </div>

      {/* Label */}
      <div className="mt-4 text-sm leading-tight text-font-primary whitespace-pre-line text-center">
        {label}
      </div>
    </div>
  );
}
