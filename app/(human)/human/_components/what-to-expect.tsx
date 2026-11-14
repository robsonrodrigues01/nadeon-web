import React from "react";
import Link from "next/link";
import { Claim } from "@/components/commerce/product-card/claim";

export function WhatToExpect() {
  const timeline = [
    {
      week: "Week 1",
      title: "Build the habit",
      description: "Take it at the same time each day.",
    },
    {
      week: "Week 4",
      title: "Stay consistent",
      description: "Daily use matters more than any single dose.",
    },
    {
      week: "Week 8",
      title: "Check in",
      description: "Notice your energy, focus and routine.",
    },
    {
      week: "Week 12",
      title: "Make it yours",
      description: "Keep going or adjust with your doctor.",
    },
  ];

  return (
    <section
      aria-labelledby="what-to-expect-title"
      className="w-full border-b border-border bg-bg text-fg py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block rounded-full bg-bg-elevated px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent border border-border">
            WHAT TO EXPECT
          </span>
          <h2
            id="what-to-expect-title"
            className="mt-4 font-archivo text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-fg"
          >
            Consistency is the formula
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {timeline.map((item) => (
            <div
              key={item.week}
              className="flex flex-col justify-between rounded-card border border-border bg-bg-elevated p-8 shadow-card text-center sm:text-left"
            >
              <div>
                <span className="font-archivo text-xl font-black uppercase text-accent">
                  {item.week}
                </span>
                <h3 className="mt-4 font-archivo text-xl font-bold uppercase text-fg">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-fg-muted leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Claim>
            Individual results vary. These statements have not been evaluated by
            the FDA.*
          </Claim>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="#daily-routine"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-accent px-8 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-accent-fg shadow-card transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-accent"
          >
            Start your routine
          </Link>
          <Link
            href="/human/subscribe"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border-2 border-border px-7 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-fg transition-colors hover:border-fg focus-visible:outline-2 focus-visible:outline-accent"
          >
            Subscribe &amp; save 15%
          </Link>
        </div>
      </div>
    </section>
  );
}
