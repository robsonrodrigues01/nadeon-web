import React from "react";
import type { Product } from "@/lib/contracts/catalog";
import { ProductCard } from "@/components/commerce/product-card";

export interface CatsAndHorsesSectionProps {
  products: Product[];
}

export function CatsAndHorsesSection({ products }: CatsAndHorsesSectionProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="cats-and-horses-heading"
      className="bg-bg-elevated/40 border-t border-border px-6 py-16 sm:px-12 sm:py-20 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        <span className="label block text-xs font-extrabold tracking-widest text-accent uppercase">
          CATS AND HORSES
        </span>

        <h2
          id="cats-and-horses-heading"
          className="title mt-2 text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-fg"
        >
          Not just for dogs
        </h2>

        <p className="lead mt-3 text-base sm:text-lg text-fg-muted max-w-2xl">
          Drops for cats and top-dress for horses, made in the same lab.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
