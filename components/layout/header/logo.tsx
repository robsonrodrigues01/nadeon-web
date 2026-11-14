import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface LogoProps {
  variant?: "human" | "pet";
  className?: string;
  size?: "sm" | "md";
}

export function Logo({ variant = "human", className, size = "md" }: LogoProps) {
  const isPet = variant === "pet";
  const homeHref = isPet ? "/pet" : "/human";
  const iconSize = size === "sm" ? 24 : 30;

  return (
    <Link
      href={homeHref}
      aria-label={`Nadeon Labs ${isPet ? "Pet" : "Human"} Home`}
      className={cn(
        "inline-flex items-center gap-2 group transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm min-h-11 py-1",
        className
      )}
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <defs>
          <linearGradient
            id="nadeon-logo-gold-grad"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="var(--product-amber)" />
            <stop offset="50%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--product-amber)" />
          </linearGradient>
        </defs>
        <circle
          cx="16"
          cy="16"
          r="14"
          stroke={isPet ? "currentColor" : "url(#nadeon-logo-gold-grad)"}
          strokeWidth="2.5"
          className={isPet ? "text-fg" : ""}
        />
        <circle
          cx="16"
          cy="16"
          r="7"
          fill={isPet ? "currentColor" : "url(#nadeon-logo-gold-grad)"}
          className={isPet ? "text-fg" : ""}
        />
      </svg>
      <span
        className={cn(
          "font-archivo font-extrabold tracking-tight whitespace-nowrap",
          size === "sm" ? "text-sm" : "text-lg",
          isPet
            ? "text-fg"
            : "bg-gradient-gold bg-clip-text text-transparent drop-shadow-sm"
        )}
      >
        Nadeon <span className="font-normal">Labs</span>
      </span>
    </Link>
  );
}
