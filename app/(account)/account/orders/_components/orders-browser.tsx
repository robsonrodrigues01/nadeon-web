"use client";

import { useId, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { OrderCard } from "./order-card";
import {
  matchesOrderFilter,
  ORDER_STATUS_FILTERS,
  type OrderRowView,
  type OrderStatusFilter,
} from "./order-view";

export interface OrdersBrowserProps {
  rows: OrderRowView[];
}

/** Search and status filter over rows already formatted on the server. */
export function OrdersBrowser({ rows }: OrdersBrowserProps) {
  const [filter, setFilter] = useState<OrderStatusFilter>("all");
  const [query, setQuery] = useState("");
  const searchId = useId();

  const visible = useMemo(
    () => rows.filter((row) => matchesOrderFilter(row, filter, query)),
    [rows, filter, query]
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <fieldset className="flex flex-wrap gap-2">
          <legend className="sr-only">Order status</legend>
          {ORDER_STATUS_FILTERS.map((option) => {
            const isActive = option.value === filter;
            const label =
              option.value === "all"
                ? `${option.label} (${rows.length})`
                : option.label;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={isActive}
                onClick={() => setFilter(option.value)}
                className={cn(
                  "inline-flex min-h-11 items-center rounded-pill border px-4 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                  isActive
                    ? "border-transparent bg-gradient-gold text-accent-fg"
                    : "border-border text-fg hover:border-accent"
                )}
              >
                {label}
              </button>
            );
          })}
        </fieldset>

        <div className="w-full md:w-80">
          <label htmlFor={searchId} className="sr-only">
            Search by order or product
          </label>
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by order or product"
            className="min-h-11 w-full rounded-pill border border-border bg-bg-elevated px-5 text-sm text-fg placeholder:text-fg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
        </div>
      </div>

      {visible.length === 0 ? (
        <p role="status" className="text-sm text-fg-muted">
          No orders found.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {visible.map((row) => (
            <li key={row.id}>
              <OrderCard row={row} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
