import React from "react";
import Link from "next/link";

interface SavingsProps {
  /** Average savings percentage computed from catalog prices; null hides the figure. */
  savingsPercent: number | null;
}

export function KitsHero({ savingsPercent }: SavingsProps) {
  return (
    <section
      aria-labelledby="kits-hero-heading"
      className="relative w-full overflow-hidden border-b border-border bg-bg px-5 pb-16 pt-12 sm:px-8 sm:pb-20 sm:pt-16 lg:px-18"
    >
      <div className="mx-auto max-w-7xl">
        <nav
          aria-label="Breadcrumb"
          className="text-xs font-bold text-fg-muted"
        >
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="underline-offset-4 hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/pet" className="underline-offset-4 hover:underline">
                Pet
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">Kits &amp; bundles</li>
          </ol>
        </nav>

        <span className="mt-6 inline-block rounded-pill bg-accent px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-widest text-accent-fg">
          BUNDLE &amp; SAVE
        </span>

        <h1
          id="kits-hero-heading"
          className="font-archivo mt-6 text-5xl font-extrabold uppercase leading-[0.95] tracking-tight text-fg sm:text-7xl lg:text-8xl"
        >
          Kits &amp; bundles
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-relaxed text-fg sm:text-xl">
          Formulas that work well together
          {savingsPercent !== null
            ? `, priced about ${savingsPercent}% below buying them one by one`
            : ", priced below buying them one by one"}
          . Doses by weight on every label.
        </p>
      </div>
    </section>
  );
}

export function BuildOwnKit({ savingsPercent }: SavingsProps) {
  return (
    <section
      aria-labelledby="build-own-kit-heading"
      className="w-full bg-bg px-5 py-12 sm:px-8 lg:px-18"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-card border border-border bg-bg-elevated p-6 shadow-card sm:flex-row sm:items-center sm:p-10">
        <div className="flex max-w-2xl flex-col gap-3">
          <span className="inline-block w-fit rounded-pill bg-gradient-gold px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-fg">
            Build your own kit
          </span>
          <h2
            id="build-own-kit-heading"
            className="font-archivo text-3xl font-extrabold uppercase leading-none tracking-tight text-fg sm:text-4xl"
          >
            Make it just for them
          </h2>
          <p className="text-base leading-relaxed text-fg-muted">
            Tell us your pet&apos;s species, weight and age. Pick any formulas,
            dosed by weight
            {savingsPercent !== null
              ? `, and save ${savingsPercent}% on every box as a subscription`
              : ", and save on every box as a subscription"}
            .
          </p>
        </div>
        <Link
          href="/pet/build-your-box"
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-pill bg-fg px-6 py-3 text-base font-extrabold text-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Build your box
        </Link>
      </div>
    </section>
  );
}

export function HowKitsWork({ savingsPercent }: SavingsProps) {
  const items = [
    ...(savingsPercent !== null
      ? [
          {
            value: `${savingsPercent}%`,
            title: "Kit savings",
            text: `Kits cost about ${savingsPercent}% less than buying each formula on its own.`,
          },
        ]
      : []),
    {
      value: "60",
      title: "Day guarantee",
      text: "Not the right fit? Get your money back within 60 days.",
    },
  ];

  return (
    <section
      aria-labelledby="how-kits-work-heading"
      className="w-full bg-bg-elevated px-5 py-16 sm:px-8 lg:px-18"
    >
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-extrabold uppercase tracking-widest text-accent">
          GOOD TO KNOW
        </p>
        <h2
          id="how-kits-work-heading"
          className="font-archivo mt-3 text-4xl font-extrabold uppercase leading-none tracking-tight text-fg sm:text-5xl"
        >
          How kits work
        </h2>

        <ul className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {items.map((item) => (
            <li
              key={item.title}
              className="flex flex-col gap-3 rounded-card border border-border bg-bg p-6"
            >
              <span className="font-archivo text-5xl font-extrabold leading-none text-fg">
                {item.value}
              </span>
              <span className="text-lg font-extrabold text-fg">
                {item.title}
              </span>
              <p className="text-sm leading-relaxed text-fg-muted">
                {item.text}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-sm leading-relaxed text-fg-muted">
          Kit prices already include the savings. The quiz code works on single
          formulas bought one-time, and only one code applies per order.
        </p>
      </div>
    </section>
  );
}
