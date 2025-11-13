"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ArrowUpRight } from "lucide-react";
import { exampleUsers as users, User as ExampleUser } from "../../example-user";

function getBmi(user: ExampleUser) {
  if (typeof user.bmi === "number") return user.bmi.toFixed(1);
  return "-";
}

function getBioAge(user: ExampleUser) {
  // uses your typed field from example-user.ts
  return `${user.biologicalAge} Jahre`;
}

export default function Start() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return users.filter((u: ExampleUser) =>
      (u.name || "").toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="w-full h-screen flex flex-col justify-start items-center gap-4 pt-28">
      {/* Search bar */}
      <div className="relative w-full max-w-xl">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="peer rounded-full bg-card px-8 h-16 w-full focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Suche Patienten"
        />
        <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-[var(--font-secondary)] peer-focus:text-primary" />
      </div>

      <div className="w-full max-w-md mt-4 grid gap-3">
        {filtered.length === 0 && query !== "" && (
          <div className="text-sm text-[var(--font-secondary)]">
            Keine Patienten gefunden
          </div>
        )}

        {filtered.map((user: ExampleUser) => (
          <Link
            key={user.name}
            href="/analyzer/patient-view"
            className="relative flex flex-col bg-card rounded-2xl shadow-sm px-5 py-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            {/* Top row: avatar + name + bio age */}
            <div className="flex items-center gap-3 mb-4">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[var(--card-border)] flex items-center justify-center text-sm font-medium text-[var(--font-primary)]">
                  {user.name
                    ? user.name
                        .split(" ")
                        .map((s) => s[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()
                    : "?"}
                </div>
              )}

              <div className="flex flex-col">
                <span className="font-medium text-[var(--font-primary)]">
                  {user.name}
                </span>
                <span className="text-xs text-[var(--font-secondary)]">
                  {getBioAge(user)}
                </span>
              </div>
            </div>

            {/* Info rows */}
            <div className="space-y-1 pr-12">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--font-primary)]">Geschlecht:</span>
                <span className="text-[var(--font-primary)]">
                  {user.gender || "—"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--font-primary)]">
                  Biologisches Alter:
                </span>
                <span className="text-[var(--font-primary)]">
                  {getBioAge(user)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-font-primary">BMI:</span>
                <span className="text-[var(--font-primary)]">
                  {getBmi(user)}
                </span>
              </div>
            </div>

            {/* Circular CTA bottom right */}
            <div className="absolute bottom-4 right-4 h-10 w-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
              <ArrowUpRight className="h-5 w-5 text-[var(--color-background)]" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
