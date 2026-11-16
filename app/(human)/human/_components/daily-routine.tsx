"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/commerce/product-card";
import type { ProductCardData } from "@/components/commerce/product-card/product-card-data";

export interface DailyRoutineProps {
  products: ProductCardData[];
}

const FORMAT_TABS = ["All", "Capsules", "Powders", "Tinctures"] as const;
type TabType = (typeof FORMAT_TABS)[number];
const PANEL_ID = "daily-routine-panel";

// Neutral placeholder from public/renders/ used for products without dedicated pack renders (Glow, Prime)
// to prevent attributing another product's packaging/artwork (such as renew.png or biohack.png).
const NEUTRAL_PLACEHOLDER = "/renders/placeholder.svg";

const ROUTINE_RENDER_OVERRIDES: Record<string, string> = {
  glow: NEUTRAL_PLACEHOLDER,
  prime: NEUTRAL_PLACEHOLDER,
};

export function DailyRoutine({ products }: DailyRoutineProps) {
  const [activeTab, setActiveTab] = useState<TabType>("All");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const resolvedProducts = products.map((p) => {
    const override = ROUTINE_RENDER_OVERRIDES[p.slug];
    if (override && (!p.images.length || !p.images[0])) {
      return {
        ...p,
        images: [override],
      };
    }
    return p;
  });

  // WAI-ARIA tabs: arrows move and select, Home/End jump to the ends.
  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const current = FORMAT_TABS.indexOf(activeTab);
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (current + 1) % FORMAT_TABS.length;
    else if (e.key === "ArrowLeft")
      next = (current - 1 + FORMAT_TABS.length) % FORMAT_TABS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = FORMAT_TABS.length - 1;
    if (next === null) return;
    e.preventDefault();
    setActiveTab(FORMAT_TABS[next]);
    tabRefs.current[next]?.focus();
  };

  const filteredProducts =
    activeTab === "All"
      ? resolvedProducts
      : resolvedProducts.filter(
          (p) => p.format.toLowerCase() === activeTab.toLowerCase()
        );

  return (
    <section
      id="daily-routine"
      aria-labelledby="daily-routine-title"
      className="w-full border-b border-border bg-bg text-fg py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block rounded-full bg-bg-elevated px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent border border-border">
            THE HUMAN LINE
          </span>
          <h2
            id="daily-routine-title"
            className="mt-4 font-archivo text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-fg"
          >
            Build your daily routine
          </h2>
        </div>

        {/* Format tabs */}
        <div
          role="tablist"
          aria-label="Filter products by format"
          onKeyDown={handleTabKeyDown}
          className="mt-10 flex flex-wrap justify-center gap-3"
        >
          {FORMAT_TABS.map((tab, index) => {
            const isSelected = activeTab === tab;
            return (
              <button
                key={tab}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                type="button"
                role="tab"
                id={`tab-${tab.toLowerCase()}`}
                aria-selected={isSelected}
                aria-controls={PANEL_ID}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setActiveTab(tab)}
                className={`min-h-[44px] min-w-[44px] rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all focus-visible:outline-2 focus-visible:outline-accent ${
                  isSelected
                    ? "bg-accent text-accent-fg shadow-card"
                    : "border border-border bg-bg-elevated text-fg-muted hover:border-fg hover:text-fg"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid */}
        <div
          id={PANEL_ID}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab.toLowerCase()}`}
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.slug}
              product={product}
              className="h-full"
            />
          ))}
        </div>

        {/* Quiz callout banner */}
        <div className="mt-16 rounded-card border border-border bg-bg-elevated p-8 sm:p-10 shadow-card flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h3 className="font-archivo text-xl sm:text-2xl font-black uppercase text-fg">
              Not sure where to start?
            </h3>
            <p className="mt-2 text-sm sm:text-base text-fg-muted max-w-lg">
              Answer 5 questions and get your routine, plus 10% off.
            </p>
          </div>
          <Link
            href="/human/quiz"
            className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full bg-accent px-8 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-accent-fg shadow-card transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-accent"
          >
            Take the quiz
          </Link>
        </div>
      </div>
    </section>
  );
}
