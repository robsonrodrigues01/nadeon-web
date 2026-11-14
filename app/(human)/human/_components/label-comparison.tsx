import React from "react";
import Link from "next/link";
import { Check, X } from "lucide-react";

export function LabelComparison() {
  const rows = [
    {
      feature: "Exact dose per serving on the label",
      nadeon: true,
      typical: "Often missing",
    },
    {
      feature: "Third-party test for every lot",
      nadeon: true,
      typical: "Often missing",
    },
    {
      feature: "Lot number with a public lab report",
      nadeon: true,
      typical: "Often missing",
    },
    {
      feature: "Made in a U.S. FDA-registered facility",
      nadeon: true,
      typical: "Often missing",
    },
    {
      feature: "No proprietary blends",
      nadeon: true,
      typical: "Often missing",
    },
  ];

  return (
    <section
      aria-labelledby="label-comparison-title"
      className="w-full border-b border-border bg-bg text-fg py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block rounded-full bg-bg-elevated px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent border border-border">
            BUYING NMN?
          </span>
          <h2
            id="label-comparison-title"
            className="mt-4 font-archivo text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-fg"
          >
            What to look for in a label
          </h2>
        </div>

        <div className="mt-12 overflow-x-auto">
          <table className="w-full text-left border-collapse rounded-card overflow-hidden shadow-card">
            <thead>
              <tr className="border-b border-border bg-bg-elevated text-xs uppercase tracking-wider text-fg-muted font-bold">
                <th scope="col" className="p-4 sm:p-6">
                  What to look for
                </th>
                <th scope="col" className="p-4 sm:p-6 text-center text-accent">
                  Nadeon
                </th>
                <th scope="col" className="p-4 sm:p-6 text-center">
                  Typical label
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-bg-elevated text-sm sm:text-base">
              {rows.map((row) => (
                <tr key={row.feature} className="transition-colors hover:bg-bg">
                  <td className="p-4 sm:p-6 font-semibold text-fg">
                    {row.feature}
                  </td>
                  <td className="p-4 sm:p-6 text-center">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent text-accent-fg font-black">
                      <Check className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">Included in Nadeon</span>
                    </span>
                  </td>
                  <td className="p-4 sm:p-6 text-center text-fg-muted font-medium">
                    <span className="inline-flex items-center gap-1.5">
                      <X className="h-4 w-4 text-fg-muted" aria-hidden="true" />
                      {row.typical}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link
            href="/lab-results"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-accent px-8 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-accent-fg shadow-card transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-accent"
          >
            See our lab results
          </Link>
          <Link
            href="/human/products/biohack"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border-2 border-border px-7 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-fg transition-colors hover:border-fg focus-visible:outline-2 focus-visible:outline-accent"
          >
            Shop BioHack
          </Link>
        </div>
      </div>
    </section>
  );
}
