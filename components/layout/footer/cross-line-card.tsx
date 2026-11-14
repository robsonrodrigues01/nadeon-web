import React from "react";
import Link from "next/link";
import { CROSS_PROMO_CARD } from "./footer-data";
import type { FooterLine } from "./types";

export interface CrossLineCardProps {
  line?: FooterLine;
  className?: string;
}

export function CrossLineCard({
  line = "human",
  className = "",
}: CrossLineCardProps) {
  const data = CROSS_PROMO_CARD[line];
  const isPet = line === "pet";

  return (
    <Link
      href={data.href}
      aria-label={data.ariaLabel}
      className={`group block rounded-card p-5 sm:p-6 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
        isPet
          ? "border border-accent/40 bg-[radial-gradient(ellipse_at_30%_40%,rgb(62,46,34),rgb(22,16,12)_75%)] text-fg hover:border-accent hover:shadow-card"
          : "bg-[linear-gradient(135deg,rgb(255,237,176),rgb(255,220,192),rgb(221,238,251))] text-accent-fg hover:brightness-105 hover:shadow-card"
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5 min-w-0">
          {/* Brand line iconography */}
          {isPet ? (
            <div
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-accent"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
          ) : (
            <div
              className="w-9 h-9 flex items-center justify-center shrink-0 opacity-80"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 100 100"
                width="34"
                height="34"
                fill="currentColor"
              >
                <ellipse
                  cx="22"
                  cy="42"
                  rx="9"
                  ry="12"
                  transform="rotate(-25 22 42)"
                />
                <ellipse
                  cx="39"
                  cy="24"
                  rx="9.5"
                  ry="13"
                  transform="rotate(-8 39 24)"
                />
                <ellipse
                  cx="61"
                  cy="24"
                  rx="9.5"
                  ry="13"
                  transform="rotate(8 61 24)"
                />
                <ellipse
                  cx="78"
                  cy="42"
                  rx="9"
                  ry="12"
                  transform="rotate(25 78 42)"
                />
                <path d="M50 48 C 38 48 28 60 24 70 C 20 80 26 90 36 89 C 42 88 46 85 50 85 C 54 85 58 88 64 89 C 74 90 80 80 76 70 C 72 60 62 48 50 48 Z" />
              </svg>
            </div>
          )}

          <div className="truncate">
            <div
              className={`font-extrabold text-base tracking-tight ${
                isPet
                  ? "bg-gradient-gold bg-clip-text text-transparent"
                  : "text-accent-fg"
              }`}
            >
              {data.title}
            </div>
            <div
              className={`text-xs ${
                isPet ? "text-fg/75" : "text-accent-fg/80"
              } truncate`}
            >
              {data.description}
            </div>
          </div>
        </div>

        <span
          className="text-lg font-bold group-hover:translate-x-1 transition-transform shrink-0"
          aria-hidden="true"
        >
          →
        </span>
      </div>
    </Link>
  );
}
