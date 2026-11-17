"use client";

import React, { useState } from "react";
import Link from "next/link";

const HOW_IT_WORKS_STEPS = [
  {
    step: "1",
    title: "Pick and personalize",
    description:
      "Choose an amount and a design, then add their name and a note.",
  },
  {
    step: "2",
    title: "We email it",
    description: "The card arrives on the date you choose, with a unique code.",
  },
  {
    step: "3",
    title: "They shop",
    description: "They use the code at checkout on any To be confirmed.",
  },
];

const FAQ_ITEMS = [
  {
    question: "How do they redeem the gift card?",
    answer:
      "They enter the code at checkout. Any remaining balance stays on the card for next time.",
  },
  {
    question: "Can I use a gift card on a subscription?",
    answer: "To be confirmed",
  },
  {
    question: "Does a gift card expire?",
    answer: "To be confirmed",
  },
  {
    question: "Can I change the delivery date or email?",
    answer: "To be confirmed",
  },
  {
    question: "How do I check my balance?",
    answer: "To be confirmed",
  },
];

export function GiftCardHowItWorks() {
  return (
    <section
      aria-labelledby="how-it-works-heading"
      className="py-16 sm:py-20 border-t border-border/40"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-xs font-bold tracking-widest uppercase text-accent mb-2">
          HOW IT WORKS
        </div>
        <h2
          id="how-it-works-heading"
          className="font-archivo font-extrabold text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-fg mb-10"
        >
          Three simple steps
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {HOW_IT_WORKS_STEPS.map((item) => (
            <div
              key={item.step}
              className="rounded-2xl bg-bg-elevated/40 border border-border/80 p-6 sm:p-8 flex flex-col items-start gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-fg text-bg flex items-center justify-center font-archivo font-extrabold text-xl">
                {item.step}
              </div>
              <h3 className="font-archivo font-extrabold text-xl sm:text-2xl uppercase text-fg mt-2">
                {item.title}
              </h3>
              <p className="text-sm sm:text-base text-fg-muted leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function GiftCardFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      aria-labelledby="gift-faq-heading"
      className="py-16 sm:py-20 border-t border-border/40"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
        {/* Left Column: Heading & CTA */}
        <div className="lg:w-1/3 flex flex-col items-start">
          <div className="text-xs font-bold tracking-widest uppercase text-accent mb-2">
            FAQ
          </div>
          <h2
            id="gift-faq-heading"
            className="font-archivo font-extrabold text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-fg mb-6"
          >
            Gift card questions
          </h2>
          <Link
            href="/faq"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-border px-5 py-2 text-sm font-bold text-fg hover:border-fg transition-colors"
          >
            All FAQs
          </Link>
        </div>

        {/* Right Column: Accordion */}
        <div className="lg:w-2/3 w-full flex flex-col divide-y divide-border/60">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={item.question} className="py-4">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full flex justify-between items-center text-left py-2 font-bold text-base sm:text-lg text-fg hover:text-accent transition-colors cursor-pointer gap-4"
                >
                  <span>{item.question}</span>
                  <span className="text-xl font-mono shrink-0">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <div className="pt-2 pb-3 text-sm sm:text-base text-fg-muted leading-relaxed">
                    {item.answer}
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
