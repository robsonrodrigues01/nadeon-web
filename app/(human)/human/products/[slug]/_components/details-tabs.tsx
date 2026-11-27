"use client";

import React, { useState } from "react";
import type { Product } from "@/lib/contracts/catalog";
import {
  Claim,
  FDA_DISCLAIMER,
} from "@/components/commerce/product-card/claim";

export interface DetailsTabsProps {
  product: Product;
}

type TabKey = "supplement-facts" | "how-to-use" | "benefits" | "lab-results";

export function DetailsTabs({ product }: DetailsTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("supplement-facts");
  const [openAccordion, setOpenAccordion] = useState<Record<TabKey, boolean>>({
    "supplement-facts": true,
    "how-to-use": true,
    benefits: true,
    "lab-results": true,
  });

  const toggleAccordion = (key: TabKey) => {
    setOpenAccordion((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleLotSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <section
      id="details-section"
      aria-label="Product details and specifications"
      className="w-full bg-fg text-bg py-16 px-4 sm:px-8 lg:px-18 border-b border-border"
    >
      <div className="mx-auto max-w-7xl">
        {/* Desktop Tab Buttons */}
        <div
          role="tablist"
          aria-label="Product details tabs"
          className="hidden md:flex border-b border-bg/15 mb-10 gap-8"
        >
          <button
            role="tab"
            type="button"
            id="tab-benefits"
            aria-selected={activeTab === "benefits"}
            aria-controls="panel-benefits"
            onClick={() => setActiveTab("benefits")}
            className={`min-h-11 pb-4 font-extrabold text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              activeTab === "benefits"
                ? "border-b-3 border-bg text-bg"
                : "text-bg/50 hover:text-bg"
            }`}
          >
            Benefits
          </button>

          <button
            role="tab"
            type="button"
            id="tab-supplement-facts"
            aria-selected={activeTab === "supplement-facts"}
            aria-controls="panel-supplement-facts"
            onClick={() => setActiveTab("supplement-facts")}
            className={`min-h-11 pb-4 font-extrabold text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              activeTab === "supplement-facts"
                ? "border-b-3 border-bg text-bg"
                : "text-bg/50 hover:text-bg"
            }`}
          >
            Supplement Facts
          </button>

          <button
            role="tab"
            type="button"
            id="tab-how-to-use"
            aria-selected={activeTab === "how-to-use"}
            aria-controls="panel-how-to-use"
            onClick={() => setActiveTab("how-to-use")}
            className={`min-h-11 pb-4 font-extrabold text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              activeTab === "how-to-use"
                ? "border-b-3 border-bg text-bg"
                : "text-bg/50 hover:text-bg"
            }`}
          >
            How to use
          </button>

          <button
            role="tab"
            type="button"
            id="tab-lab-results"
            aria-selected={activeTab === "lab-results"}
            aria-controls="panel-lab-results"
            onClick={() => setActiveTab("lab-results")}
            className={`min-h-11 pb-4 font-extrabold text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              activeTab === "lab-results"
                ? "border-b-3 border-bg text-bg"
                : "text-bg/50 hover:text-bg"
            }`}
          >
            Lab results
          </button>
        </div>

        {/* Mobile Section Header */}
        <div className="md:hidden mb-6">
          <div className="text-xs font-bold tracking-widest uppercase text-bg/60">
            DETAILS
          </div>
          <h2 className="text-2xl font-black font-archivo uppercase text-bg mt-1">
            Inside the jar
          </h2>
        </div>

        {/* Desktop 3-Column Layout & Mobile Accordion */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Column 1 / Accordion 1: Supplement Facts */}
          <div
            id="supplement-facts"
            className="rounded-card border-2 border-bg bg-white p-6 text-bg shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-archivo text-2xl font-black tracking-tight border-b-6 border-bg pb-2 w-full uppercase">
                Supplement Facts
              </h3>
              <button
                type="button"
                className="md:hidden min-h-11 min-w-11 flex items-center justify-center text-xl font-bold"
                onClick={() => toggleAccordion("supplement-facts")}
                aria-expanded={openAccordion["supplement-facts"]}
                aria-label="Toggle Supplement Facts panel"
              >
                {openAccordion["supplement-facts"] ? "−" : "+"}
              </button>
            </div>

            {openAccordion["supplement-facts"] && (
              <div className="mt-3 space-y-2 text-sm">
                {product.serving && (
                  <div className="flex justify-between py-1 border-b border-bg/20">
                    <span>Serving size: {product.serving}</span>
                  </div>
                )}
                {product.servingsPerJar != null && (
                  <div className="flex justify-between py-1 border-b-3 border-bg font-semibold">
                    <span>
                      Servings per container: {product.servingsPerJar}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-xs font-bold pt-2 pb-1 border-b border-bg/30">
                  <span>Amount per serving</span>
                  <span>% DV</span>
                </div>

                <div className="flex justify-between items-baseline py-2 border-b border-bg/30 font-bold">
                  <span>NMN (β-nicotinamide mononucleotide)</span>
                  <div className="flex gap-4">
                    <span>500 mg</span>
                    <span className="w-4 text-right">†</span>
                  </div>
                </div>

                <div className="text-xs pt-3 border-t-3 border-bg font-medium">
                  † Daily Value not established.
                </div>
              </div>
            )}
          </div>

          {/* Column 2 / Accordion 2 & 3: How to use + Benefits */}
          <div className="space-y-8">
            {/* How to use */}
            <div className="rounded-card border border-bg/20 bg-bg/5 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-archivo text-xl font-black uppercase text-bg">
                  How to use
                </h3>
                <button
                  type="button"
                  className="md:hidden min-h-11 min-w-11 flex items-center justify-center text-xl font-bold"
                  onClick={() => toggleAccordion("how-to-use")}
                  aria-expanded={openAccordion["how-to-use"]}
                  aria-label="Toggle How to use panel"
                >
                  {openAccordion["how-to-use"] ? "−" : "+"}
                </button>
              </div>

              {openAccordion["how-to-use"] && (
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-bg text-accent font-bold text-xs"
                    >
                      1
                    </span>
                    <div>
                      <p className="font-bold text-sm text-bg">
                        Take 2 capsules daily
                      </p>
                      <p className="text-xs text-bg/70">
                        With water, in the morning.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-bg text-accent font-bold text-xs"
                    >
                      2
                    </span>
                    <div>
                      <p className="font-bold text-sm text-bg">
                        Same time, every day
                      </p>
                      <p className="text-xs text-bg/70">
                        Consistency matters more than any single dose.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-bg text-accent font-bold text-xs"
                    >
                      3
                    </span>
                    <div>
                      <p className="font-bold text-sm text-bg">
                        Talk to your doctor
                      </p>
                      <p className="text-xs text-bg/70">
                        If pregnant, nursing or on medication.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Benefits */}
            <div className="rounded-card border border-bg/20 bg-bg/5 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-archivo text-xl font-black uppercase text-bg">
                  Benefits
                </h3>
                <button
                  type="button"
                  className="md:hidden min-h-11 min-w-11 flex items-center justify-center text-xl font-bold"
                  onClick={() => toggleAccordion("benefits")}
                  aria-expanded={openAccordion["benefits"]}
                  aria-label="Toggle Benefits panel"
                >
                  {openAccordion["benefits"] ? "−" : "+"}
                </button>
              </div>

              {openAccordion["benefits"] && product.benefits.length > 0 && (
                <>
                  <ul className="space-y-3 text-sm" role="list">
                    {product.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span
                          className="text-accent font-bold select-none"
                          aria-hidden="true"
                        >
                          ✓
                        </span>
                        <Claim>{benefit}</Claim>
                      </li>
                    ))}
                  </ul>
                  <p
                    role="note"
                    className="mt-3 text-[11px] text-fg-muted leading-normal italic"
                  >
                    {FDA_DISCLAIMER}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Column 3 / Accordion 4: Lab Results */}
          <div className="rounded-card border border-bg/20 bg-bg/5 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold tracking-widest uppercase text-bg/60">
                  LAB RESULTS
                </span>
                <h3 className="font-archivo text-xl font-black uppercase text-bg mt-1">
                  Look up your lot
                </h3>
              </div>
              <button
                type="button"
                className="md:hidden min-h-11 min-w-11 flex items-center justify-center text-xl font-bold"
                onClick={() => toggleAccordion("lab-results")}
                aria-expanded={openAccordion["lab-results"]}
                aria-label="Toggle Lab results panel"
              >
                {openAccordion["lab-results"] ? "−" : "+"}
              </button>
            </div>

            {openAccordion["lab-results"] && (
              <div className="space-y-4">
                <p className="text-xs text-bg/80 leading-relaxed">
                  The lot number is printed on the bottom of the jar.
                </p>

                <form onSubmit={handleLotSearchSubmit} className="flex gap-2">
                  <div className="flex-1">
                    <label htmlFor="lot-search-input" className="sr-only">
                      Enter lot number
                    </label>
                    <input
                      id="lot-search-input"
                      type="text"
                      placeholder="e.g. NL-0000"
                      disabled
                      aria-disabled="true"
                      className="w-full min-h-11 rounded-field border border-bg/30 bg-white/50 px-3 py-2 text-sm text-bg placeholder:text-bg/50 cursor-not-allowed"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled
                    aria-disabled="true"
                    className="min-h-11 px-4 rounded-field bg-bg/40 text-fg text-xs font-bold uppercase tracking-wider cursor-not-allowed"
                  >
                    Search
                  </button>
                </form>

                {/* Compliance Rule 8 notice */}
                <div
                  role="note"
                  className="rounded-field border border-bg/20 bg-white/70 p-3 text-xs font-semibold text-bg"
                >
                  first lots publishing soon
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
