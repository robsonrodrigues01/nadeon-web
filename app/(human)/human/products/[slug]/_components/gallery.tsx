"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { Product } from "@/lib/contracts/catalog";

export interface GalleryProps {
  product: Product;
}

interface GalleryTab {
  id: string;
  label: string;
  badge?: string;
  icon?: string;
}

const GALLERY_TABS: GalleryTab[] = [
  { id: "jar", label: "Jar" },
  { id: "capsules", label: "Capsules" },
  { id: "label", label: "Label" },
  { id: "how-to-take", label: "How to take" },
  { id: "supplement-facts", label: "Supplement facts" },
  { id: "routine", label: "Routine" },
  { id: "lab-report", label: "Lab report" },
  { id: "video", label: "▶ Video" },
];

export function Gallery({ product }: GalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeTab = GALLERY_TABS[activeIndex] || GALLERY_TABS[0];
  const imageSrc = product.images[0] || "/renders/placeholder.svg";

  return (
    <section aria-label="Product image gallery" className="flex flex-col gap-4">
      {/* Main Image Display */}
      <div className="relative aspect-square sm:aspect-4/3 lg:aspect-square w-full overflow-hidden rounded-card border border-border bg-bg-elevated flex items-center justify-center p-8 shadow-card">
        {/* Best Seller Badge */}
        <div className="absolute top-4 left-4 z-10 rounded-pill bg-bg border border-border px-3 py-1 text-xs font-bold uppercase tracking-wider text-product-amber">
          BEST SELLER
        </div>

        {/* Slide Counter */}
        <div
          className="absolute bottom-4 right-4 z-10 rounded-pill bg-bg/80 backdrop-blur-xs px-3 py-1 text-xs font-bold text-fg-muted border border-border"
          aria-live="polite"
        >
          {activeIndex + 1} / {GALLERY_TABS.length}
        </div>

        {/* Active View Visual Presentation */}
        <div className="relative h-full w-full flex flex-col items-center justify-center">
          <Image
            src={imageSrc}
            alt={`${product.name}, ${activeTab.label} view`}
            fill
            sizes="(min-width: 1024px) 50vw, (min-width: 640px) 66vw, 100vw"
            preload
            className="max-h-full max-w-full object-contain transition-all duration-300"
          />
          <div className="mt-2 text-center">
            <span className="sr-only">Viewing: {activeTab.label}</span>
          </div>
        </div>
      </div>

      {/* Gallery View Selection Buttons */}
      <div
        role="tablist"
        aria-label="Gallery view options"
        className="grid grid-cols-4 sm:grid-cols-8 gap-2"
      >
        {GALLERY_TABS.map((tab, idx) => {
          const isSelected = activeIndex === idx;
          return (
            <button
              key={tab.id}
              role="tab"
              type="button"
              id={`gallery-tab-${tab.id}`}
              aria-selected={isSelected}
              aria-controls="gallery-view-panel"
              onClick={() => setActiveIndex(idx)}
              className={`flex min-h-11 items-center justify-center rounded-field border text-xs font-bold px-2 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                isSelected
                  ? "border-accent bg-bg-elevated text-accent shadow-sm"
                  : "border-border/60 bg-bg text-fg-muted hover:border-border hover:text-fg"
              }`}
            >
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
