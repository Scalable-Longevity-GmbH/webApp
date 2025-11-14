// /app/page.tsx
"use client";

import React, { useState } from "react";
import Calendar from "react-calendar";

export default function Home() {
  const [value, setValue] = useState<Date>(new Date());

  return (
    <main className="h-full flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-2xl font-semibold mb-4">Calendar</h1>

          <div className="flex justify-center">
            <div style={{ width: 700 }}>
              <Calendar onChange={(v) => setValue(v as Date)} value={value} />
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Selected: {value.toDateString()}
          </p>
        </div>
      </div>
    </main>
  );
}
