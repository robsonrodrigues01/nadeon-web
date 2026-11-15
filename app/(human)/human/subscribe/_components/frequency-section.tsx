import React from "react";
import type { SellingPlan } from "@/lib/contracts/catalog";

export interface FrequencySectionProps {
  plans?: SellingPlan[];
}

function getFrequencyTitle(intervalDays: number): string {
  switch (intervalDays) {
    case 30:
      return "Monthly";
    case 60:
      return "Most flexible";
    case 90:
      return "Stock up";
    case 120:
      return "Fewer boxes";
    case 180:
      return "Twice a year";
    default:
      return `Every ${intervalDays} days`;
  }
}

export function FrequencySection({ plans = [] }: FrequencySectionProps = {}) {
  const items = plans ?? [];
  const hasPlans = items.length > 0;

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

        {hasPlans ? (
          <>
            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {items.map((item, idx) => {
                const isPopular = idx === 0 || item.intervalDays === 30;

                return (
                  <div
                    key={item.intervalDays}
                    className={`relative flex flex-col justify-between rounded-card border p-6 text-center shadow-card transition-all ${
                      isPopular
                        ? "border-accent bg-bg-elevated ring-1 ring-accent"
                        : "border-border bg-bg-elevated hover:border-fg-muted"
                    }`}
                  >
                    {isPopular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-fg">
                        Popular
                      </span>
                    )}

                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-fg-muted">
                        EVERY
                      </span>
                      <div className="mt-2 font-archivo text-4xl sm:text-5xl font-black text-accent leading-none">
                        {item.intervalDays}
                      </div>
                      <span className="text-xs uppercase tracking-wider text-fg-muted">
                        days
                      </span>

                      <h3 className="mt-4 font-archivo text-lg font-bold uppercase text-fg">
                        {getFrequencyTitle(item.intervalDays)}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-fg-muted leading-relaxed">
                        {item.name}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="mt-10 text-sm text-fg-muted">
              Not sure? Start with {items[0]?.intervalDays} days. You can change
              it from your account anytime.
            </p>
          </>
        ) : (
          <div className="mt-12 rounded-card border border-border bg-bg-elevated p-8 max-w-xl mx-auto text-center">
            <p className="text-sm text-fg-muted">
              No delivery frequencies currently available.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
