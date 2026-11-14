import React from "react";
import { cn } from "@/lib/utils";

export interface JarData {
  slug: string;
  name: string;
  technicalName: string;
  capColor: string;
  bodyColor: string;
  labelBg: string;
  labelFg: string;
  uppercaseName?: boolean;
}

interface JarPreviewProps {
  jar: JarData;
  size?: "desktop" | "mobile";
  className?: string;
}

export function JarPreview({
  jar,
  size = "desktop",
  className,
}: JarPreviewProps) {
  const isMobile = size === "mobile";

  return (
    <div
      data-testid={`jar-${jar.slug}-${size}`}
      aria-label={`${jar.name} - ${jar.technicalName}`}
      className={cn(
        "flex flex-col items-center justify-end shrink-0 select-none",
        isMobile ? "w-[64px] h-[75px]" : "w-[150px] h-[177px]",
        className
      )}
    >
      {/* Cap */}
      <div
        className={cn(
          "shadow-[inset_0_-3px_0_rgba(0,0,0,0.15)]",
          jar.capColor,
          isMobile
            ? "w-[49px] h-[12px] rounded-t-[3px] rounded-b-[4px]"
            : "w-[117px] h-[28px] rounded-t-[9px] rounded-b-[4px]"
        )}
      />

      {/* Body */}
      <div
        className={cn(
          "relative overflow-hidden shadow-[0_22px_36px_rgba(0,0,0,0.25)]",
          jar.bodyColor,
          isMobile
            ? "w-[64px] h-[60px] rounded-[6px]"
            : "w-[150px] h-[141px] rounded-[15px]"
        )}
      >
        {/* Label band */}
        <div
          className={cn(
            "absolute left-0 right-0 top-[16%] h-[62%] flex flex-col items-center justify-center text-center",
            jar.labelBg,
            jar.labelFg,
            isMobile ? "gap-px px-1" : "gap-1 px-1.5"
          )}
        >
          {/* Mini logo mark */}
          <svg
            viewBox="0 0 32 32"
            fill="none"
            aria-hidden="true"
            className={cn(
              "opacity-90",
              isMobile ? "w-2 h-2" : "w-[19px] h-[19px]"
            )}
          >
            <circle
              cx="16"
              cy="16"
              r="14"
              stroke="currentColor"
              strokeWidth="2.5"
            />
            <circle cx="16" cy="16" r="7" fill="currentColor" />
          </svg>

          {/* Product Name */}
          <div
            className={cn(
              "font-archivo font-extrabold leading-[0.95]",
              jar.uppercaseName ? "uppercase" : "normal-case",
              isMobile ? "text-[8px]" : "text-[19px]"
            )}
          >
            {jar.name}
          </div>

          {/* Technical Name / Subtitle */}
          <div
            className={cn(
              "font-bold tracking-[0.08em] uppercase opacity-85",
              isMobile ? "text-[6px]" : "text-[8px]"
            )}
          >
            {jar.technicalName}
          </div>
        </div>
      </div>
    </div>
  );
}
