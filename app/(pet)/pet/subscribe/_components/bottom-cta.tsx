import React from "react";
import Link from "next/link";

interface BottomCtaProps {
  freeShippingText?: string | null;
}

export function BottomCta({ freeShippingText }: BottomCtaProps) {
  return (
    <section
      aria-labelledby="bottom-cta-heading"
      className="relative overflow-hidden border-b border-border py-20 sm:py-28 text-center"
      style={{
        background:
          "linear-gradient(135deg, rgba(255, 237, 176, 0.95) 0%, rgba(255, 220, 192, 0.9) 45%, rgba(221, 238, 251, 0.9) 100%)",
      }}
    >
      {/* Decorative paw print SVG */}
      <div
        className="pointer-events-none absolute -bottom-10 -left-10 text-fg opacity-[0.06]"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 100 100"
          className="h-64 w-64 sm:h-80 sm:w-80 fill-current"
        >
          <ellipse
            cx="22"
            cy="42"
            rx="9"
            ry="12"
            transform="rotate(-25 22 42)"
          />
          <ellipse
            cx="39"
            cy="24"
            rx="9.5"
            ry="13"
            transform="rotate(-8 39 24)"
          />
          <ellipse
            cx="61"
            cy="24"
            rx="9.5"
            ry="13"
            transform="rotate(8 61 24)"
          />
          <ellipse
            cx="78"
            cy="42"
            rx="9"
            ry="12"
            transform="rotate(25 78 42)"
          />
          <path d="M50 48 C 38 48 28 60 24 70 C 20 80 26 90 36 89 C 42 88 46 85 50 85 C 54 85 58 88 64 89 C 74 90 80 80 76 70 C 72 60 62 48 50 48 Z" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-5 sm:px-8">
        <span className="inline-block rounded-full bg-fg px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-bg">
          SAVE 15% ON EVERY ORDER
        </span>
        <h2
          id="bottom-cta-heading"
          className="mt-5 font-sans text-3xl font-extrabold uppercase leading-[0.95] tracking-tight text-fg sm:text-5xl lg:text-6xl"
        >
          Set it once. Save every time.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base text-fg sm:text-lg">
          {freeShippingText
            ? `${freeShippingText} · `
            : "Free shipping over $49 · "}
          Skip, pause or cancel anytime
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/pet/build-your-box"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-fg px-8 py-3.5 text-sm font-bold text-bg transition hover:opacity-90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg sm:text-base"
          >
            Build a subscription
          </Link>
          <Link
            href="/pet/quiz"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border-2 border-fg px-6 py-3 text-sm font-bold text-fg transition hover:bg-fg/10 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg sm:text-base"
          >
            Find the right formula
          </Link>
        </div>
      </div>
    </section>
  );
}
