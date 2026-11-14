"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Claim } from "@/components/commerce/product-card/claim";

export interface FaqItem {
  question: string;
  answer: string;
  hasAsterisk?: boolean;
}

export interface FaqSectionProps {
  productName?: string;
  items?: FaqItem[];
}

const DEFAULT_FAQ_ITEMS: FaqItem[] = [
  {
    question: "How is NMN different from NAD+?",
    answer:
      "NMN is a building block your cells use to make NAD+. BioHack gives you NMN; Renew gives you NAD+ directly. Many people pair them. Talk to your doctor before starting any supplement.*",
    hasAsterisk: true,
  },
  {
    question: "Can I take BioHack with Renew?",
    answer:
      "Yes. BioHack provides NMN in the morning and Renew provides direct NAD+ with lunch for comprehensive routine support.",
    hasAsterisk: false,
  },
  {
    question: "What time of day should I take it?",
    answer:
      "Take 2 capsules each morning with a glass of water for optimal cellular circadian alignment.",
    hasAsterisk: false,
  },
  {
    question: "How long until I notice a difference?",
    answer:
      "Most customers report subtle improvements in daily vitality and morning alertness within 2 to 4 weeks of consistent daily use.",
    hasAsterisk: false,
  },
  {
    question: "Can I take it with my medication?",
    answer:
      "Always consult your physician or healthcare provider before combining NMN with any prescription medications.",
    hasAsterisk: false,
  },
  {
    question: "Is it safe to take long term?",
    answer:
      "NMN has been extensively researched in clinical settings and is designed for sustained, daily long-term cellular maintenance.",
    hasAsterisk: false,
  },
  {
    question: "Can I take it if I'm pregnant or nursing?",
    answer:
      "Not recommended for pregnant or nursing individuals without explicit medical supervision.",
    hasAsterisk: false,
  },
  {
    question: "Is BioHack vegan and gluten free?",
    answer:
      "Yes. BioHack uses 100% plant-based hypromellose capsules, contains no animal byproducts, and is gluten free.",
    hasAsterisk: false,
  },
  {
    question: "How pure is your NMN and how do you test it?",
    answer: "Lab results are published per lot. First lots publishing soon.",
    hasAsterisk: false,
  },
  {
    question: "Why 500 mg per serving?",
    answer:
      "500 mg daily represents the scientifically verified dosage commonly studied in human longevity clinical trials.",
    hasAsterisk: false,
  },
  {
    question: "Can I open the capsule and mix it?",
    answer:
      "Yes, you can open the capsule and dissolve the powder into cold water, yogurt, or a smoothie if preferred.",
    hasAsterisk: false,
  },
  {
    question: "Does NMN interact with caffeine or alcohol?",
    answer:
      "There are no known direct interactions, though taking it with morning hydration away from alcohol is recommended.",
    hasAsterisk: false,
  },
  {
    question: "Where is it made?",
    answer:
      "Manufactured in our own state-of-the-art cGMP facility located in Clifton, New Jersey.",
    hasAsterisk: false,
  },
  {
    question: "How does Subscribe & Save work?",
    answer:
      "You save on every delivery. You can skip, modify delivery intervals, or cancel anytime in your account.",
    hasAsterisk: false,
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 60-day money-back guarantee. If you're not fully satisfied, contact us for a hassle-free refund.",
    hasAsterisk: false,
  },
];

export function FaqSection({
  productName = "BioHack",
  items = DEFAULT_FAQ_ITEMS,
}: FaqSectionProps) {
  // First item open by default like the design board
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({
    0: true,
  });

  const toggleItem = (index: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <section
      aria-label="Frequently asked questions"
      className="w-full bg-bg-elevated py-16 px-4 sm:px-8 lg:px-18 border-b border-border text-fg"
    >
      <div className="mx-auto max-w-7xl flex flex-col lg:flex-row gap-12 lg:gap-20">
        {/* Left Column: Heading and All FAQs button */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="text-xs font-bold tracking-widest uppercase text-product-amber">
            FAQ
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-archivo uppercase text-fg mt-2">
            {productName} questions
          </h2>
          <div className="mt-6">
            <Link
              href="/faq"
              className="inline-flex min-h-11 items-center justify-center rounded-pill border-2 border-fg px-6 py-2 text-sm font-bold text-fg transition-colors hover:bg-fg hover:text-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent whitespace-nowrap"
            >
              All FAQs
            </Link>
          </div>
        </div>

        {/* Right Column: Accordion Questions */}
        <div className="flex-1 divide-y divide-border/40 border-t border-b border-border/40">
          {items.map((item, idx) => {
            const isOpen = Boolean(openItems[idx]);
            const buttonId = `faq-trigger-${idx}`;
            const panelId = `faq-panel-${idx}`;

            return (
              <div key={item.question} className="py-4">
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleItem(idx)}
                  className="w-full min-h-11 flex items-center justify-between gap-4 text-left font-bold text-base sm:text-lg text-fg hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm py-2"
                >
                  <span>{item.question}</span>
                  <span
                    className="text-2xl font-normal text-fg-muted shrink-0 w-6 text-center select-none"
                    aria-hidden="true"
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="pt-2 pb-4 text-sm sm:text-base text-fg-muted leading-relaxed"
                  >
                    {item.hasAsterisk ? (
                      <Claim showDisclaimer>{item.answer}</Claim>
                    ) : (
                      <span>{item.answer}</span>
                    )}
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
