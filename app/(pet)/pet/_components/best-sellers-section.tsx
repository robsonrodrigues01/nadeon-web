"use client";

import React, { useState } from "react";
import { ProductCard } from "@/components/commerce/product-card";
import type { ProductCardData } from "@/components/commerce/product-card/product-card-data";

export interface BestSellersSectionProps {
  products: ProductCardData[];
}

type TabType = "Chews" | "Treats" | "Oils" | "Powder";

export function BestSellersSection({ products }: BestSellersSectionProps) {
  const [activeTab, setActiveTab] = useState<TabType>("Chews");

  const tabs: TabType[] = ["Chews", "Treats", "Oils", "Powder"];

  // Filter products by active tab format
  const filteredProducts = products.filter((product) => {
    const format = product.format.toLowerCase();
    switch (activeTab) {
      case "Chews":
        return format.includes("chew");
      case "Treats":
        return format.includes("treat");
      case "Oils":
        return format.includes("oil") || format.includes("drop");
      case "Powder":
        return format.includes("powder") || format.includes("top-dress");
      default:
        return true;
    }
  });

  return (
    <section
      className="w-full bg-bg text-fg py-14 sm:py-20 border-b border-border"
      aria-labelledby="best-sellers-heading"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs uppercase tracking-widest font-mono text-fg-muted">
              BEST SELLERS
            </span>
            <h2
              id="best-sellers-heading"
              className="mt-2 text-2xl sm:text-3xl font-normal font-sans tracking-tight text-fg"
            >
              Daily NMN soft chews
            </h2>
          </div>

          {/* Format Tabs */}
          <div
            role="tablist"
            aria-label="Product formats"
            className="flex items-center gap-2 p-1 bg-bg-elevated rounded border border-border overflow-x-auto"
          >
            {tabs.map((tab) => {
              const isSelected = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  id={`tab-${tab.toLowerCase()}`}
                  aria-selected={isSelected}
                  aria-controls={`panel-${tab.toLowerCase()}`}
                  onClick={() => setActiveTab(tab)}
                  className={`min-h-11 px-5 py-2 text-sm font-medium rounded transition-colors whitespace-nowrap ${
                    isSelected
                      ? "bg-accent text-accent-fg shadow-xs"
                      : "text-fg-muted hover:text-fg"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Panel */}
        <div
          role="tabpanel"
          id={`panel-${activeTab.toLowerCase()}`}
          aria-labelledby={`tab-${activeTab.toLowerCase()}`}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
