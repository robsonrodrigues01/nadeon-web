"use client";

import { useRouter } from "next/navigation";
import { toQueryString, type CatSort } from "./cat-query";

export interface CatFilterOption {
  value: string;
  label: string;
  count: number;
}

export interface CatFiltersProps {
  basePath: string;
  format: string;
  sort: CatSort;
  total: number;
  formats: CatFilterOption[];
}

const optionClass =
  "inline-flex min-h-11 cursor-pointer items-center rounded-pill border border-border bg-bg-elevated px-4 text-sm font-semibold text-fg has-[:checked]:border-accent has-[:checked]:bg-accent has-[:checked]:text-accent-fg has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent";

/** Filters update the URL, so the Server Component re-reads the product list. */
export function CatFilters({
  basePath,
  format,
  sort,
  total,
  formats,
}: CatFiltersProps) {
  const router = useRouter();

  function go(next: { format?: string; sort?: string }) {
    const state = { format, sort, ...next };
    router.push(`${basePath}${toQueryString(state)}`);
  }

  const formatOptions: CatFilterOption[] = [
    { value: "", label: "All", count: total },
    ...formats,
  ];

  return (
    <div className="flex flex-col gap-6 border-b border-border pb-6">
      <fieldset className="flex flex-col gap-2">
        <legend className="label mb-2 text-xs font-bold uppercase tracking-wider text-fg-muted">
          Format
        </legend>
        <div className="flex flex-wrap gap-2">
          {formatOptions.map((option) => (
            <label key={`format-${option.value}`} className={optionClass}>
              <input
                type="radio"
                name="format"
                value={option.value}
                className="sr-only"
                checked={format.toLowerCase() === option.value.toLowerCase()}
                onChange={() => go({ format: option.value })}
              />
              <span>
                {option.label} {option.count}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex items-center gap-3">
        <label htmlFor="cat-sort" className="text-sm font-semibold text-fg">
          Sort
        </label>
        <select
          id="cat-sort"
          name="sort"
          value={sort}
          onChange={(event) => go({ sort: event.target.value })}
          className="min-h-11 rounded-field border border-border bg-bg-elevated px-3 text-sm font-semibold text-fg"
        >
          <option value="featured">Featured</option>
          <option value="best-selling">Best sellers</option>
        </select>
      </div>
    </div>
  );
}
