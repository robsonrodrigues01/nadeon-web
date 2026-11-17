"use client";

import type { ChangeEvent } from "react";
import type { Product } from "@/lib/contracts/catalog";

function submitFilters(
  event: ChangeEvent<HTMLSelectElement | HTMLInputElement>
) {
  const form = event.currentTarget.form;
  const offset = form?.elements.namedItem("offset");
  if (offset instanceof HTMLInputElement) offset.value = "0";
  form?.requestSubmit();
}

export function ReviewsFilters({
  products,
  product,
  rating,
  pet,
  photos,
  sort,
}: {
  products: Product[];
  product: string;
  rating: string;
  pet: string;
  photos: boolean;
  sort: string;
}) {
  return (
    <form
      action="/reviews"
      method="get"
      className="grid gap-4 rounded-card border border-border bg-bg-elevated p-5 sm:grid-cols-2 lg:grid-cols-5"
    >
      <input type="hidden" name="offset" value="0" />
      <label className="flex flex-col gap-2 text-sm font-bold text-fg">
        Filter by product
        <select
          name="product"
          value={product}
          onChange={submitFilters}
          className="min-h-11 rounded-field border border-border bg-bg px-3 font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <option value="">All products</option>
          {products.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-2 text-sm font-bold text-fg">
        Rating
        <select
          name="rating"
          value={rating}
          onChange={submitFilters}
          className="min-h-11 rounded-field border border-border bg-bg px-3 font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <option value="">Rating: all</option>
          {[5, 4, 3, 2, 1].map((value) => (
            <option key={value} value={value}>
              {value}★
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-2 text-sm font-bold text-fg">
        Pet
        <select
          name="pet"
          value={pet}
          onChange={submitFilters}
          className="min-h-11 rounded-field border border-border bg-bg px-3 font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <option value="all">Pet: all</option>
          <option value="dog">Pet: dogs</option>
          <option value="cat">Pet: cats</option>
          <option value="horse">Pet: horses</option>
        </select>
      </label>
      <label className="flex min-h-11 items-center gap-3 text-sm font-bold text-fg">
        <input
          type="checkbox"
          name="photos"
          value="true"
          checked={photos}
          onChange={submitFilters}
          className="size-5 accent-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
        With photos
      </label>
      <label className="flex flex-col gap-2 text-sm font-bold text-fg">
        Sort
        <select
          name="sort"
          value={sort}
          onChange={submitFilters}
          className="min-h-11 rounded-field border border-border bg-bg px-3 font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <option value="most_recent">Sort: most recent</option>
        </select>
      </label>
    </form>
  );
}
