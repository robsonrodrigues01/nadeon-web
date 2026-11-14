import React from "react";
import { SubscriptionSimulation } from "./subscription-simulation";

export function FlexibilitySection() {
  const perks = [
    {
      icon: "»",
      title: "Skip",
      description: "Have extra? Skip the next box with one tap.",
    },
    {
      icon: "❚❚",
      title: "Pause",
      description: "Traveling? Pause for up to 3 months.",
    },
    {
      icon: "✕",
      title: "Cancel",
      description: "No calls, no forms. Cancel anytime from your account.",
    },
  ];

  return (
    <section
      aria-labelledby="flexibility-title"
      className="w-full border-b border-border bg-bg-elevated text-fg py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 text-center">
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-accent">
          FULL FLEXIBILITY
        </span>
        <h2
          id="flexibility-title"
          className="mt-3 font-archivo text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-fg"
        >
          Always in control
        </h2>

        {/* 3 Value Props */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3 max-w-5xl mx-auto">
          {perks.map((perk) => (
            <div
              key={perk.title}
              className="flex flex-col items-center rounded-card border border-border bg-bg p-8 shadow-card text-center"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 text-accent font-bold text-lg">
                {perk.icon}
              </span>
              <h3 className="mt-4 font-archivo text-xl font-bold uppercase text-fg">
                {perk.title}
              </h3>
              <p className="mt-2 text-sm text-fg-muted leading-relaxed">
                {perk.description}
              </p>
            </div>
          ))}
        </div>

        {/* Interactive Simulation */}
        <div className="mt-14">
          <SubscriptionSimulation />
        </div>
      </div>
    </section>
  );
}
