import { Button } from "@/components/ui/button";
import type { ShopFormat } from "./format-config";

export interface CompareFormatsProps {
  current: ShopFormat;
  formats: readonly ShopFormat[];
}

export function CompareFormats({ current, formats }: CompareFormatsProps) {
  return (
    <section
      id="compare-formats"
      aria-labelledby="compare-formats-heading"
      className="scroll-mt-24 bg-bg px-4 py-12 text-fg sm:px-10 lg:px-[72px] lg:py-20"
    >
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
        Compare formats
      </p>
      <h2
        id="compare-formats-heading"
        className="title mt-2 text-3xl font-extrabold uppercase leading-none tracking-tight sm:text-5xl"
      >
        Capsules, powders or tinctures?
      </h2>

      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {formats.map((format) => {
          const isCurrent = format.slug === current.slug;
          return (
            <li
              key={format.slug}
              className={`flex flex-col gap-4 rounded-card border p-6 ${
                isCurrent
                  ? "border-2 border-accent bg-bg-elevated"
                  : "border-border bg-bg-elevated"
              }`}
            >
              {isCurrent && (
                <span className="text-xs font-extrabold uppercase tracking-[0.1em] text-accent">
                  You are here
                </span>
              )}
              <h3 className="title text-2xl font-extrabold uppercase leading-none">
                {format.label}
              </h3>
              <div>
                <Button href={`/human/shop/${format.slug}`} variant="secondary">
                  {`Shop ${format.label.toLowerCase()}`}
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
