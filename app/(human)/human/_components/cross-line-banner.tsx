import React from "react";
import Link from "next/link";
import { PawIcon } from "@/components/brand/trust-strip/icons";

export function CrossLineBanner() {
  return (
    <section
      aria-labelledby="cross-line-title"
      className="w-full border-b border-border bg-bg-elevated text-fg py-14 sm:py-16"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="rounded-card border border-border bg-bg p-8 sm:p-12 shadow-card flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-accent text-accent-fg">
              <PawIcon className="h-8 w-8" />
            </span>
            <div>
              <h2
                id="cross-line-title"
                className="font-archivo text-2xl sm:text-3xl font-black uppercase text-fg"
              >
                Your dog ages too
              </h2>
              <p className="mt-2 text-sm sm:text-base text-fg-muted max-w-xl">
                NMN soft chews, oils and drops for dogs, cats and horses.
              </p>
            </div>
          </div>

          <Link
            href="/pet"
            className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full bg-accent px-8 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-accent-fg shadow-card transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-accent"
          >
            Visit Nadeon Pet →
          </Link>
        </div>
      </div>
    </section>
  );
}
