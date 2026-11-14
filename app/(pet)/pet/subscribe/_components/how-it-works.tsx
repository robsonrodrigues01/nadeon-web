import React from "react";

interface HowItWorksProps {
  freeShippingText?: string | null;
}

export function HowItWorks({ freeShippingText }: HowItWorksProps) {
  const steps = [
    {
      step: 1,
      title: "Choose",
      description: "Pick chews, treats or oils for each pet.",
    },
    {
      step: 2,
      title: "Set the rhythm",
      description: "Every 30, 60 or 90 days. Change it anytime.",
    },
    {
      step: 3,
      title: "Save 15%",
      description: `On every delivery, plus ${freeShippingText ? freeShippingText.toLowerCase() : "free shipping over $49"}.`,
    },
  ];

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="border-b border-border bg-bg py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 text-center sm:px-8 lg:px-12">
        <span className="text-xs font-bold uppercase tracking-widest text-accent">
          HOW IT WORKS
        </span>
        <h2
          id="how-it-works-heading"
          className="mt-3 font-sans text-3xl font-extrabold uppercase tracking-tight text-fg sm:text-4xl lg:text-5xl"
        >
          Three steps, then relax
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {steps.map((item) => (
            <div
              key={item.step}
              className="flex flex-col items-center rounded-2xl border border-border bg-bg-elevated p-8 text-center shadow-card transition hover:border-border/80"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-fg font-sans text-2xl font-extrabold text-bg sm:h-20 sm:w-20 sm:text-3xl">
                {item.step}
              </div>
              <h3 className="mt-5 font-sans text-xl font-extrabold uppercase tracking-tight text-fg sm:text-2xl">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-fg/80 sm:text-base">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
