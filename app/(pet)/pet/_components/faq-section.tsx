"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Minus, ArrowRight } from "lucide-react";
import { PET_FAQS, type FaqItem } from "./faq-data";

export { PET_FAQS, type FaqItem };

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section
      className="w-full bg-bg text-fg py-14 sm:py-20 border-b border-border"
      aria-labelledby="faq-heading"
    >
      <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2
              id="faq-heading"
              className="text-2xl sm:text-3xl font-normal font-sans tracking-tight text-fg"
            >
              Pet parent FAQ
            </h2>
          </div>
          <div>
            <Link
              href="/faq"
              className="min-h-11 px-6 py-2.5 inline-flex items-center gap-2 justify-center rounded border border-border text-fg hover:border-accent hover:text-accent font-medium active:scale-[0.98] transition-colors"
            >
              <span>All FAQs</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="divide-y divide-border border-y border-border">
          {PET_FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                  id={`faq-question-${idx}`}
                  className="w-full min-h-11 py-2 flex items-center justify-between text-left gap-4 font-medium text-base sm:text-lg text-fg hover:text-accent transition-colors"
                >
                  <span>{faq.question}</span>
                  <span className="shrink-0 text-accent">
                    {isOpen ? (
                      <Minus className="w-5 h-5" aria-hidden="true" />
                    ) : (
                      <Plus className="w-5 h-5" aria-hidden="true" />
                    )}
                  </span>
                </button>
                {isOpen && (
                  <div
                    id={`faq-answer-${idx}`}
                    role="region"
                    aria-labelledby={`faq-question-${idx}`}
                    className="pt-2 pb-4 text-sm sm:text-base text-fg-muted leading-relaxed"
                  >
                    {faq.answer}
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
