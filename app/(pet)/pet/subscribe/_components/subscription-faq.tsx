"use client";

import React, { useState } from "react";
import Link from "next/link";

export interface SubscriptionFaqItem {
  question: string;
  answer: string;
}

export function buildSubscriptionFaqs(
  discountPercentage = 15
): SubscriptionFaqItem[] {
  return [
    {
      question: "When will I be charged?",
      answer:
        "When each order ships. You get an email reminder 3 days before, so you can skip or change it.",
    },
    {
      question: "Can I subscribe to more than one product?",
      answer:
        "Yes. You can subscribe to multiple products across dogs, cats and horses, and manage them all in one account.",
    },
    {
      question: `Does the ${discountPercentage}% stack with other offers?`,
      answer: `The ${discountPercentage}% discount applies automatically to every recurring delivery. Promotional coupon codes apply to initial one-time checkout.`,
    },
    {
      question: "What if my dog does not like the chews?",
      answer:
        "All our products are covered by our 60-day guarantee. If your dog is not thriving or dislikes the taste, we will issue a full refund.",
    },
    {
      question: "How do I change the delivery address?",
      answer:
        "You can update your shipping address, billing details or payment method anytime in your account dashboard before the next order ships.",
    },
  ];
}

interface SubscriptionFaqProps {
  discountPercentage?: number;
}

export function SubscriptionFaq({
  discountPercentage = 15,
}: SubscriptionFaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First question open by default as in design
  const faqs = buildSubscriptionFaqs(discountPercentage);

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
          {faqs.map((item, index) => {
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
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-base font-bold transition ${
                      isOpen ? "bg-fg text-bg" : "border border-border text-fg"
                    }`}
                    aria-hidden="true"
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div
                    id={answerId}
                    role="region"
                    aria-labelledby={questionId}
                    className="mt-3 pr-10 text-sm leading-relaxed text-fg/80 sm:text-base"
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
