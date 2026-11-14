"use client";

import React, { useState } from "react";
import type { LabLot } from "@/lib/contracts/labs";

type LineFilter = "all" | "human" | "pet";

const FILTERS: { value: LineFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "human", label: "Human" },
  { value: "pet", label: "Pet" },
];

interface LotBrowserProps {
  lots: LabLot[];
  // Linha de cada produto (slug -> human | pet), vinda do CatalogProvider no servidor.
  lineBySlug: Record<string, "human" | "pet">;
}

export function LotBrowser({ lots, lineBySlug }: LotBrowserProps) {
  const [filter, setFilter] = useState<LineFilter>("all");

  const visible = lots.filter(
    (lot) => filter === "all" || lineBySlug[lot.productSlug] === filter
  );

  return (
    <section aria-labelledby="latest-lots-heading" className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h2
          id="latest-lots-heading"
          className="font-archivo text-2xl font-bold text-fg"
        >
          Latest test results
        </h2>
        <div
          role="group"
          aria-label="Filter lots by line"
          className="flex gap-2"
        >
          {FILTERS.map((item) => (
            <button
              key={item.value}
              type="button"
              aria-pressed={filter === item.value}
              onClick={() => setFilter(item.value)}
              className="min-h-11 rounded-full border-2 border-border px-4 text-sm font-bold uppercase tracking-wider text-fg aria-pressed:border-accent aria-pressed:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {lots.length === 0 ? (
        <p className="rounded-card border border-border bg-bg-elevated p-6 text-fg-muted first-letter:uppercase">
          first lots publishing soon
        </p>
      ) : visible.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <caption className="sr-only">Latest test results by lot</caption>
            <thead>
              <tr className="border-b border-border text-fg-muted">
                <th scope="col" className="py-3 pr-4 font-bold">
                  Product
                </th>
                <th scope="col" className="py-3 pr-4 font-bold">
                  Lot
                </th>
                <th scope="col" className="py-3 pr-4 font-bold">
                  Manufactured
                </th>
                <th scope="col" className="py-3 pr-4 font-bold">
                  Status
                </th>
                <th scope="col" className="py-3 font-bold">
                  COA
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((lot) => (
                <tr
                  key={lot.lotNumber}
                  className="border-b border-border text-fg"
                >
                  <td className="py-3 pr-4 font-bold">{lot.productName}</td>
                  <td className="py-3 pr-4">{lot.lotNumber}</td>
                  <td className="py-3 pr-4">{lot.manufacturedDate}</td>
                  <td className="py-3 pr-4">{lot.status}</td>
                  <td className="py-3">
                    <a
                      href={lot.coaUrl}
                      download
                      className="inline-flex min-h-11 items-center font-bold underline underline-offset-4 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      Download COA (PDF)
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <div>
        {/* Sem paginação até haver mais lotes do que a primeira página. */}
        <button
          type="button"
          disabled
          className="min-h-11 rounded-full border-2 border-border px-6 text-sm font-bold uppercase tracking-wider text-fg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Load more lots
        </button>
      </div>
    </section>
  );
}
