import React from "react";

export function FrequencySection() {
  const frequencies = [
    {
      days: 30,
      title: "Monthly",
      subtitle: "A fresh jar every month",
      isPopular: true,
    },
    {
      days: 60,
      title: "Most flexible",
      subtitle: "2 jars per box, fewer deliveries",
      isPopular: false,
    },
    {
      days: 90,
      title: "Stock up",
      subtitle: "A 3-month supply per box",
      isPopular: false,
    },
    {
      days: 120,
      title: "Fewer boxes",
      subtitle: "3 deliveries a year",
      isPopular: false,
    },
    {
      days: 180,
      title: "Twice a year",
      subtitle: "Biggest boxes, least hassle",
      isPopular: false,
    },
  ];

  return (
    <section
      aria-labelledby="frequency-title"
      className="w-full border-b border-border bg-bg text-fg py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 text-center">
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-accent">
          FREQUENCY
        </span>
        <h2
          id="frequency-title"
          className="mt-3 font-archivo text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-fg"
        >
          Pick your rhythm
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {frequencies.map((item) => (
            <div
              key={item.days}
              className={`relative flex flex-col justify-between rounded-card border p-6 text-center shadow-card transition-all ${
                item.isPopular
                  ? "border-accent bg-bg-elevated ring-1 ring-accent"
                  : "border-border bg-bg-elevated hover:border-fg-muted"
              }`}
            >
              {item.isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-fg">
                  Popular
                </span>
              )}

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-fg-muted">
                  EVERY
                </span>
                <div className="mt-2 font-archivo text-4xl sm:text-5xl font-black text-accent leading-none">
                  {item.days}
                </div>
                <span className="text-xs uppercase tracking-wider text-fg-muted">
                  days
                </span>

                <h3 className="mt-4 font-archivo text-lg font-bold uppercase text-fg">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-fg-muted leading-relaxed">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 text-sm text-fg-muted">
          Not sure? Start with 30 days. You can change it from your account
          anytime.
        </p>
      </div>
    </section>
  );
}
