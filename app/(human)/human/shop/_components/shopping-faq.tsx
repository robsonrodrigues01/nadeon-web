"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SHOPPING_FAQS } from "./types";

export function ShoppingFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section
      aria-labelledby="faq-section-heading"
      className="bg-bg text-fg py-16 lg:py-24 px-5 sm:px-8 lg:px-18 border-t border-border/40"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 lg:gap-20">
        {/* Left header column */}
        <div className="lg:w-80 shrink-0">
          <p className="text-xs sm:text-sm font-bold tracking-[0.14em] uppercase text-accent bg-gradient-gold bg-clip-text text-transparent">
            FAQ
          </p>
          <h2
            id="faq-section-heading"
            className="title mt-2 text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-fg"
          >
            Shopping questions
          </h2>
          <div className="mt-5">
            <Link
              href="/faq"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border-2 border-fg px-6 py-2.5 font-bold text-sm text-fg transition-all hover:bg-fg hover:text-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              All FAQs
            </Link>
          </div>
        </div>

        {/* Right accordion list */}
        <div className="flex-1 divide-y divide-border/40 border-t border-b border-border/40 lg:border-t-0">
          {SHOPPING_FAQS.map((item, idx) => {
            const isOpen = openIndex === idx;
            const contentId = `faq-answer-${idx}`;
            const buttonId = `faq-btn-${idx}`;

            return (
              <div key={item.question} className="py-4 sm:py-5">
                <button
                  type="button"
                  id={buttonId}
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  className="w-full flex items-center justify-between gap-4 text-left font-bold text-base sm:text-lg text-fg hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xs min-h-[44px]"
                >
                  <span>{item.question}</span>
                  <span
                    aria-hidden="true"
                    className="text-2xl font-light shrink-0 text-accent select-none"
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                <div
                  id={contentId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className={`pt-2 pb-4 text-sm sm:text-base text-fg-muted leading-relaxed ${
                    isOpen ? "block" : "hidden"
                  }`}
                >
                  {item.answer}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
