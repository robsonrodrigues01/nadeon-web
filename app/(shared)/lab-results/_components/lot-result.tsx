import React from "react";
import type { LabLot } from "@/lib/contracts/labs";

interface LotResultProps {
  lot: LabLot;
}

// Estado com lote encontrado. Só renderiza dados vindos do LabsProvider.
export function LotResult({ lot }: LotResultProps) {
  return (
    <section
      aria-labelledby="lot-result-heading"
      className="rounded-card border border-border bg-bg-elevated p-6 shadow-card sm:p-8"
    >
      <p className="text-xs font-bold uppercase tracking-wider text-accent">
        Lot {lot.lotNumber}
      </p>
      <h2
        id="lot-result-heading"
        className="mt-2 font-archivo text-2xl font-bold text-fg"
      >
        {lot.productName}
      </h2>
      <p className="mt-2 text-sm font-bold text-fg">
        {lot.status === "passed" ? "All tests passed" : lot.status}
      </p>

      <dl className="mt-6 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-fg-muted">Lot</dt>
          <dd className="font-bold text-fg">{lot.lotNumber}</dd>
        </div>
        <div>
          <dt className="text-fg-muted">Manufactured</dt>
          <dd className="font-bold text-fg">{lot.manufacturedDate}</dd>
        </div>
        <div>
          <dt className="text-fg-muted">Best by</dt>
          <dd className="font-bold text-fg">{lot.expiryDate}</dd>
        </div>
      </dl>

      <ul aria-label="Tests passed" className="mt-6 space-y-3">
        {lot.testResults.map((test) => (
          <li key={test.parameter} className="text-sm">
            <span className="font-bold text-fg">{test.parameter}</span>{" "}
            <span className="text-fg-muted">{test.specification}</span>
            <span className="block text-fg-muted">
              {test.result}
              {test.passed ? "" : " (not passed)"}
            </span>
          </li>
        ))}
      </ul>

      <a
        href={lot.coaUrl}
        download
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full border-2 border-border px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-fg hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        Download COA (PDF)
      </a>
    </section>
  );
}
