import React from "react";
import Link from "next/link";
import Image from "next/image";

export function AgeBands() {
  const bands = [
    {
      range: "25 to 34",
      tagline: "Build the habit early",
      product: "BioHack",
      formula: "NMN 500 mg",
      image: "/images/products/biohack-front.webp",
      href: "/human/products/biohack",
    },
    {
      range: "35 to 49",
      tagline: "Go beyond NMN alone",
      product: "Full Charge",
      formula: "NMN 4-in-1",
      image: "/images/products/full-charge-front.webp",
      href: "/human/products/full-charge",
    },
    {
      range: "50+",
      tagline: "Add direct NAD⁺",
      product: "Renew",
      formula: "NAD+ + Resveratrol",
      image: "/images/products/renew-front.webp",
      href: "/human/products/renew",
    },
  ];

  return (
    <section
      aria-labelledby="age-bands-title"
      className="w-full border-b border-border bg-bg text-fg py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block rounded-full bg-bg-elevated px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent border border-border">
            FOR EVERY STAGE
          </span>
          <h2
            id="age-bands-title"
            className="mt-4 font-archivo text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-fg"
          >
            Your age, your formula
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {bands.map((band) => (
            <div
              key={band.range}
              className="flex flex-col justify-between rounded-card border border-border bg-bg-elevated p-8 shadow-card"
            >
              <div>
                <span className="font-archivo text-3xl sm:text-4xl font-black text-accent">
                  {band.range}
                </span>
                <p className="mt-2 text-base font-semibold text-fg">
                  {band.tagline}
                </p>
                <div className="mt-6 flex items-center justify-center py-4">
                  <div className="relative h-32 w-32">
                    <Image
                      src={band.image}
                      alt={`${band.product} - ${band.formula}`}
                      width={128}
                      height={128}
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-border pt-4 text-center">
                <span className="text-xs uppercase font-medium text-fg-muted block">
                  Our pick:
                </span>
                <Link
                  href={band.href}
                  className="mt-1 inline-block font-archivo text-lg font-bold text-fg hover:text-accent transition-colors"
                >
                  {band.product} · {band.formula}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link
            href="/human/quiz"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-accent px-8 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-accent-fg shadow-card transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-accent"
          >
            Find my formula
          </Link>
          <Link
            href="/human/shop"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border-2 border-border px-7 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-fg transition-colors hover:border-fg focus-visible:outline-2 focus-visible:outline-accent"
          >
            Compare all formulas
          </Link>
        </div>
      </div>
    </section>
  );
}
