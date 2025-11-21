// app/analyzer/patient/[name]/scoring/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import { exampleUsers, User } from "@/app/example-user";

type Params = {
  name: string;
};

type Category = {
  key: string;
  label: string;
  value: number; // 0–100 for now hardcoded
};

const categories: Category[] = [
  {
    key: "anthropometry",
    label: "Körperliche Grunddaten",
    value: 30,
  },
  {
    key: "activity",
    label: "Bewegung & Aktivität",
    value: 50,
  },
  {
    key: "cardio-metabolic",
    label: "Herz- Kreislauf &\nStoffwechselrisiken",
    value: 34,
  },
  {
    key: "lifestyle",
    label: "Lifestyle-Risiken",
    value: 71,
  },
  {
    key: "nutrition",
    label: "Ernährung",
    value: 85,
  },
];

export default async function ScoringPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);

  const user: User | undefined = exampleUsers.find(
    (u) => u.name === decodedName
  );

  if (!user) {
    notFound();
  }

  const nextHref = `/analyzer/patient/${encodeURIComponent(
    decodedName
  )}/scoring-better`;

  return (
    <div className="min-h-screen bg-background flex items-start justify-center px-4 pt-24 pb-12">
      <div className="flex flex-col items-center text-center w-full max-w-5xl">
        {/* Heading */}
        <h1 className="text-xl md:text-2xl font-semibold text-font-primary">
          Auswertung aus dem Test
        </h1>
        <p className="mt-3 max-w-xl text-xs md:text-sm text-font-secondary">
          Die Auswertung zeigt in welchen Kategorien du noch etwas aufholen
          kannst, um gesünder, länger zu leben!
        </p>

        {/* Rings row */}
        <div className="mt-10 w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-10 gap-y-10 justify-items-center">
          {categories.map((cat) => (
            <RingCard key={cat.key} label={cat.label} value={cat.value} />
          ))}
        </div>

        {/* Question */}
        <p className="mt-14 text-sm text-font-primary">
          Wie könnte es aussehen wenn du alles richtig machst?
        </p>

        {/* CTA */}
        <Link
          href={nextHref}
          className="mt-8 inline-flex items-center justify-center rounded-full bg-primary px-10 py-3 text-sm font-medium text-card hover:opacity-90 transition-opacity"
        >
          Jetzt verbessern
        </Link>
      </div>
    </div>
  );
}

/**
 * Single circular “Apple health style” ring with percentage in the center.
 * value: 0–100
 */
function RingCard({ label, value }: { label: string; value: number }) {
  const radius = 60; // much bigger radius
  const strokeWidth = 14; // thick stroke
  const size = 160; // total SVG size (160x160)

  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference * (1 - clamped / 100);

  // choose colors by value
  const getColorClasses = (v: number) => {
    if (v < 33) {
      return {
        ring: "stroke-red-300",
        text: "text-red-400",
      };
    }
    if (v < 66) {
      return {
        ring: "stroke-orange-300",
        text: "text-orange-400",
      };
    }
    return {
      ring: "stroke-primary", // your existing primary green
      text: "text-primary",
    };
  };

  const { ring, text } = getColorClasses(clamped);

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

          {/* Progress ring – starts at bottom */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            className={ring}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform={`rotate(90 ${size / 2} ${size / 2})`}
          />
        </svg>

        {/* Percentage */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-semibold ${text}`}>
            {clamped}
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
