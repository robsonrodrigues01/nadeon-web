import React from "react";

export interface HowItWorksProps {
  discountPercentage?: number | null;
  intervals?: number[];
}

export function HowItWorks({
  discountPercentage = null,
  intervals = [],
}: HowItWorksProps = {}) {
  const rhythmDescription =
    intervals.length > 0
      ? `Every ${intervals.join(", ")} days.`
      : "On your own schedule.";

  const saveTitle = discountPercentage
    ? `Save ${discountPercentage}%`
    : "Save on every box";

  const steps = [
    {
      number: "1",
      title: "Choose",
      description: "Pick one formula or build a stack of several.",
    },
    {
      number: "2",
      title: "Set the rhythm",
      description: rhythmDescription,
    },
    {
      number: "3",
      title: saveTitle,
      description: "On every box, with free shipping on every delivery.",
    },
  ];

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-title"
      className="w-full border-b border-border bg-bg text-fg py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 text-center">
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-accent">
          HOW IT WORKS
        </span>
        <h2
          id="how-it-works-title"
          className="mt-3 font-archivo text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-fg"
        >
          Three steps, then relax
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex flex-col items-center rounded-card border border-border bg-bg-elevated p-8 sm:p-10 shadow-card text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-fg font-archivo text-2xl font-black">
                {step.number}
              </div>
              <h3 className="mt-6 font-archivo text-2xl font-black uppercase text-fg">
                {step.title}
              </h3>
              <p className="mt-3 text-sm sm:text-base text-fg-muted leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
