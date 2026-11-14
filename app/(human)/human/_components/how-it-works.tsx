import React from "react";
import Link from "next/link";
import { Claim } from "@/components/commerce/product-card/claim";

export function HowItWorks() {
  const steps = [
    {
      step: "1",
      title: "NMN",
      description: "You take NMN, the direct building block of NAD⁺.",
    },
    {
      step: "2",
      title: "NAD⁺",
      description:
        "Your cells turn it into NAD⁺, which naturally declines with age.",
    },
    {
      step: "3",
      title: "Cell energy",
      description: "NAD⁺ supports how your cells make energy every day.*",
      isClaim: true,
    },
  ];

  return (
    <section
      aria-labelledby="how-it-works-title"
      className="w-full border-b border-border bg-bg text-fg py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block rounded-full bg-bg-elevated px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent border border-border">
            HOW IT WORKS
          </span>
          <h2
            id="how-it-works-title"
            className="mt-4 font-archivo text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-fg"
          >
            From NMN to cell energy
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.step}
              className="flex flex-col justify-between rounded-card border border-border bg-bg-elevated p-8 shadow-card text-center sm:text-left"
            >
              <div>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-fg font-black text-base mx-auto sm:mx-0">
                  {s.step}
                </span>
                <h3 className="mt-6 font-archivo text-2xl font-black uppercase text-fg">
                  {s.title}
                </h3>
                <div className="mt-3 text-sm sm:text-base text-fg-muted leading-relaxed">
                  {s.isClaim ? (
                    <Claim>{s.description}</Claim>
                  ) : (
                    <p>{s.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/science"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border-2 border-border px-8 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-fg transition-colors hover:border-fg focus-visible:outline-2 focus-visible:outline-accent"
          >
            Read the science
          </Link>
        </div>
      </div>
    </section>
  );
}
