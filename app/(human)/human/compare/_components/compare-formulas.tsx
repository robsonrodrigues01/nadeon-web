"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/contracts/catalog";
import type { Market } from "@/lib/market/types";
import { formatMoneyWithMarket } from "@/lib/market/formatter";
import { cartProvider } from "@/lib/providers/client";
import { Claim } from "@/components/commerce/product-card/claim";
import { Button } from "@/components/ui/button";

interface CompareFormulasProps {
  products: Product[];
  market: Market;
}

type ComparisonRow = {
  label: string;
  value: (product: Product) => string;
  content: (product: Product) => React.ReactNode;
};

function primaryVariant(product: Product) {
  return (
    product.variants.find((variant) => variant.jars === 1) ??
    product.variants[0]
  );
}

export function CompareFormulas({ products, market }: CompareFormulasProps) {
  const [differencesOnly, setDifferencesOnly] = useState(false);
  const [mobileView, setMobileView] = useState<"cards" | "two">("cards");
  const [firstSlug, setFirstSlug] = useState(products[0]?.slug ?? "");
  const [secondSlug, setSecondSlug] = useState(
    products[1]?.slug ?? products[0]?.slug ?? ""
  );
  const [addingSlug, setAddingSlug] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const rows: ComparisonRow[] = useMemo(
    () => [
      {
        label: "Main benefit",
        value: (product) =>
          product.claims.find((claim) => claim.isClaim)?.text ??
          "To be confirmed",
        content: (product) => {
          const claim = product.claims.find((item) => item.isClaim);
          return claim ? <Claim>{claim.text}</Claim> : "To be confirmed";
        },
      },
      {
        label: "Key ingredients",
        value: (product) =>
          product.actives.map((active) => active.name).join(" · ") ||
          "To be confirmed",
        content: (product) =>
          product.actives.length > 0
            ? product.actives.map((active) => active.name).join(" · ")
            : "To be confirmed",
      },
      {
        label: "Format",
        value: (product) => product.format || "To be confirmed",
        content: (product) => product.format || "To be confirmed",
      },
      {
        label: "Servings",
        value: (product) => `${product.servingsPerJar} per jar`,
        content: (product) => `${product.servingsPerJar} per jar`,
      },
      {
        label: "Best for",
        value: () => "To be confirmed",
        content: () => "To be confirmed",
      },
      {
        label: "Price",
        value: (product) => {
          const variant = primaryVariant(product);
          return variant
            ? formatMoneyWithMarket(variant.price, market)
            : "To be confirmed";
        },
        content: (product) => {
          const variant = primaryVariant(product);
          return variant
            ? formatMoneyWithMarket(variant.price, market)
            : "To be confirmed";
        },
      },
    ],
    [market]
  );

  const visibleRows = (comparison: Product[]) =>
    rows.filter(
      (row) =>
        !differencesOnly ||
        new Set(comparison.map((product) => row.value(product))).size > 1
    );

  const addToCart = async (product: Product) => {
    const variant = primaryVariant(product);
    if (!variant) return;
    setAddingSlug(product.slug);
    setFeedback(null);
    try {
      await cartProvider.addLines([{ variantId: variant.id, quantity: 1 }]);
      setFeedback(`Added ${product.name} to cart`);
    } catch {
      setFeedback(`Failed to add ${product.name} to cart`);
    } finally {
      setAddingSlug(null);
    }
  };

  const firstProduct =
    products.find((product) => product.slug === firstSlug) ?? products[0];
  const secondProduct =
    products.find((product) => product.slug === secondSlug) ??
    products[1] ??
    products[0];
  const selectedProducts = [firstProduct, secondProduct].filter(
    (product): product is Product => Boolean(product)
  );

  return (
    <>
      <section className="bg-bg-elevated px-4 py-10 text-fg sm:px-8 sm:py-16 lg:px-18">
        <div className="mx-auto max-w-7xl">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-fg-muted">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/human">Human</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">Compare</li>
            </ol>
          </nav>
          <p className="text-xs font-bold tracking-[0.14em] text-accent">
            SIDE BY SIDE
          </p>
          <h1 className="mt-3 font-archivo text-4xl font-extrabold uppercase leading-none text-fg sm:text-6xl lg:text-7xl">
            Compare formulas
          </h1>
          <p className="mt-5 max-w-2xl text-base text-fg-muted">
            To be confirmed.
          </p>
          <Link
            href="/human/quiz"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full border border-border px-6 py-3 font-bold text-fg underline underline-offset-4 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Take the quiz instead
          </Link>
        </div>
      </section>

      <section
        aria-label="Formula comparison"
        className="bg-bg px-4 py-10 text-fg sm:px-8 lg:px-18"
      >
        <div className="mx-auto max-w-7xl">
          {feedback && (
            <p role="status" className="mb-4 text-sm font-bold">
              {feedback}
            </p>
          )}
          <div className="mb-4 hidden items-center justify-end md:flex">
            <label className="inline-flex min-h-11 cursor-pointer items-center gap-3 font-bold">
              <input
                type="checkbox"
                checked={differencesOnly}
                onChange={(event) => setDifferencesOnly(event.target.checked)}
                className="size-5 accent-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              />
              Show differences only
            </label>
          </div>

          <div className="hidden overflow-auto max-h-[75vh] rounded-card border border-border md:block">
            <table
              aria-label="Formula comparison"
              className="w-full min-w-[900px] border-collapse text-left"
            >
              <thead className="sticky top-0 z-20 bg-bg-elevated shadow-xs">
                <tr>
                  <th
                    scope="col"
                    className="sticky top-0 left-0 z-30 bg-bg-elevated min-w-36 border-r border-border p-4 text-sm font-bold"
                  >
                    Formula details
                  </th>
                  {products.map((product) => (
                    <th
                      key={product.slug}
                      scope="col"
                      className="sticky top-0 z-20 bg-bg-elevated min-w-40 border-l border-border p-4 align-top"
                    >
                      <Link
                        href={`/human/products/${product.slug}`}
                        className="font-bold text-fg underline underline-offset-4 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-2 text-sm font-normal text-fg-muted">
                        {primaryVariant(product)
                          ? formatMoneyWithMarket(
                              primaryVariant(product)!.price,
                              market
                            )
                          : "To be confirmed"}
                      </p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleRows(products).map((row) => (
                  <tr key={row.label} className="border-t border-border">
                    <th
                      scope="row"
                      className="sticky left-0 z-10 bg-bg-elevated border-r border-border p-4 text-sm font-bold"
                    >
                      {row.label}
                    </th>
                    {products.map((product) => (
                      <td
                        key={product.slug}
                        className="border-l border-border p-4 text-sm text-fg-muted"
                      >
                        {row.content(product)}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="border-t border-border">
                  <th
                    scope="row"
                    className="sticky left-0 z-10 bg-bg-elevated border-r border-border p-4 text-sm font-bold"
                  >
                    Purchase
                  </th>
                  {products.map((product) => (
                    <td
                      key={product.slug}
                      className="border-l border-border p-4"
                    >
                      <ProductActions
                        product={product}
                        addingSlug={addingSlug}
                        onAdd={addToCart}
                      />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="md:hidden">
            <nav
              aria-label="Formula shortcuts"
              className="sticky top-0 z-10 mb-5 flex gap-2 overflow-x-auto bg-bg py-3"
            >
              {products.map((product) => (
                <a
                  key={product.slug}
                  href={`#formula-${product.slug}`}
                  className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-border px-4 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {product.name}
                </a>
              ))}
            </nav>
            <fieldset className="mb-5 flex flex-wrap gap-x-5 gap-y-2">
              <legend className="mb-2 font-bold">Comparison view</legend>
              <label className="inline-flex min-h-11 items-center gap-2">
                <input
                  type="radio"
                  name="mobile-compare-view"
                  value="cards"
                  checked={mobileView === "cards"}
                  onChange={() => setMobileView("cards")}
                />
                Swipe cards
              </label>
              <label className="inline-flex min-h-11 items-center gap-2">
                <input
                  type="radio"
                  name="mobile-compare-view"
                  value="two"
                  checked={mobileView === "two"}
                  onChange={() => setMobileView("two")}
                />
                Compare two formulas
              </label>
            </fieldset>

            {mobileView === "cards" ? (
              <div
                aria-label="Formula cards"
                className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4"
              >
                {products.map((product, index) => (
                  <article
                    id={`formula-${product.slug}`}
                    key={product.slug}
                    className="w-[min(86vw,22rem)] shrink-0 snap-center rounded-card border border-border bg-bg-elevated p-5"
                  >
                    <p className="text-xs font-bold tracking-wider text-fg-muted">
                      {index + 1} / {products.length}
                    </p>
                    <h2 className="mt-2 font-archivo text-2xl font-extrabold uppercase">
                      {product.name}
                    </h2>
                    <dl className="mt-5 space-y-4">
                      {rows.map((row) => (
                        <div key={row.label}>
                          <dt className="text-xs font-bold uppercase tracking-wide text-fg-muted">
                            {row.label}
                          </dt>
                          <dd className="mt-1 text-sm">
                            {row.content(product)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    <div className="mt-6">
                      <ProductActions
                        product={product}
                        addingSlug={addingSlug}
                        onAdd={addToCart}
                      />
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <section aria-label="Compare two formulas">
                <div className="mb-5 grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 font-bold">
                    First formula
                    <select
                      value={firstSlug}
                      onChange={(event) => setFirstSlug(event.target.value)}
                      className="min-h-11 rounded-field border border-border bg-bg-elevated px-3 text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      {products.map((product) => (
                        <option key={product.slug} value={product.slug}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-2 font-bold">
                    Second formula
                    <select
                      value={secondSlug}
                      onChange={(event) => setSecondSlug(event.target.value)}
                      className="min-h-11 rounded-field border border-border bg-bg-elevated px-3 text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      {products.map((product) => (
                        <option key={product.slug} value={product.slug}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <label className="mb-4 inline-flex min-h-11 items-center gap-3 font-bold">
                  <input
                    type="checkbox"
                    checked={differencesOnly}
                    onChange={(event) =>
                      setDifferencesOnly(event.target.checked)
                    }
                    className="size-5 accent-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  />
                  Show differences only
                </label>
                <div className="overflow-x-auto rounded-card border border-border">
                  <table
                    aria-label="Selected formula comparison"
                    className="w-full min-w-[34rem] border-collapse text-left"
                  >
                    <thead className="bg-bg-elevated">
                      <tr>
                        <th scope="col" className="p-4">
                          Formula details
                        </th>
                        {selectedProducts.map((product) => (
                          <th
                            scope="col"
                            key={product.slug}
                            className="border-l border-border p-4"
                          >
                            {product.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {visibleRows(selectedProducts).map((row) => (
                        <tr key={row.label} className="border-t border-border">
                          <th
                            scope="row"
                            className="bg-bg-elevated p-4 text-sm font-bold"
                          >
                            {row.label}
                          </th>
                          {selectedProducts.map((product) => (
                            <td
                              key={product.slug}
                              className="border-l border-border p-4 text-sm"
                            >
                              {row.content(product)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </div>

          <p className="mt-5 text-xs text-fg-muted">
            <Claim showDisclaimer>{""}</Claim>
          </p>
        </div>
      </section>

      <section
        aria-labelledby="compare-quiz-heading"
        className="bg-bg-elevated px-4 py-12 text-fg sm:px-8 lg:px-18"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.14em] text-accent">
              QUIZ
            </p>
            <h2
              id="compare-quiz-heading"
              className="mt-2 font-archivo text-2xl font-extrabold uppercase"
            >
              Not sure? Take the quiz
            </h2>
            <p className="mt-2 max-w-2xl text-fg-muted">To be confirmed.</p>
          </div>
          <Link
            href="/human/quiz"
            className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-fg px-6 py-3 font-bold text-bg hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Take the quiz
          </Link>
        </div>
      </section>
    </>
  );
}

function ProductActions({
  product,
  addingSlug,
  onAdd,
}: {
  product: Product;
  addingSlug: string | null;
  onAdd: (product: Product) => void;
}) {
  const discount = product.sellingPlans[0]?.discountPercentage;
  return (
    <div className="flex flex-col items-start gap-2">
      <Button
        type="button"
        variant="primary"
        size="sm"
        isLoading={addingSlug === product.slug}
        loadingText="Adding..."
        onClick={() => onAdd(product)}
        aria-label={`Add ${product.name} to cart`}
      >
        Add to cart
      </Button>
      {discount !== undefined ? (
        <Link
          href="/human/subscribe"
          className="inline-flex min-h-11 items-center text-sm font-bold underline underline-offset-4 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Subscribe &amp; save {discount}%
        </Link>
      ) : (
        <span className="text-sm text-fg-muted">
          Subscribe &amp; save: To be confirmed
        </span>
      )}
    </div>
  );
}
