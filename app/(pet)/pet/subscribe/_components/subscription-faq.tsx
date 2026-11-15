"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  type SubscriptionFaqItem,
  buildSubscriptionFaqs,
} from "./subscription-faq-data";

export { type SubscriptionFaqItem, buildSubscriptionFaqs };

interface SubscriptionFaqProps {
  faqs?: SubscriptionFaqItem[];
  discountPercentage?: number | null;
}

export function SubscriptionFaq({
  faqs,
  discountPercentage = null,
}: SubscriptionFaqProps = {}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First question open by default as in design
  const items = faqs ?? buildSubscriptionFaqs(discountPercentage);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      aria-labelledby="faq-heading"
      className="border-b border-border bg-bg py-16 sm:py-24"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-5 sm:px-8 lg:flex-row lg:gap-16 lg:px-12">
        {/* Left Column: Heading and Action */}
        <div className="lg:w-80 lg:flex-shrink-0">
          <span className="text-xs font-bold uppercase tracking-widest text-accent">
            FAQ
          </span>
          <h2
            id="faq-heading"
            className="mt-3 font-sans text-3xl font-extrabold uppercase tracking-tight text-fg sm:text-4xl lg:text-5xl"
          >
            Subscription FAQ
          </h2>
          <div className="mt-6">
            <Link
              href="/faq"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border-2 border-fg px-6 py-2.5 text-sm font-bold text-fg transition hover:bg-fg hover:text-bg active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg"
            >
              All FAQs
            </Link>
          </div>
        </div>

        {/* Right Column: Accordion */}
        <div className="flex-1 divide-y divide-border">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            const answerId = `faq-answer-${index}`;
            const questionId = `faq-question-${index}`;

            return (
              <div key={item.question} className="py-4 sm:py-5">
                <button
                  type="button"
                  id={questionId}
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => toggle(index)}
                  className="flex min-h-[44px] w-full items-center justify-between gap-4 text-left font-sans text-base font-bold text-fg transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg sm:text-lg"
                >
                  <span>{item.question}</span>
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-border text-lg font-bold"
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <div
                    id={answerId}
                    role="region"
                    aria-labelledby={questionId}
                    className="mt-2 pb-2 pr-12 text-sm leading-relaxed text-fg-muted sm:text-base"
                  >
                    <p>{item.answer}</p>
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
