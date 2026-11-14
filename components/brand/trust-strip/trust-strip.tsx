"use client";

import React from "react";
import { useMarket } from "@/lib/market/context";
import type { Market } from "@/lib/market/types";
import { formatFreeShippingThreshold } from "@/lib/market/shipping";
import { BrandMarkIcon, PawIcon } from "./icons";

export interface TrustItem {
  id?: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

/**
 * Trust items for a line in a market. The free shipping item shows the market's
 * threshold (Rule 14) and is left out where the market advertises no free shipping.
 */
export function getTrustItems(
  line: "human" | "pet",
  market: Market
): TrustItem[] {
  const threshold = formatFreeShippingThreshold(market, line);
  const freeShipping: TrustItem[] =
    threshold === null
      ? []
      : [
          {
            id: "free-shipping",
            title: "Free shipping",
            description: `Over ${threshold}`,
          },
        ];

  return [
    {
      id: "clifton-lab",
      title: "Made in Clifton, NJ",
      description: "Our own lab",
    },
    {
      id: "tested-lots",
      title: "Tested every lot",
      description: "Public lab reports",
    },
    ...freeShipping,
    {
      id: "guarantee",
      title: "60-day guarantee",
      description: "Love it or refund",
    },
  ];
}

export interface TrustStripProps extends React.HTMLAttributes<HTMLElement> {
  line?: "human" | "pet";
  items?: TrustItem[];
  containerClassName?: string;
  "aria-label"?: string;
}

/**
 * TrustStrip component: Displays brand trust highlights
 * (Made in Clifton, NJ · Our own lab · Tested every lot · Public lab reports ·
 * Free shipping · 60-day guarantee).
 *
 * Implements semantic HTML (section > ul > li) as an informative indicator
 * with no interactive buttons or inputs, per design and Catalogo specifications.
 */
export function TrustStrip({
  line = "human",
  items,
  className = "",
  containerClassName = "",
  "aria-label": ariaLabel = "Trust highlights",
  ...props
}: TrustStripProps) {
  const { market } = useMarket();
  const isPet = line === "pet";
  const resolvedItems = items ?? getTrustItems(line, market);

  return (
    <section
      aria-label={ariaLabel}
      className={`w-full border-b border-border bg-bg text-fg ${className}`}
      {...props}
    >
      <div
        className={`mx-auto max-w-7xl px-5 py-7 sm:px-8 sm:py-8 lg:px-18 lg:py-8.5 ${containerClassName}`}
      >
        <ul
          role="list"
          className="grid grid-cols-2 gap-x-4 gap-y-6 sm:gap-6 lg:grid-cols-4 lg:gap-6"
        >
          {resolvedItems.map((item, index) => {
            const defaultIcon = isPet ? (
              <PawIcon className="h-5 w-5" />
            ) : (
              <BrandMarkIcon className="h-5 w-5" />
            );
            const icon = item.icon ?? defaultIcon;

            return (
              <li key={item.id ?? index} className="flex items-center gap-3">
                <div
                  className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-accent text-accent"
                  aria-hidden="true"
                >
                  {icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold leading-tight text-fg">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-xs text-fg-muted leading-tight">
                    {item.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default TrustStrip;
