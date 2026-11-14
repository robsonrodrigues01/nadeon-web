"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LineChoiceButtonProps {
  line: "human" | "pet";
  href: string;
  className?: string;
  children: React.ReactNode;
  "aria-label"?: string;
}

export function LineChoiceButton({
  line,
  href,
  className,
  children,
  "aria-label": ariaLabel,
}: LineChoiceButtonProps) {
  const handleClick = () => {
    if (typeof document !== "undefined") {
      const maxAge = 365 * 24 * 60 * 60;
      document.cookie = `nadeon_theme=${line}; path=/; max-age=${maxAge}; SameSite=Lax`;
      document.cookie = `theme=${line}; path=/; max-age=${maxAge}; SameSite=Lax`;
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center justify-center font-bold rounded-full transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 min-h-[44px] min-w-[44px] cursor-pointer",
        className
      )}
    >
      {children}
    </Link>
  );
}
