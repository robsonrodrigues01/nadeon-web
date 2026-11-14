import React from "react";
import Link from "next/link";

export function BottomCta() {
  return (
    <section
      aria-label="Save on every box"
      className="w-full bg-bg-elevated text-fg py-16 sm:py-24 text-center border-b border-border"
    >
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <span className="inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent-fg">
          SAVE 15% ON EVERY BOX
        </span>

        <h2 className="mt-6 font-archivo text-4xl sm:text-6xl font-black uppercase tracking-tight text-fg leading-none">
          Set it once.
          <br />
          Save every time.
        </h2>

        <p className="mt-6 text-base sm:text-xl text-fg-muted">
          Free shipping on every box · Skip, pause or cancel anytime
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/human/build-your-box"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-accent px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-accent-fg shadow-card transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-accent"
          >
            Build your box
          </Link>
          <Link
            href="/human/quiz"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border-2 border-border px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-fg transition-colors hover:border-fg focus-visible:outline-2 focus-visible:outline-accent"
          >
            Take the quiz
          </Link>
        </div>
      </div>
    </section>
  );
}
