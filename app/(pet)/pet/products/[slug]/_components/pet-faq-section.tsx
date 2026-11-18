import React from "react";
import Link from "next/link";
import type { Product } from "@/lib/contracts/catalog";
import { Claim } from "@/components/commerce/product-card/claim";

export interface PetFaqSectionProps {
  product: Product;
  className?: string;
}

// Visible FAQ = product.faq, the same list the page sends as FAQPage JSON-LD.
export function PetFaqSection({ product, className = "" }: PetFaqSectionProps) {
  if (product.faq.length === 0) return null;

  return (
    <section
      id="faq"
      aria-labelledby="faq-section-heading"
      className={`py-12 sm:py-16 lg:py-20 border-t border-border ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-accent block mb-2">
              FAQ
            </span>
            <h2
              id="faq-section-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-fg"
            >
              {product.name} FAQ
            </h2>
          </div>

          <Link
            href="/help"
            className="text-xs font-bold uppercase tracking-wider text-fg underline underline-offset-4 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm py-1 min-h-11 inline-flex items-center"
          >
            All FAQs
          </Link>
        </div>

        <div className="divide-y divide-border/60 rounded-card border border-border bg-bg-elevated p-2 sm:p-4 shadow-card">
          {product.faq.map((faq) => (
            <details
              key={faq.question}
              className="group py-4 px-2 sm:px-4 cursor-pointer focus-within:outline-none"
            >
              <summary className="flex min-h-11 items-center justify-between gap-4 text-sm sm:text-base font-extrabold text-fg list-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-field py-1">
                <span>{faq.question}</span>
                <span
                  aria-hidden="true"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-xs font-bold text-fg/70 transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <div className="mt-3 text-xs sm:text-sm text-fg-muted font-medium leading-relaxed pr-8">
                <Claim showDisclaimer={false}>{faq.answer}</Claim>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
