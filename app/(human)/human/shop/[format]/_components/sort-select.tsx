"use client";

import { useId } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { CatalogSort } from "@/lib/contracts/catalog";

const OPTIONS: ReadonlyArray<{ value: CatalogSort; label: string }> = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "title-asc", label: "Title: A to Z" },
];

export function SortSelect({ value }: { value: CatalogSort }) {
  const id = useId();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-3">
      <label htmlFor={id} className="text-sm font-bold text-fg-muted">
        Sort
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => {
          const next = event.target.value;
          const url =
            next === "featured" ? pathname : `${pathname}?sort=${next}`;
          router.push(url, { scroll: false });
        }}
        className="min-h-11 rounded-field border border-border bg-bg-elevated px-3 text-sm font-bold text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        {OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
