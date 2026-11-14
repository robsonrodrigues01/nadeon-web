import React from "react";
import Link from "next/link";

export function IngredientsSection() {
  const ingredients = [
    {
      name: "NMN",
      description: "The direct building block of NAD⁺.",
      dosing: "BioHack 500 mg · Full Charge 500 mg · Glow 250 mg",
    },
    {
      name: "NAD⁺",
      description: "The coenzyme your cells use to make energy.",
      dosing: "Renew 500 mg · Prime 250 mg",
    },
    {
      name: "Trans-resveratrol",
      description: "A plant polyphenol often paired with NMN and NAD⁺.",
      dosing: "Full Charge 100 mg · Renew 250 mg",
    },
    {
      name: "Ubiquinol",
      description: "The active form of CoQ10, in MCT oil.",
      dosing: "Powerhouse 100 mg",
    },
    {
      name: "Collagen peptides",
      description: "Protein for skin, hair and nails.",
      dosing: "Glow 5 g",
    },
    {
      name: "Vitamin D3 + K2",
      description: "Two fat-soluble vitamins that work together.",
      dosing: "Daylight 2,000 IU + 100 mcg",
    },
  ];

  return (
    <section
      aria-labelledby="ingredients-title"
      className="w-full border-b border-border bg-bg text-fg py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block rounded-full bg-bg-elevated px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent border border-border">
            INGREDIENTS
          </span>
          <h2
            id="ingredients-title"
            className="mt-4 font-archivo text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-fg"
          >
            What goes in, and how much
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ingredients.map((item) => (
            <div
              key={item.name}
              className="flex flex-col justify-between rounded-card border border-border bg-bg-elevated p-8 shadow-card"
            >
              <div>
                <h3 className="font-archivo text-2xl font-black uppercase text-fg">
                  {item.name}
                </h3>
                <p className="mt-3 text-sm sm:text-base text-fg-muted leading-relaxed">
                  {item.description}
                </p>
              </div>
              <div className="mt-6 border-t border-border pt-4">
                <span className="font-mono text-xs font-semibold text-accent block">
                  {item.dosing}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link
            href="/human/shop"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-accent px-8 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-accent-fg shadow-card transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-accent"
          >
            Shop by ingredient
          </Link>
          <Link
            href="/science"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border-2 border-border px-7 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-fg transition-colors hover:border-fg focus-visible:outline-2 focus-visible:outline-accent"
          >
            Read the science
          </Link>
        </div>
      </div>
    </section>
  );
}
