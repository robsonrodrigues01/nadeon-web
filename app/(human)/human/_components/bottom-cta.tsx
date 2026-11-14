import React from "react";
import Link from "next/link";

export function BottomCta() {
  const formulas = [
    { name: "BioHack", sub: "NMN 500 mg", href: "/human/products/biohack" },
    {
      name: "Full Charge",
      sub: "NMN 4-in-1",
      href: "/human/products/full-charge",
    },
    {
      name: "Renew",
      sub: "NAD+ + Resveratrol",
      href: "/human/products/renew",
    },
    { name: "Glow", sub: "Collagen + NMN", href: "/human/products/glow" },
  ];

  return (
    <section
      aria-labelledby="bottom-cta-title"
      className="w-full border-b border-border bg-bg text-fg py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12 text-center">
        <span className="inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent-fg">
          10% OFF YOUR FIRST ORDER
        </span>
        <h2
          id="bottom-cta-title"
          className="mt-6 font-archivo text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-fg"
        >
          Start your routine today.
        </h2>
        <p className="mt-4 text-xs sm:text-sm font-semibold uppercase tracking-wider text-fg-muted">
          Free shipping over $75 · 60-day guarantee · Cancel anytime
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {formulas.map((f) => (
            <Link
              key={f.name}
              href={f.href}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-elevated px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-fg transition-colors hover:border-accent hover:text-accent"
            >
              <span>{f.name}</span>
              <span className="text-fg-muted">·</span>
              <span className="text-fg-muted">{f.sub}</span>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/human/shop"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-accent px-8 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-accent-fg shadow-card transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-accent"
          >
            Shop all formulas
          </Link>
          <Link
            href="/human/quiz"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border-2 border-border px-7 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-fg transition-colors hover:border-fg focus-visible:outline-2 focus-visible:outline-accent"
          >
            Take the 60-second quiz
          </Link>
        </div>
      </div>
    </section>
  );
}
