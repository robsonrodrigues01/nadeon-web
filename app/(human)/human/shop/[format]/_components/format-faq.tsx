import { Button } from "@/components/ui/button";
import type { ProductFaq } from "@/lib/contracts/catalog";

export interface FormatFaqProps {
  title: string;
  faqs: ProductFaq[];
}

export function FormatFaq({ title, faqs }: FormatFaqProps) {
  if (faqs.length === 0) return null;

  return (
    <section
      aria-labelledby="format-faq-heading"
      className="bg-bg-elevated px-4 py-12 text-fg sm:px-10 lg:px-[72px] lg:py-20"
    >
      <div className="flex flex-col gap-10 lg:flex-row lg:gap-20">
        <div className="lg:w-[380px] lg:shrink-0">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
            FAQ
          </p>
          <h2
            id="format-faq-heading"
            className="title mt-2 text-3xl font-extrabold uppercase leading-none tracking-tight sm:text-5xl"
          >
            {title}
          </h2>
          <div className="mt-6">
            <Button href="/human/faq" variant="secondary">
              All FAQs
            </Button>
          </div>
        </div>

        <div className="flex-1">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group border-b border-border py-5"
            >
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-base font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent [&::-webkit-details-marker]:hidden">
                <span>{faq.question}</span>
                <span aria-hidden="true" className="text-xl group-open:hidden">
                  +
                </span>
                <span
                  aria-hidden="true"
                  className="hidden text-xl group-open:inline"
                >
                  −
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
