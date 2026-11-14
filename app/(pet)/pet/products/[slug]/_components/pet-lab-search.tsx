"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export interface PetLabSearchProps {
  className?: string;
}

export function PetLabSearch({ className = "" }: PetLabSearchProps) {
  return (
    <section
      id="lab-report"
      aria-labelledby="lab-report-heading"
      className={`py-12 sm:py-16 border-t border-border ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="rounded-card border border-border bg-bg-elevated p-6 sm:p-10 shadow-card">
          <div className="max-w-2xl">
            <span className="text-xs font-extrabold uppercase tracking-widest text-accent block mb-2">
              LAB RESULTS
            </span>
            <h2
              id="lab-report-heading"
              className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-fg mb-3"
            >
              Lab report
            </h2>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3"
            >
              <div className="flex-1">
                <label
                  htmlFor="lot-search-input"
                  className="block text-xs font-bold uppercase tracking-wider text-fg/80 mb-2"
                >
                  Lot number
                </label>
                <input
                  id="lot-search-input"
                  name="lotNumber"
                  type="text"
                  disabled
                  aria-disabled="true"
                  className="w-full min-h-11 rounded-field border border-border bg-bg px-4 py-2 text-sm text-fg placeholder:text-fg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              <Button
                type="submit"
                disabled
                aria-disabled="true"
                size="default"
                className="min-h-11 whitespace-nowrap"
              >
                Search
              </Button>
            </form>

            <p className="mt-3 text-xs text-accent font-semibold">
              first lots publishing soon
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
