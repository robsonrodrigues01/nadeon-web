import Link from "next/link";
import type { ShopFormat } from "./format-config";

export interface FormatTab {
  format: ShopFormat;
  count: number;
}

export interface FormatHeroProps {
  current: ShopFormat;
  tabs: FormatTab[];
  jarNames: string[];
}

export function FormatHero({ current, tabs, jarNames }: FormatHeroProps) {
  return (
    <section className="bg-bg text-fg px-4 py-8 sm:px-10 sm:py-14 lg:px-[72px]">
      <nav aria-label="Breadcrumb" className="text-sm text-fg-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="underline-offset-4 hover:underline">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/human" className="underline-offset-4 hover:underline">
              Human
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href="/human/shop"
              className="underline-offset-4 hover:underline"
            >
              Shop
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-bold text-fg">
            {current.label}
          </li>
        </ol>
      </nav>

      <p className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-accent">
        Shop by format
      </p>
      <h1 className="title mt-3 text-4xl font-extrabold uppercase leading-none tracking-tight sm:text-7xl">
        {current.label}
      </h1>

      <nav aria-label="Formats" className="mt-8">
        <ul className="flex flex-col gap-3 sm:flex-row">
          {tabs.map(({ format, count }) => {
            const isCurrent = format.slug === current.slug;
            return (
              <li key={format.slug} className="sm:flex-1">
                <Link
                  href={`/human/shop/${format.slug}`}
                  aria-current={isCurrent ? "page" : undefined}
                  className={`flex min-h-11 flex-col items-center justify-center rounded-card border px-4 py-3 text-center font-extrabold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    isCurrent
                      ? "border-accent bg-accent text-accent-fg"
                      : "border-border text-fg hover:border-accent"
                  }`}
                >
                  <span className="text-base">{format.label}</span>
                  <span className="mt-0.5 text-xs font-semibold opacity-80">
                    {count} formulas
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {jarNames.length > 0 && (
        <div
          aria-hidden="true"
          className="mt-10 flex items-end justify-center gap-4 sm:justify-start"
        >
          {jarNames.map((name) => (
            <div
              key={name}
              className="flex w-20 flex-col items-center justify-end sm:w-32"
            >
              <div className="h-4 w-16 rounded-t-md bg-bg-elevated sm:w-24" />
              <div className="flex h-28 w-20 flex-col items-center justify-center rounded-field bg-bg-elevated px-2 text-center shadow-elevated sm:h-36 sm:w-32">
                <span className="max-w-full break-words text-xs font-extrabold uppercase leading-tight text-fg sm:text-base">
                  {name}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
