import React from "react";
import Link from "next/link";

export function SubscribeSection() {
  const steps = [
    {
      number: "1",
      title: "Choose",
      description: "Pick any formula or bundle.",
    },
    {
      number: "2",
      title: "Save 15%",
      description: "Delivered every 30, 60 or 90 days.",
    },
    {
      number: "3",
      title: "Stay flexible",
      description: "Skip, pause or cancel anytime.",
    },
  ];

  return (
    <section
      aria-labelledby="subscribe-section-title"
      className="w-full border-b border-border bg-bg text-fg py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block rounded-full bg-bg-elevated px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent border border-border">
            SUBSCRIBE
          </span>
          <h2
            id="subscribe-section-title"
            className="mt-4 font-archivo text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-fg"
          >
            Subscribe &amp; save
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.number}
              className="flex flex-col justify-between rounded-card border border-border bg-bg-elevated p-8 shadow-card text-center sm:text-left"
            >
              <div>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-fg font-black text-base mx-auto sm:mx-0">
                  {s.number}
                </span>
                <h3 className="mt-6 font-archivo text-2xl font-black uppercase text-fg">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm sm:text-base text-fg-muted leading-relaxed">
                  {s.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/human/subscribe"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-accent px-8 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-accent-fg shadow-card transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-accent"
          >
            Start a subscription
          </Link>
        </div>
      </div>
    </section>
  );
}
