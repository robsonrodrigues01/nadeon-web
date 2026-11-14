"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Minus } from "lucide-react";
import { HUMAN_FAQS, type FaqItem } from "./faqs-data";

export type { FaqItem };
export { HUMAN_FAQS };

export interface FaqAccordionProps {
  faqs?: FaqItem[];
}

export function FaqAccordion({ faqs = HUMAN_FAQS }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      aria-labelledby="faq-title"
      className="w-full border-b border-border bg-bg text-fg py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-4xl px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
          <h2
            id="faq-title"
            className="font-archivo text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-fg"
          >
            Questions, answered
          </h2>
          <Link
            href="/faq"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border-2 border-border px-7 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-fg transition-colors hover:border-fg focus-visible:outline-2 focus-visible:outline-accent"
          >
            All FAQs
          </Link>
        </div>

        <div className="divide-y divide-border border-y border-border">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-btn-${index}`;

            return (
              <div key={faq.question} className="py-6">
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between text-left gap-4 focus-visible:outline-2 focus-visible:outline-accent"
                >
                  <span className="font-archivo text-lg sm:text-xl font-bold uppercase text-fg">
                    {faq.question}
                  </span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-bg-elevated text-accent">
                    {isOpen ? (
                      <Minus className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    )}
                    <span className="sr-only">
                      {isOpen ? "Collapse question" : "Expand question"}
                    </span>
                  </span>
                </button>
                {isOpen && (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="mt-4 text-sm sm:text-base text-fg-muted leading-relaxed"
                  >
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
