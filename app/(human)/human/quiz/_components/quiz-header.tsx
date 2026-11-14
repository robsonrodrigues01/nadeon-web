"use client";

import React from "react";
import Link from "next/link";

export interface QuizHeaderProps {
  statusText?: string;
  exitHref?: string;
}

export function QuizHeader({
  statusText = "Takes about 1 minute · 10% off at the end",
  exitHref = "/human",
}: QuizHeaderProps) {
  return (
    <header
      className="border-b border-border/40 px-5 sm:px-16 py-4 sm:py-5 flex items-center justify-between text-fg bg-bg-elevated/95 backdrop-blur-sm sticky top-0 z-30"
      role="banner"
    >
      {/* Brand logo & Line pill */}
      <div className="flex items-center gap-3">
        <Link
          href={exitHref}
          className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-field py-1"
          aria-label="Nadeon Human Home"
        >
          <div className="flex items-center gap-2">
            <span
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs border border-accent/40 bg-accent/20 text-accent shrink-0"
              aria-hidden="true"
            >
              N
            </span>
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-fg">
              Nadeon <span className="font-normal text-fg-muted">Labs</span>
            </span>
          </div>
        </Link>
        <span
          className="rounded-pill px-2.5 py-0.5 text-[11px] font-bold tracking-wider bg-bg text-accent border border-border inline-flex items-center"
          aria-label="Line: Human"
        >
          HUMAN
        </span>
      </div>

      {/* Middle status helper text (desktop) */}
      <div
        className="hidden md:block text-xs sm:text-sm text-fg-muted font-medium"
        aria-live="polite"
      >
        {statusText}
      </div>

      {/* Exit link */}
      <div>
        <Link
          href={exitHref}
          className="inline-flex items-center gap-2 text-sm font-bold text-fg hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-pill px-2 sm:px-3 py-1.5 transition-colors cursor-pointer"
          aria-label="Exit quiz"
        >
          <span className="hidden sm:inline">Exit quiz</span>
          <span
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-border/80 flex items-center justify-center text-sm font-semibold hover:border-accent"
            aria-hidden="true"
          >
            ✕
          </span>
        </Link>
      </div>
    </header>
  );
}
