"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";

const TOTAL_SLOTS = 18; // 3 rows * 6 cols
const MAX_SELECTED = 6;

export default function HabitBuilderPage() {
  const [selected, setSelected] = useState<number[]>([]);

  const toggleSlot = (index: number) => {
    const isSelected = selected.includes(index);

    if (isSelected) {
      setSelected((prev) => prev.filter((i) => i !== index));
    } else {
      // limit to MAX_SELECTED
      if (selected.length >= MAX_SELECTED) return;
      setSelected((prev) => [...prev, index]);
    }
  };

  return (
    <div className="min-h-90vh bg-background flex items-start justify-center px-4 pb-16">
      <div className="w-full max-w-5xl flex flex-col items-center pt-5">
        {/* Heading */}
        <h1 className="text-xl md:text-2xl font-semibold text-font-primary">
          Habit Builder
        </h1>
        <p className="mt-3 text-xs md:text-sm text-font-secondary text-center">
          Hier findest du Tools die dir helfen deine Ziele zu erreichen
        </p>

        {/* Grid of tool slots */}
        <div className="mt-14 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
          {Array.from({ length: TOTAL_SLOTS }).map((_, index) => {
            const isSelected = selected.includes(index);

            return (
              <button
                key={index}
                type="button"
                onClick={() => toggleSlot(index)}
                className={[
                  "relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl transition-all",
                  "flex items-center justify-center",
                  "bg-card shadow-sm hover:shadow-md",
                  isSelected
                    ? "border-2 border-primary"
                    : "border border-card-border",
                ].join(" ")}
              >
                {isSelected && (
                  <span className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-card" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Counter */}
        <p className="mt-16 text-sm text-font-primary">
          Du hast {selected.length}/{MAX_SELECTED} Tools ausgewählt
        </p>

        {/* Save button */}
        <button
          type="button"
          className="mt-6 inline-flex items-center justify-center rounded-full px-10 py-3 text-sm font-medium transition-opacity bg-primary text-card hover:opacity-90 disabled:opacity-40"
          disabled={selected.length === 0}
        >
          Speichern
        </button>
      </div>
    </div>
  );
}
