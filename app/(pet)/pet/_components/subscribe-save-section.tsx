import React from "react";
import Link from "next/link";

export function SubscribeSaveSection() {
  const steps = [
    {
      num: "1",
      title: "Choose",
      description: "Pick chews, treats or oils.",
    },
    {
      num: "2",
      title: "Save 15%",
      description: "Delivered every 30, 60 or 90 days.",
    },
    {
      num: "3",
      title: "Stay flexible",
      description: "Skip, pause or cancel anytime.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="w-full bg-bg text-fg py-14 sm:py-20 border-b border-border"
      aria-labelledby="subscribe-save-heading"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="mb-10 text-left">
          <span className="text-xs uppercase tracking-widest font-mono text-fg-muted">
            SUBSCRIBE & SAVE
          </span>
          <h2
            id="subscribe-save-heading"
            className="mt-2 text-2xl sm:text-3xl font-normal font-sans tracking-tight text-fg"
          >
            Never run out
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="p-6 sm:p-8 rounded border border-border bg-bg-elevated shadow-card"
            >
              <span className="text-xs font-mono text-accent">0{step.num}</span>
              <h3 className="text-xl font-medium mt-2 text-fg">{step.title}</h3>
              <p className="mt-3 text-sm text-fg-muted leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/pet/subscribe"
            className="min-h-11 px-8 py-3.5 inline-flex items-center justify-center rounded bg-gradient-gold text-accent-fg font-medium shadow-card hover:brightness-105 active:scale-[0.98] transition-transform"
          >
            Build a subscription
          </Link>
        </div>
      </div>
    </section>
  );
}
