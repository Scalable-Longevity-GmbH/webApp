"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { exampleUsers, User } from "@/app/example-user";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

// Dynamic import to avoid "window is not defined"
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function LifePathPage() {
  const params = useParams<{ name: string }>();
  const rawName = params?.name ?? "";
  const decodedName = decodeURIComponent(rawName);

  const user: User | undefined = useMemo(
    () => exampleUsers.find((u) => u.name === decodedName),
    [decodedName]
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-font-secondary">Patient nicht gefunden.</p>
      </div>
    );
  }

  const chronoAge = user.chronologicalAge ?? 40;
  const bioAge = user.biologicalAge ?? 40;

  // ------------------------------
  // Build X-axis ages around user
  // ------------------------------
  const minDisplayAge = 15;
  const maxDisplayAge = 100;
  const step = 5;

  const pastAges: number[] = [];
  for (let a = chronoAge - step; a >= minDisplayAge; a -= step) {
    pastAges.push(a);
  }
  pastAges.reverse(); // so they go ascending

  const futureAges: number[] = [];
  for (let a = chronoAge + step; a <= maxDisplayAge; a += step) {
    futureAges.push(a);
  }

  const ages = [...pastAges, chronoAge, ...futureAges];

  // ------------------------------
  // Generate synthetic “story”
  // ------------------------------

  // Vergangenheit: range band with negative slope ending at (chronoAge, bioAge)
  const slopePast = -0.35; // negative slope (going forward in time, bio-age slightly sinkt)
  const spreadBase = 4; // ±4 Jahre um die Mitte

  // Zukunft: two scenarios
  const slopeNoChange = 0.7; // bio-age steigt schneller ohne Plan
  const slopeWithPlan = -0.5; // bio-age sinkt mit Plan

  const rangeAreaData = ages.map((age) => {
    if (age > chronoAge) {
      // no band in the future
      return { x: age, y: null };
    }
    const dx = age - chronoAge; // negative in past, 0 at now
    const center = bioAge + slopePast * dx;
    const low = center - spreadBase;
    const high = center + spreadBase;
    return { x: age, y: [low, high] as [number, number] };
  });

  const noChangeData = ages.map((age) => {
    if (age < chronoAge) {
      // no line in the past
      return { x: age, y: null };
    }
    const dx = age - chronoAge;
    const y = bioAge + slopeNoChange * dx;
    return { x: age, y };
  });

  const withPlanData = ages.map((age) => {
    if (age < chronoAge) {
      // no line in the past
      return { x: age, y: null };
    }
    const dx = age - chronoAge;
    const y = bioAge + slopeWithPlan * dx;
    return { x: age, y };
  });

  // Rough Y-bounds (could also be computed from data)
  const chartOptions: ApexOptions = {
    chart: {
      type: "line",
      height: 380,
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily:
        "var(--font-geist-sans), system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    },
    stroke: {
      width: [0, 2.2, 2.4], // 0 for range, >0 for lines
      curve: "smooth",
    },
    colors: ["#E5E7EB", "#9CA3AF", "#2E4A3F"],
    fill: {
      opacity: [0.3, 1, 1],
      type: ["solid", "solid", "solid"],
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
      labels: {
        colors: "var(--font-primary)",
      },
    },
    xaxis: {
      type: "numeric",
      title: {
        text: "Alter (Jahre)",
        style: {
          color: "var(--font-secondary)",
          fontSize: "12px",
        },
      },
      labels: {
        formatter: (val) => `${val}`,
        style: {
          colors: "var(--font-secondary)",
          fontSize: "11px",
        },
      },
    },
    yaxis: {
      title: {
        text: "Biologisches Alter",
        style: {
          color: "var(--font-secondary)",
          fontSize: "12px",
        },
      },
      labels: {
        style: {
          colors: "var(--font-secondary)",
          fontSize: "11px",
        },
      },
      min: 20,
      max: 100,
    },
    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 4,
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
    tooltip: {
      shared: true,
      intersect: false,
      theme: "dark",
      y: {
        formatter: (val) => {
          if (Array.isArray(val) && val.length === 2) {
            const [low, high] = val;
            return `${low.toFixed(0)}–${high.toFixed(0)} Jahre`;
          }
          if (typeof val === "number") {
            return `${val.toFixed(0)} Jahre`;
          }
          return "";
        },
      },
    },
  };

  const chartSeries = [
    {
      name: "Möglicher Bereich (Vergangenheit)",
      type: "rangeArea" as const,
      data: rangeAreaData,
    },
    {
      name: "Ohne Veränderungen",
      type: "line" as const,
      data: noChangeData,
    },
    {
      name: "Mit Plan",
      type: "line" as const,
      data: withPlanData,
    },
  ];

  const toolsHref = `/analyzer/patient/${encodeURIComponent(
    decodedName
  )}/habit-builder`;

  return (
    <div className="min-h-[90vh] w-full mx-30 bg-background flex flex-col items-center justify-center">
      <div className="w-full">
        <h1 className="text-xl md:text-2xl font-semibold text-font-primary mb-2">
          LifePath Analyzer
        </h1>
        <p className="text-xs md:text-sm text-font-secondary mb-8 max-w-xl">
          Die Grafik zeigt rückblickend einen plausiblen Korridor deiner
          biologischen Entwicklung - und wie sich dein biologisches Alter
          zukünftig ohne Veränderungen vs. mit Plan entwickeln könnte.
        </p>

        <div className="rounded-3xl bg-card border border-card-border px-4 py-6 md:px-6 md:py-8 shadow-sm">
          <ReactApexChart
            options={chartOptions}
            series={chartSeries}
            type="line"
            height={360}
          />
        </div>

        <div className="mt-10 flex justify-end">
          <Link
            href={toolsHref}
            className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-medium text-card hover:opacity-90 transition-opacity"
          >
            Nächster Schritt: Habit-Tools
          </Link>
        </div>
      </div>
    </div>
  );
}
