"use client";

import React, { useId, useState } from "react";

export interface ScienceFaqItem {
  question: string;
  answer: string;
}

// Acordeão de uma coluna: um item aberto por vez, o primeiro abre por padrão.
export function ScienceFaq({ items }: { items: ScienceFaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(
    items.length > 0 ? 0 : null
  );
  const baseId = useId();

  return (
    <ul className="divide-y divide-border border-y border-border">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const buttonId = `${baseId}-q-${index}`;
        const panelId = `${baseId}-a-${index}`;
        return (
          <li key={item.question}>
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full min-h-11 items-center justify-between gap-4 py-4 text-left font-archivo font-bold text-base text-fg hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
              >
                <span>{item.question}</span>
                <span aria-hidden="true" className="text-xl text-accent">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
            </h3>
            {isOpen && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className="pb-5 text-base text-fg-muted leading-relaxed"
              >
                <p>{item.answer}</p>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
