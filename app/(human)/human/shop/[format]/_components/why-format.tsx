import { Clock, Check, Pill } from "lucide-react";
import type { FormatReason } from "./format-reasons";

const ICONS = [Clock, Pill, Check];

export interface WhyFormatProps {
  label: string;
  reasons: readonly FormatReason[];
}

export function WhyFormat({ label, reasons }: WhyFormatProps) {
  if (reasons.length === 0) return null;

  return (
    <section
      aria-labelledby="why-format-heading"
      className="bg-bg-elevated px-4 py-10 text-fg sm:px-10 lg:px-[72px] lg:py-16"
    >
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
        {`Why ${label.toLowerCase()}`}
      </p>
      <h2
        id="why-format-heading"
        className="title mt-2 text-3xl font-extrabold uppercase leading-none tracking-tight sm:text-5xl"
      >
        Why this format
      </h2>

      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {reasons.map((reason, index) => {
          const Icon = ICONS[index % ICONS.length];
          return (
            <li
              key={reason.title}
              className="flex flex-col gap-3 rounded-card border border-border bg-bg p-6"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-field bg-accent/10 text-accent">
                <Icon aria-hidden="true" className="h-6 w-6" />
              </span>
              <h3 className="title text-xl font-extrabold uppercase leading-tight">
                {reason.title}
              </h3>
              <p className="text-sm leading-relaxed text-fg-muted">
                {reason.body}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
