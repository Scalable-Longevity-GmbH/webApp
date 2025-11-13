"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Übersicht", href: "/" },
  { label: "Patienten", href: "/patients" },
  { label: "Analyzer", href: "/analyzer/start" },
  { label: "Einstellungen", href: "/settings" },
];

export default function NavLinks() {
  const pathname = usePathname() ?? "/";

  return (
    <div className="flex flex-row justify-center items-center p-2 rounded-full bg-card">
      {navItems.map((item) => {
        const isActive =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

        const base =
          "px-8 py-3 flex items-center justify-center rounded-full transition-colors";
        const activeClasses =
          "bg-[var(--color-primary)] text-[var(--color-background)]"; // primary background, light text
        const inactiveClasses =
          "text-[var(--color-font-primary)] hover:bg-[var(--color-card-border)]"; // neutral text, subtle hover

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`${base} ${isActive ? activeClasses : inactiveClasses}`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
