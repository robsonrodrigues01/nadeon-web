"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Minus } from "lucide-react";

import { getSubscribeFaqs, type FaqItem } from "./subscribe-faq-data";

export interface SubscribeFaqProps {
  faqs?: FaqItem[];
  discountPercentage?: number | null;
}

export function SubscribeFaq({
  faqs,
  discountPercentage = null,
}: SubscribeFaqProps = {}) {
  const items = faqs ?? getSubscribeFaqs(discountPercentage);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      aria-labelledby="faq-title"
      className="w-full border-b border-border bg-bg text-fg py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-accent">
              FAQ
            </span>
            <h2
              id="faq-title"
              className="mt-3 font-archivo text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-fg"
            >
              Subscription FAQ
            </h2>
            <div className="mt-8">
              <Link
                href="/faq"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border-2 border-border px-7 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-fg transition-colors hover:border-fg focus-visible:outline-2 focus-visible:outline-accent"
              >
                All FAQs
              </Link>
            </div>
          </div>

          <div className="lg:col-span-8 divide-y divide-border border-y border-border">
            {items.map((faq, index) => {
              const isOpen = openIndex === index;
              const panelId = `subscribe-faq-panel-${index}`;
              const buttonId = `subscribe-faq-btn-${index}`;

              return (
                <div key={faq.question} className="py-6">
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(index)}
                    className="flex w-full items-center justify-between text-left gap-4 min-h-[44px] focus-visible:outline-2 focus-visible:outline-accent"
                  >
                    <span className="font-archivo text-lg sm:text-xl font-bold uppercase text-fg">
                      {faq.question}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors ${
                        isOpen
                          ? "bg-accent border-accent text-accent-fg"
                          : "border-border text-fg-muted"
                      }`}
                    >
                      {isOpen ? (
                        <Minus className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </span>
                  </button>

                  {isOpen && (
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className="mt-4 pr-12 text-sm sm:text-base text-fg-muted leading-relaxed"
                    >
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
