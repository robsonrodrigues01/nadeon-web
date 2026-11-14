"use client";

import React, { useState } from "react";

export interface SearchFieldProps {
  initialQuery: string;
}

export function SearchField({ initialQuery }: SearchFieldProps) {
  const [value, setValue] = useState(initialQuery);

  return (
    <form
      role="search"
      action="/search"
      method="get"
      className="flex w-full items-center gap-2"
    >
      <label htmlFor="search-query" className="sr-only">
        Search
      </label>
      <input
        id="search-query"
        name="q"
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        autoComplete="off"
        className="min-h-11 flex-1 rounded-pill border border-border bg-bg-elevated px-5 text-base font-semibold text-fg placeholder:text-fg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue("")}
          className="min-h-11 min-w-11 rounded-pill px-3 text-sm font-bold text-fg-muted hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Clear <span aria-hidden="true">✕</span>
        </button>
      )}
      <button
        type="submit"
        aria-label="Search"
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-pill bg-accent px-4 text-lg font-bold text-accent-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <span aria-hidden="true">⌕</span>
      </button>
    </form>
  );
}
