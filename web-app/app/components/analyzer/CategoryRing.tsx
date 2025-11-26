// components/analyzer/CategoryRing.tsx

import React from "react";

type Mode = "single" | "improvement";

type Props = {
  label: string;
  baseValue: number;
  mode?: Mode;
  intensity?: number;
  extraMax?: number;
};

/* ---------------------------------------------
   HSL-interpolated brand gradient stops
---------------------------------------------- */
const stops = [
  { p: 0, color: [8, 48, 56] }, // #C96457
  { p: 25, color: [44, 42, 50] }, // #C9A66E
  { p: 50, color: [90, 36, 44] }, // #90A26F
  { p: 75, color: [122, 29, 34] }, // #58705A
  { p: 100, color: [154, 23, 24] }, // #2E4A3F
];

/** Linear interpolation */
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Interpolated HSL color at % */
function getColorAt(percent: number) {
  const p = Math.max(0, Math.min(100, percent));

  let i = 0;
  while (i < stops.length - 1 && p > stops[i + 1].p) i++;

  const start = stops[i];
  const end = stops[i + 1];

  const t = (p - start.p) / (end.p - start.p);

  const h = lerp(start.color[0], end.color[0], t);
  const s = lerp(start.color[1], end.color[1], t);
  const l = lerp(start.color[2], end.color[2], t);

  return `hsl(${h}, ${s}%, ${l}%)`;
}

export function CategoryRing({
  label,
  baseValue,
  mode = "single",
  intensity = 0,
  extraMax = 20,
}: Props) {
  const size = 160;
  const RING_WIDTH = 14; // ring thickness & tip diameter
  const strokeWidth = RING_WIDTH;
  const radius = size / 2 - strokeWidth / 2;

  const clampedBase = Math.max(0, Math.min(100, baseValue));

  // compute final displayed % (improvement mode)
  let value = clampedBase;
  if (mode === "improvement") {
    const t = Math.max(0, Math.min(100, intensity)) / 100;
    value = Math.min(100, clampedBase + t * extraMax);
  }
  const clampedValue = Math.max(0, Math.min(100, value));

  // main angle (0–360)
  const angle = (clampedValue / 100) * 360;

  // full brand gradient
  const gradient = `conic-gradient(
    from 180deg,
    #C96457 0deg,
    #C9A66E 90deg,
    #90A26F 180deg,
    #58705A 270deg,
    #2E4A3F 360deg
  )`;

  // mask for unfilled portion
  const mask = `conic-gradient(
    from 180deg,
    transparent 0deg,
    transparent ${angle}deg,
    #e5e7eb ${angle}deg,
    #e5e7eb 360deg
  )`;

  /* ---------------------------------------------
     TIP COLOR OFFSET LOGIC
  ---------------------------------------------- */

  // arc length of full tip size along the ring
  const tipArc = RING_WIDTH / radius; // radians
  const tipDeg = tipArc * (180 / Math.PI); // degrees
  const percentOffset = (tipDeg / 360) * 100;

  const shiftedPercent = Math.max(
    0,
    Math.min(100, clampedValue - percentOffset)
  );

  const tipColor = getColorAt(shiftedPercent);

  /* ---------------------------------------------
     TIP POSITION
  ---------------------------------------------- */
  const tipSize = RING_WIDTH;

  // add 90° to match visual start
  const theta = 90 + angle;
  const rad = (theta * Math.PI) / 180;

  const cx = size / 2 + radius * Math.cos(rad);
  const cy = size / 2 + radius * Math.sin(rad);

  return (
    <div className="flex flex-col items-center">
      {/* Δ above ring */}
      {mode === "improvement" && (
        <span className="text-[11px] text-font-secondary mb-1">
          {Math.round(clampedValue - clampedBase) > 0
            ? `+${Math.round(clampedValue - clampedBase)}%`
            : "+0%"}
        </span>
      )}

      <div className="relative" style={{ width: size, height: size }}>
        {/* Outer gradient + mask */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            backgroundImage: `${mask}, ${gradient}`,
          }}
        />

        {/* Inner cutout */}
        <div
          className="absolute rounded-full bg-card"
          style={{
            inset: RING_WIDTH,
          }}
        />

        {/* Rounded tip */}
        {clampedValue > 0 && (
          <div
            className="absolute rounded-full"
            style={{
              width: tipSize,
              height: tipSize,
              backgroundColor: tipColor,
              left: cx - tipSize / 2,
              top: cy - tipSize / 2,
            }}
          />
        )}

        {/* Center number */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-semibold text-font-primary">
            {Math.round(clampedValue)}
            <span className="text-sm align-bottom">%</span>
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
