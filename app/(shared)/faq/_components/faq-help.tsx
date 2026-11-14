import React from "react";
import { Button } from "@/components/ui/button";

// Coluna lateral do desktop (design: "Still stuck?").
export function StillStuck() {
  return (
    <section
      aria-labelledby="faq-still-stuck"
      className="rounded-card border border-border bg-bg-elevated p-7 shadow-sm"
    >
      <h2
        id="faq-still-stuck"
        className="font-archivo text-2xl font-extrabold uppercase text-fg"
      >
        Still stuck?
      </h2>
      <p className="mt-3 text-base leading-relaxed text-fg-muted">
        Our team answers within one business day.
      </p>
      <div className="mt-6 flex flex-col items-start gap-3">
        <Button href="/help#contact" variant="primary">
          Contact us
        </Button>
        <Button href="/track" variant="secondary">
          Track an order
        </Button>
      </div>
    </section>
  );
}

// Faixa de fechamento (desktop e mobile).
export function NotFoundBanner() {
  return (
    <section
      aria-labelledby="faq-not-found"
      className="border-t border-border bg-bg-elevated text-fg"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-14 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12 lg:py-20">
        <div>
          <h2
            id="faq-not-found"
            className="font-archivo text-3xl font-extrabold uppercase text-fg sm:text-4xl lg:text-5xl"
          >
            {"Didn't find your answer?"}
          </h2>
          <p className="mt-3 text-base text-fg-muted sm:text-lg">
            Write to us and a real person will reply within one business day.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="/help#contact" variant="primary">
            Contact us
          </Button>
          <Button href="/track" variant="secondary">
            Track my order
          </Button>
        </div>
      </div>
    </section>
  );
}
