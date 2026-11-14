"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ShieldCheck } from "lucide-react";

export function LabResultsSection() {
  const [lotInput, setLotInput] = useState("");
  const [message, setMessage] = useState("first lots publishing soon");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("first lots publishing soon");
  };

  return (
    <section
      aria-labelledby="lab-results-title"
      className="w-full border-b border-border bg-bg text-fg py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-block rounded-full bg-bg-elevated px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent border border-border">
              LAB RESULTS
            </span>
            <h2
              id="lab-results-title"
              className="mt-4 font-archivo text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-fg"
            >
              Every lot, tested.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-fg-muted leading-relaxed">
              Find the lot number printed on your label and see the third-party
              certificate of analysis for that exact batch.
            </p>

            <form
              onSubmit={handleSearch}
              className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md"
            >
              <div className="flex-1">
                <label htmlFor="lot-number" className="sr-only">
                  Enter lot number
                </label>
                <div className="relative">
                  <input
                    id="lot-number"
                    type="text"
                    value={lotInput}
                    onChange={(e) => setLotInput(e.target.value)}
                    placeholder="Enter lot number"
                    className="w-full min-h-[44px] rounded-full border border-border bg-bg-elevated px-5 py-3 text-sm text-fg placeholder:text-fg-muted focus:border-accent focus:outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-accent-fg shadow-card transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-accent"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                <span>Search</span>
              </button>
            </form>

            <p
              className="mt-3 text-xs font-semibold uppercase tracking-wider text-accent"
              role="status"
            >
              {message}
            </p>

            <div className="mt-8">
              <Link
                href="/lab-results"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border-2 border-border px-7 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-fg transition-colors hover:border-fg focus-visible:outline-2 focus-visible:outline-accent"
              >
                See our lab results
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-card border border-border bg-bg-elevated p-8 shadow-card flex items-start gap-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-accent-fg">
                <ShieldCheck className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-archivo text-xl font-bold uppercase text-fg">
                  60-day guarantee
                </h3>
                <p className="mt-2 text-sm text-fg-muted leading-relaxed">
                  Try it for 60 days. Not for you? We refund the first order.
                </p>
                <Link
                  href="/about"
                  className="mt-4 inline-block text-xs font-bold uppercase tracking-wider text-accent hover:underline"
                >
                  Shop with confidence →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
