"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { Claim } from "@/components/commerce/product-card/claim";
import type {
  Ingredient,
  IngredientGlossary as GlossaryData,
} from "@/lib/contracts/content";

type IngredientProduct = {
  name: string;
  format: string;
  dose: string;
  price: string;
  href: string;
};

type IngredientEntry = {
  ingredient: Ingredient;
  products: IngredientProduct[];
};

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const initialBatchSize = 6;

export function IngredientGlossary({
  glossary,
  entries,
}: {
  glossary: GlossaryData;
  entries: IngredientEntry[];
}) {
  const [searchText, setSearchText] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [letter, setLetter] = useState("");
  const [visibleCount, setVisibleCount] = useState(initialBatchSize);
  const categories = [
    ...new Set([
      ...glossary.categories,
      ...entries.map(({ ingredient }) => ingredient.category),
    ]),
  ].filter((item) => item && item !== "All" && item !== "To be confirmed");

  const filteredEntries = useMemo(() => {
    const term = appliedSearch.toLowerCase();
    return entries.filter(({ ingredient }) => {
      const matchesTerm =
        !term ||
        [ingredient.name, ingredient.category, ingredient.description]
          .join(" ")
          .toLowerCase()
          .includes(term);
      const matchesCategory =
        category === "All" || ingredient.category === category;
      const matchesLetter =
        !letter || ingredient.name.toUpperCase().startsWith(letter);
      return matchesTerm && matchesCategory && matchesLetter;
    });
  }, [appliedSearch, category, entries, letter]);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAppliedSearch(searchText.trim());
    setVisibleCount(initialBatchSize);
  }

  function selectCategory(value: string) {
    setCategory(value);
    setVisibleCount(initialBatchSize);
  }

  function selectLetter(value: string) {
    setLetter((current) => (current === value ? "" : value));
    setVisibleCount(initialBatchSize);
  }

  const shownEntries = filteredEntries.slice(0, visibleCount);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-fg-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link className="underline underline-offset-4" href="/">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link className="underline underline-offset-4" href="/science">
              Learn
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">Ingredients</li>
        </ol>
      </nav>

      <header className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
          {glossary.eyebrow}
        </p>
        <h1 className="mt-3 font-archivo text-4xl font-extrabold uppercase text-fg sm:text-6xl">
          {glossary.title}
        </h1>
        <p className="mt-4 text-base text-fg-muted">
          {glossary.description || "To be confirmed"}
        </p>
      </header>

      <form
        role="search"
        onSubmit={submitSearch}
        className="mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row"
      >
        <label className="sr-only" htmlFor="ingredient-search">
          {glossary.searchLabel}
        </label>
        <input
          id="ingredient-search"
          type="search"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder={glossary.searchLabel}
          className="min-h-11 flex-1 rounded-field border border-border bg-bg-elevated px-4 text-fg placeholder:text-fg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
        <button
          type="submit"
          className="min-h-11 rounded-pill bg-fg px-6 font-bold text-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Search
        </button>
      </form>

      <nav aria-label="Jump to" className="mt-8">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-fg-muted">
          JUMP TO
        </p>
        <div className="flex gap-1 overflow-x-auto pb-2">
          {alphabet.map((item) => {
            const available = entries.some((entry) =>
              entry.ingredient.name.toUpperCase().startsWith(item)
            );
            return (
              <button
                key={item}
                type="button"
                disabled={!available}
                aria-pressed={letter === item}
                onClick={() => selectLetter(item)}
                className="min-h-11 min-w-11 shrink-0 rounded-pill font-bold text-fg enabled:hover:bg-bg-elevated disabled:cursor-not-allowed disabled:text-fg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {item}
              </button>
            );
          })}
        </div>
        <p className="mt-1 text-xs text-fg-muted sm:hidden">
          Swipe for more letters →
        </p>
      </nav>

      <fieldset className="mt-7">
        <legend className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-fg-muted">
          CATEGORY
        </legend>
        <div className="flex flex-wrap gap-2">
          {[
            "All",
            ...categories,
            ...(categories.length ? [] : ["To be confirmed"]),
          ].map((item) => (
            <label
              key={item}
              className="inline-flex min-h-11 items-center rounded-pill border border-border px-4 has-[:checked]:border-fg has-[:checked]:bg-fg has-[:checked]:text-bg has-[:disabled]:cursor-not-allowed has-[:disabled]:text-fg-muted/60"
            >
              <input
                type="radio"
                name="ingredient-category"
                value={item}
                checked={category === item}
                disabled={item === "To be confirmed"}
                onChange={() => selectCategory(item)}
                className="sr-only"
              />
              {item}
            </label>
          ))}
        </div>
      </fieldset>

      <section aria-label="Ingredients" className="mt-8">
        <p aria-live="polite" className="mb-4 text-sm text-fg-muted">
          {entries.length === 0
            ? "To be confirmed"
            : filteredEntries.length === 0
              ? "To be confirmed"
              : `${filteredEntries.length} ingredients`}
        </p>
        {shownEntries.length ? (
          <div className="space-y-10">
            {alphabet
              .map((initial) => ({
                initial,
                items: shownEntries.filter((entry) =>
                  entry.ingredient.name.toUpperCase().startsWith(initial)
                ),
              }))
              .filter(({ items }) => items.length > 0)
              .map(({ initial, items }) => (
                <section
                  key={initial}
                  aria-labelledby={`ingredient-letter-${initial}`}
                >
                  <h2
                    id={`ingredient-letter-${initial}`}
                    className="border-b border-border pb-2 font-archivo text-3xl font-extrabold text-fg"
                  >
                    {initial}
                  </h2>
                  <ul className="mt-4 grid gap-4 md:grid-cols-2">
                    {items.map(({ ingredient, products: foundIn }) => (
                      <li key={ingredient.slug}>
                        <article className="rounded-card border border-border bg-bg-elevated p-5">
                          <p className="text-xs font-bold uppercase tracking-wider text-accent">
                            {ingredient.category}
                          </p>
                          <h3 className="mt-2 font-archivo text-xl font-extrabold uppercase text-fg">
                            {ingredient.name}
                          </h3>
                          <p className="mt-3 text-sm text-fg-muted">
                            What it is:{" "}
                            {ingredient.description.includes("*") ? (
                              <Claim showDisclaimer>
                                {ingredient.description}
                              </Claim>
                            ) : (
                              ingredient.description
                            )}
                          </p>
                          <p className="mt-2 text-sm text-fg-muted">
                            Dose · {ingredient.dose}　Form · {ingredient.form}
                          </p>
                          <p className="mt-2 text-sm text-fg-muted">
                            Found in:{" "}
                            {foundIn.length
                              ? foundIn
                                  .map((product) => product.name)
                                  .join(", ")
                              : "To be confirmed"}
                          </p>
                          <details className="group mt-2 border-t border-border pt-2">
                            <summary className="inline-flex min-h-11 cursor-pointer list-none items-center font-bold text-fg underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                              <span className="group-open:hidden">
                                Details ↓
                              </span>
                              <span className="hidden group-open:inline">
                                Close ↑
                              </span>
                            </summary>
                            <div className="mt-5 border-t border-border pt-5">
                              <h3 className="font-bold text-fg">What it is.</h3>
                              <p className="mt-1 text-sm text-fg-muted">
                                {ingredient.description.includes("*") ? (
                                  <Claim showDisclaimer>
                                    {ingredient.description}
                                  </Claim>
                                ) : (
                                  ingredient.description
                                )}
                              </p>
                              <h3 className="mt-5 font-bold text-fg">
                                Why we use it.
                              </h3>
                              <p className="mt-1 text-sm text-fg-muted">
                                To be confirmed.
                              </p>
                              <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <dt className="font-bold text-fg">
                                    ALSO CALLED
                                  </dt>
                                  <dd className="mt-1 text-fg-muted">
                                    To be confirmed
                                  </dd>
                                </div>
                                <div>
                                  <dt className="font-bold text-fg">SOURCE</dt>
                                  <dd className="mt-1 text-fg-muted">
                                    To be confirmed
                                  </dd>
                                </div>
                                <div>
                                  <dt className="font-bold text-fg">FORM</dt>
                                  <dd className="mt-1 text-fg-muted">
                                    {ingredient.form}
                                  </dd>
                                </div>
                                <div>
                                  <dt className="font-bold text-fg">
                                    TESTED FOR
                                  </dt>
                                  <dd className="mt-1 text-fg-muted">
                                    To be confirmed
                                  </dd>
                                </div>
                              </dl>
                              <p className="mt-4 text-xs text-fg-muted">
                                Sources: To be confirmed.
                              </p>
                              <h3 className="mt-5 font-bold text-fg">
                                DOSE BY PRODUCT
                              </h3>
                              {foundIn.length ? (
                                <ul className="mt-2 space-y-2 text-sm text-fg-muted">
                                  {foundIn.map((product) => (
                                    <li key={product.href}>
                                      {product.name} · {product.format} ·{" "}
                                      {product.dose} per serving
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="mt-2 text-sm text-fg-muted">
                                  To be confirmed
                                </p>
                              )}
                              <h3 className="mt-5 font-bold text-fg">
                                FOUND IN
                              </h3>
                              {foundIn.length ? (
                                <ul className="mt-2 grid gap-3 sm:grid-cols-2">
                                  {foundIn.map((product) => (
                                    <li
                                      key={product.href}
                                      className="rounded-field border border-border p-4"
                                    >
                                      <p className="font-bold text-fg">
                                        {product.name}
                                      </p>
                                      <p className="mt-1 text-sm text-fg-muted">
                                        {product.price}
                                      </p>
                                      <Link
                                        href={product.href}
                                        className="mt-2 inline-flex min-h-11 items-center font-bold text-fg underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                                      >
                                        Shop →
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="mt-2 text-sm text-fg-muted">
                                  To be confirmed
                                </p>
                              )}
                            </div>
                          </details>
                        </article>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
          </div>
        ) : (
          <p className="rounded-card border border-border bg-bg-elevated p-6 text-fg-muted">
            To be confirmed
          </p>
        )}
        <button
          type="button"
          disabled={visibleCount >= filteredEntries.length}
          onClick={() => setVisibleCount((count) => count + initialBatchSize)}
          className="mt-8 min-h-11 rounded-pill border border-border px-6 font-bold text-fg enabled:hover:bg-bg-elevated disabled:cursor-not-allowed disabled:text-fg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Load more ingredients
        </button>
      </section>

      <section
        aria-labelledby="lab-results-heading"
        className="mt-14 rounded-card bg-bg-elevated p-6 sm:flex sm:items-center sm:justify-between sm:p-8"
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
            To be confirmed
          </p>
          <h2
            id="lab-results-heading"
            className="mt-2 font-archivo text-2xl font-extrabold uppercase text-fg"
          >
            To be confirmed
          </h2>
          <p className="mt-2 text-sm text-fg-muted">To be confirmed.</p>
        </div>
        <Link
          href="/lab-results"
          className="mt-4 inline-flex min-h-11 items-center rounded-pill bg-fg px-6 font-bold text-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:mt-0"
        >
          See lab results
        </Link>
      </section>

      <aside className="mt-10 border-t border-border py-6 text-xs text-fg-muted">
        *These statements have not been evaluated by the Food and Drug
        Administration. These products are not intended to diagnose, treat, cure
        or prevent any disease. Ingredient information is educational and is not
        medical advice. Talk to your doctor before starting any supplement.
      </aside>
    </div>
  );
}
