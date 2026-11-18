import React from "react";
import Link from "next/link";
import { HUMAN_FOOTER_COLUMNS, PET_FOOTER_COLUMNS } from "./footer-data";
import type { FooterLine } from "./types";

export interface FooterNavProps {
  line?: FooterLine;
  className?: string;
}

export function FooterNav({ line = "human", className = "" }: FooterNavProps) {
  const columns = line === "pet" ? PET_FOOTER_COLUMNS : HUMAN_FOOTER_COLUMNS;

  return (
    <nav
      aria-label="Footer navigation"
      className={`grid grid-cols-2 md:grid-cols-4 gap-8 ${className}`}
    >
      {columns.map((column) => (
        <div key={column.title} className="flex flex-col">
          <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-accent mb-3.5 select-none">
            {column.title}
          </h3>
          <ul className="space-y-2">
            {column.links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="relative inline-block py-1 text-sm text-fg/80 hover:text-accent hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm transition-colors before:absolute before:inset-x-0 before:-inset-y-2 before:content-['']"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
