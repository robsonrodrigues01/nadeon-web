"use client";

import React, { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FaqCategory, FaqCategoryTab, FaqEntry } from "./faq-content";

interface FaqBrowserProps {
  entries: FaqEntry[];
  categories: FaqCategoryTab[];
  // Cabeçalho do hero (pill, título e subtítulo), vindo do Server Component.
  children?: ReactNode;
  // Coluna lateral complementar (Still stuck?), só no desktop.
  aside?: ReactNode;
}

function countLabel(n: number): string {
  return `${n} ${n === 1 ? "question" : "questions"}`;
}

export function FaqBrowser({
  entries,
  categories,
  children,
  aside,
}: FaqBrowserProps) {
  const firstTab: FaqCategory =
    categories.find((c) => entries.some((e) => e.category === c.id))?.id ??
    categories[0].id;

  const [tab, setTab] = useState<FaqCategory>(firstTab);
  const [draft, setDraft] = useState("");
  const [applied, setApplied] = useState("");
  const [openId, setOpenId] = useState<string | null>(
    entries.find((e) => e.category === firstTab)?.id ?? null
  );

  const searching = applied.length > 0;
  const needle = applied.toLowerCase();

  const visible = searching
    ? entries.filter((e) =>
        `${e.question} ${e.answer}`.toLowerCase().includes(needle)
      )
    : entries.filter((e) => e.category === tab);

  const activeLabel = categories.find((c) => c.id === tab)?.label ?? "";

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setApplied(draft.trim());
  }

  function onDraftChange(value: string) {
    setDraft(value);
    // Limpar o campo mostra a aba de novo sem precisar enviar.
    if (value.trim() === "") setApplied("");
  }

  function selectTab(id: FaqCategory) {
    setTab(id);
    setDraft("");
    setApplied("");
    setOpenId(entries.find((e) => e.category === id)?.id ?? null);
  }

  function clearSearch() {
    setDraft("");
    setApplied("");
  }

  return (
    <>
      <section className="border-b border-border bg-bg-elevated text-fg">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
          <div className="text-left sm:text-center">{children}</div>
          <form
            role="search"
            aria-label="Search questions"
            onSubmit={onSubmit}
            className="mx-auto mt-9 flex max-w-xl flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="faq-search" className="sr-only">
              Search questions
            </label>
            <input
              id="faq-search"
              type="search"
              value={draft}
              onChange={(e) => onDraftChange(e.target.value)}
              placeholder='Search questions, e.g. "dose"'
              className="min-h-11 flex-1 rounded-pill border border-border bg-bg px-5 py-3 text-base text-fg placeholder:text-fg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            />
            <Button type="submit" variant="primary" className="min-h-11">
              Search
            </Button>
          </form>
        </div>
      </section>

      <section className="bg-bg text-fg">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16 lg:px-12 lg:py-20">
          <div className="min-w-0">
            <div
              role="tablist"
              aria-label="FAQ categories"
              className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
            >
              {categories.map((c) => {
                const count = entries.filter((e) => e.category === c.id).length;
                const selected = !searching && tab === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="tab"
                    id={`faq-tab-${c.id}`}
                    aria-selected={selected}
                    aria-controls="faq-panel"
                    disabled={count === 0}
                    onClick={() => selectTab(c.id)}
                    className={cn(
                      "min-h-11 shrink-0 rounded-pill border px-5 py-2.5 text-sm font-bold whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-40 sm:text-base",
                      selected
                        ? "border-fg bg-fg text-bg"
                        : "border-border text-fg hover:border-accent"
                    )}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>

            <div
              role="tabpanel"
              id="faq-panel"
              aria-labelledby={searching ? undefined : `faq-tab-${tab}`}
              className="mt-8"
            >
              <div className="flex items-baseline justify-between gap-4">
                {searching ? (
                  <h2 className="font-archivo text-2xl font-extrabold uppercase text-fg sm:text-3xl">
                    Search results
                  </h2>
                ) : (
                  <h2 className="font-archivo text-3xl font-extrabold uppercase text-fg sm:text-4xl">
                    {activeLabel}
                  </h2>
                )}
                <p aria-live="polite" className="text-sm text-fg-muted">
                  {countLabel(visible.length)}
                </p>
              </div>

              {visible.length === 0 ? (
                <div className="mt-8 rounded-card border border-border bg-bg-elevated p-8 text-center">
                  <p className="text-base text-fg-muted">
                    {`No questions found for "${applied}".`}
                  </p>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={clearSearch}
                    className="mt-4 min-h-11"
                  >
                    Clear search
                  </Button>
                </div>
              ) : (
                <ul className="mt-4">
                  {visible.map((e) => {
                    const open = openId === e.id;
                    return (
                      <li key={e.id} className="border-b border-border">
                        <h3>
                          <button
                            type="button"
                            id={`faq-trigger-${e.id}`}
                            aria-expanded={open}
                            aria-controls={`faq-answer-${e.id}`}
                            onClick={() => setOpenId(open ? null : e.id)}
                            onKeyDown={(event) => {
                              if (
                                !event.repeat &&
                                (event.key === "Enter" || event.key === " ")
                              ) {
                                event.preventDefault();
                                setOpenId(open ? null : e.id);
                              }
                            }}
                            className="flex min-h-11 w-full items-center justify-between gap-4 py-5 text-left text-base font-bold text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:text-lg"
                          >
                            <span>{e.question}</span>
                            <span
                              aria-hidden="true"
                              className={cn(
                                "flex size-8 shrink-0 items-center justify-center rounded-full text-xl leading-none transition-colors",
                                open
                                  ? "bg-fg text-bg"
                                  : "border border-border text-fg"
                              )}
                            >
                              {open ? "−" : "+"}
                            </span>
                          </button>
                        </h3>
                        <div
                          id={`faq-answer-${e.id}`}
                          role="region"
                          aria-labelledby={`faq-trigger-${e.id}`}
                          hidden={!open}
                          className="pb-6 pr-12 text-base leading-relaxed text-fg-muted"
                        >
                          {e.answer}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}

              <p className="mt-8 text-xs italic text-fg-muted">
                *These statements have not been evaluated by the FDA.
              </p>
            </div>
          </div>

          <aside
            aria-label="FAQ categories and support"
            className="mt-12 hidden lg:mt-0 lg:flex lg:flex-col lg:gap-6"
          >
            <div className="rounded-card border border-border bg-bg p-6 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-fg-muted">
                Categories
              </h3>
              <ul className="mt-3 divide-y divide-border/60">
                {categories.map((c) => {
                  const count = entries.filter(
                    (e) => e.category === c.id
                  ).length;
                  const active = !searching && tab === c.id;
                  return (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => selectTab(c.id)}
                        className="flex min-h-11 w-full items-center justify-between py-2 text-left text-sm transition-colors hover:text-accent"
                      >
                        <span
                          className={cn(
                            active
                              ? "font-extrabold text-fg"
                              : "font-medium text-fg-muted"
                          )}
                        >
                          {c.label}
                        </span>
                        <span className="text-xs text-fg-muted">{count}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
            {aside}
          </aside>
        </div>
      </section>
    </>
  );
}
