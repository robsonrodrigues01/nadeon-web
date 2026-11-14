import React from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

/**
 * Pet paw icon extracted from the Nadeon Pet brand kit design boards.
 * Used inside circular trust badges in Pet line.
 */
export function PawIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <ellipse cx="22" cy="42" rx="9" ry="12" transform="rotate(-25 22 42)" />
      <ellipse cx="39" cy="24" rx="9.5" ry="13" transform="rotate(-8 39 24)" />
      <ellipse cx="61" cy="24" rx="9.5" ry="13" transform="rotate(8 61 24)" />
      <ellipse cx="78" cy="42" rx="9" ry="12" transform="rotate(25 78 42)" />
      <path d="M50 48 C 38 48 28 60 24 70 C 20 80 26 90 36 89 C 42 88 46 85 50 85 C 54 85 58 88 64 89 C 74 90 80 80 76 70 C 72 60 62 48 50 48 Z" />
    </svg>
  );
}

/**
 * Brand mark icon for the Nadeon Human line trust badge.
 * Represents scientific purity, longevity and cellular health.
 */
export function BrandMarkIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.2A7 7 0 0 1 13 20h-2Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6" />
    </svg>
  );
}
