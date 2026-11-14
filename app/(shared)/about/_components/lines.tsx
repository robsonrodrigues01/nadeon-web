import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Claim } from "@/components/commerce/product-card/claim";
import type { Product } from "@/lib/contracts/catalog";

interface ProductsProps {
  humanProducts: Product[];
  petProducts: Product[];
}

interface LinesSectionProps {
  humanProducts: Product[];
  petProducts: Product[];
}

function ProductList({
  products,
  line,
}: {
  products: Product[];
  line: "human" | "pet";
}) {
  return (
    <ul className="mt-6 grid gap-3 sm:grid-cols-3">
      {products.map((product) => (
        <li key={product.slug}>
          <Link
            href={`/${line}/products/${product.slug}`}
            className="block rounded-card border border-border bg-bg p-4 hover:border-accent min-h-11"
          >
            <span className="block font-archivo font-bold text-fg">
              {product.name}
            </span>
            <span className="mt-1 block text-sm text-fg-muted">
              {product.technicalName}
            </span>
            <span className="mt-1 block text-xs uppercase tracking-wide text-fg-muted">
              {product.format}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function LinesSection({
  humanProducts,
  petProducts,
}: LinesSectionProps) {
  return (
    <section
      aria-labelledby="about-lines"
      className="w-full bg-bg-elevated text-fg py-14 sm:py-20 border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
          Two lines, one standard
        </p>
        <h2
          id="about-lines"
          className="mt-3 font-archivo font-extrabold uppercase text-3xl sm:text-4xl text-fg"
        >
          For people and pets
        </h2>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <article
            aria-labelledby="about-line-human"
            className="rounded-card border border-border bg-bg p-6 sm:p-8"
          >
            <h3
              id="about-line-human"
              className="font-archivo font-extrabold uppercase text-2xl text-fg"
            >
              Nadeon Human
            </h3>
            <p className="mt-1 text-sm text-fg-muted">For people</p>
            <p className="mt-4 text-base text-fg-muted leading-relaxed">
              <Claim showDisclaimer>
                Capsules, powders and tinctures with NMN and NAD + for your
                daily routine.
              </Claim>
            </p>
            <ProductList products={humanProducts} line="human" />
            <div className="mt-6">
              <Button href="/human" variant="link">
                Visit Nadeon Human →
              </Button>
            </div>
          </article>

          <article
            aria-labelledby="about-line-pet"
            className="rounded-card border border-border bg-bg p-6 sm:p-8"
          >
            <h3
              id="about-line-pet"
              className="font-archivo font-extrabold uppercase text-2xl text-fg"
            >
              Nadeon Pet
            </h3>
            <p className="mt-1 text-sm text-fg-muted">For pets</p>
            <p className="mt-4 text-base text-fg-muted leading-relaxed">
              <Claim showDisclaimer>
                Soft chews, treats, oils and drops with NMN for dogs, cats and
                horses.
              </Claim>
            </p>
            <ProductList products={petProducts} line="pet" />
            <aside
              aria-label="Pet regulatory information"
              className="mt-6 text-xs text-fg-muted"
            >
              <p className="font-medium text-fg">
                For animal use only. Equine products: not for horses intended
                for food.
              </p>
            </aside>
            <div className="mt-6">
              <Button href="/pet" variant="link">
                Visit Nadeon Pet →
              </Button>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export function ShopLinesSection({
  humanProducts,
  petProducts,
}: ProductsProps) {
  return (
    <section
      aria-labelledby="about-shop"
      className="w-full bg-bg text-fg py-14 sm:py-20 border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
          Shop the lines
        </p>
        <h2
          id="about-shop"
          className="mt-3 font-archivo font-extrabold uppercase text-3xl sm:text-4xl text-fg"
        >
          Ready to try Nadeon?
        </h2>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="font-archivo font-bold uppercase text-lg text-fg">
              Nadeon Human
            </h3>
            <p className="text-sm text-fg-muted">For you</p>
            <ProductList products={humanProducts} line="human" />
            <div className="mt-6">
              <Button href="/human" variant="primary">
                Shop Human
              </Button>
            </div>
          </div>
          <div>
            <h3 className="font-archivo font-bold uppercase text-lg text-fg">
              Nadeon Pet
            </h3>
            <p className="text-sm text-fg-muted">For them</p>
            <ProductList products={petProducts} line="pet" />
            <div className="mt-6">
              <Button href="/pet" variant="primary">
                Shop Pet
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
