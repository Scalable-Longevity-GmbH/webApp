"use client";

import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { exampleUsers, User } from "@/app/example-user";

export default function LifePathPage() {
  const params = useParams<{ name: string }>();
  const rawName = params?.name ?? "";
  const decodedName = decodeURIComponent(rawName);

  const user: User | undefined = useMemo(
    () => exampleUsers.find((u) => u.name === decodedName),
    [decodedName]
  );

  const [intensity, setIntensity] = useState(50); // 0–100

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-font-secondary">Patient nicht gefunden.</p>
      </div>
    );
  }

  const toolsHref = `/analyzer/patient/${encodeURIComponent(
    decodedName
  )}/habit-builder`; // adjust when you know the next step

  return (
    <div className="min-h-screen bg-background flex items-start justify-center px-4 pt-24 pb-12">
      <div className="w-full max-w-6xl flex flex-col items-center">
        {/* Title */}
        <h1 className="text-xl md:text-2xl font-semibold text-font-primary">
          LifePath Analyser
        </h1>
        <p className="mt-3 max-w-2xl text-xs md:text-sm text-font-secondary text-center">
          Jetzt kannst du sehen, was deine Veränderungen bewirken und wie dein
          Leben verlaufen würde, wenn du genauso weitermachst wie bisher – oder
          wenn du gezielt etwas veränderst.
        </p>

        {/* Graph only (full width) */}
        <div className="mt-10 w-full">
          <div className="bg-card rounded-3xl shadow-sm px-6 py-8">
            <LifePathGraph intensity={intensity} user={user} />
          </div>
        </div>

        {/* Slider */}
        <div className="mt-10 w-full max-w-3xl">
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

        {/* CTA */}
        <Link
          href={toolsHref}
          className="mt-10 inline-flex items-center justify-center rounded-full bg-primary px-10 py-3 text-sm font-medium text-card hover:opacity-90 transition-opacity"
        >
          Tools generieren
        </Link>
      </div>
    </div>
  );
}

/**
 * LifePath graph:
 * - left: Vergangenheit (Wellenform)
 * - center: Gegenwart (Marker)
 * - right: two lines into die Zukunft:
 *   - untere Linie: Verlauf, wenn nichts geändert wird
 *   - obere Linie: Verlauf, wenn Veränderungen umgesetzt werden
 */
function LifePathGraph({ intensity, user }: { intensity: number; user: User }) {
  const maxExtraYears = 7;
  const extraYears = (intensity / 100) * maxExtraYears;

  const size = { width: 900, height: 360 };
  const cx = size.width / 2; // present x
  const cy = size.height / 2; // present y

  const futureX = size.width - 40;
  const baselineY = cy + 80; // "wenn du nichts änderst"
  const improvedY = cy - 40; // "wenn du Veränderungen machst"

  const coneOpacity = 0.35 + (extraYears / maxExtraYears) * 0.35; // 0.35–0.7

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${size.width} ${size.height}`}
        className="w-full h-auto"
      >
        {/* background horizontal dashed lines */}
        {Array.from({ length: 7 }).map((_, i) => {
          const y = 40 + i * 40;
          return (
            <line
              key={i}
              x1={40}
              y1={y}
              x2={size.width - 40}
              y2={y}
              stroke="#E4E7EB"
              strokeWidth={1}
              strokeDasharray="4 4"
            />
          );
        })}

        {/* center dashed vertical line */}
        <line
          x1={cx}
          y1={30}
          x2={cx}
          y2={size.height - 30}
          stroke="#CBD2E0"
          strokeWidth={1}
          strokeDasharray="6 4"
        />

        {/* labels Vergangenheit / Zukunft / Gegenwart */}
        <text x={80} y={30} fontSize="11" fill="#9CA3AF">
          Vergangenheit
        </text>
        <text x={size.width - 120} y={30} fontSize="11" fill="#9CA3AF">
          Zukunft
        </text>
        <text
          x={cx}
          y={size.height - 10}
          fontSize="11"
          fill="#9CA3AF"
          textAnchor="middle"
        >
          Gegenwart
        </text>

        {/* Past "wiggle" area */}
        <path
          d={`
            M 60 ${cy - 40}
            C 140 ${cy - 70}, 180 ${cy - 10}, 230 ${cy - 30}
            C 270 ${cy - 45}, 300 ${cy}, 340 ${cy - 20}
            C 370 ${cy - 35}, 380 ${cy - 10}, 410 ${cy - 20}
            L 410 ${cy + 40}
            C 380 ${cy + 30}, 370 ${cy + 55}, 340 ${cy + 40}
            C 300 ${cy + 20}, 270 ${cy + 60}, 230 ${cy + 30}
            C 180 ${cy + 10}, 140 ${cy + 60}, 60 ${cy + 20}
            Z
          `}
          fill="#2E4A3F"
          fillOpacity={0.85}
        />

        {/* future area gradient between the two lines */}
        <defs>
          <linearGradient id="lifepathGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2E4A3F" stopOpacity={0.1} />
            <stop offset="100%" stopColor="#2E4A3F" stopOpacity={coneOpacity} />
          </linearGradient>
        </defs>

        {/* shaded area between baseline and improved (the "cone") */}
        <polygon
          points={`${cx},${cy} ${futureX},${improvedY} ${futureX},${baselineY}`}
          fill="url(#lifepathGradient)"
        />

        {/* baseline line – no change */}
        <line
          x1={cx}
          y1={cy}
          x2={futureX}
          y2={baselineY}
          stroke="#2E4A3F"
          strokeWidth={2}
        />

        {/* improved line – with changes */}
        <line
          x1={cx}
          y1={cy}
          x2={futureX}
          y2={improvedY}
          stroke="#2E4A3F"
          strokeWidth={2}
        />

        {/* right-side extra years indicator */}
        <line
          x1={futureX}
          y1={improvedY}
          x2={futureX}
          y2={baselineY}
          stroke="#2E4A3F"
          strokeWidth={2}
        />
        <rect
          x={futureX - 35}
          y={(improvedY + baselineY) / 2 - 14}
          rx={16}
          ry={16}
          width={70}
          height={28}
          fill="#2E4A3F"
        />
        <text
          x={futureX}
          y={(improvedY + baselineY) / 2 + 4}
          fontSize="11"
          fill="#FFFFFF"
          textAnchor="middle"
        >
          {Math.round(extraYears)} Jahre
        </text>

        {/* present marker (where the two lines start) */}
        <circle
          cx={cx}
          cy={cy}
          r={18}
          fill="#FFFFFF"
          stroke="#2E4A3F"
          strokeWidth={2}
        />
      </svg>
    </div>
  );
}
