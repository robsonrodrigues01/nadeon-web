import React from "react";
import { catalogProvider } from "@/lib/providers";
import { getQuiz } from "@/lib/quiz";
import { QuizWizard } from "@/components/commerce/quiz/quiz-wizard";

export default async function W1_15Section() {
  const [products, kits] = await Promise.all([
    catalogProvider.getProducts(),
    catalogProvider.getKits(),
  ]);

  const productsMap = Object.fromEntries(products.map((p) => [p.slug, p]));
  const kitsMap = Object.fromEntries(kits.map((k) => [k.slug, k]));

  const humanQuiz = getQuiz("human");
  const dogQuiz = getQuiz("dog");

  if (!humanQuiz || !dogQuiz) {
    return null;
  }

  return (
    <section
      id="w1-15-showcase"
      aria-labelledby="w1-15-heading"
      className="space-y-12 py-8"
    >
      {/* Section Header */}
      <div className="border-b border-border pb-6">
        <div className="flex items-center gap-3">
          <span className="label rounded-pill bg-accent/20 px-3 py-1 text-xs font-bold text-accent">
            Task W1-15
          </span>
          <span className="text-xs font-medium text-fg-muted uppercase tracking-wider">
            Wave 1 Commerce Component Showcase
          </span>
        </div>
        <h2
          id="w1-15-heading"
          className="title text-3xl font-extrabold uppercase tracking-tight text-fg mt-2"
        >
          Quiz Engine &amp; Routine Builder
        </h2>
        <p className="text-sm text-fg-muted mt-2 max-w-3xl leading-relaxed">
          Interactive multi-step routine and plan builders for Nadeon Human and
          Nadeon Pet. Pure recommendation engine matching user answers to
          clinically formulated kits, weight-based pet dosing, automatic
          analyzing transitions, and accessible semantic controls.
        </p>
      </div>

      {/* Human Line Showcase */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-3">
          <div>
            <span className="label inline-block rounded-pill bg-accent/20 px-2.5 py-0.5 text-xs font-bold text-accent uppercase tracking-wider">
              Human Line
            </span>
            <h3 className="text-xl font-bold text-fg mt-1">
              Personalized NAD+ Routine Quiz
            </h3>
          </div>
          <span className="text-xs text-fg-muted">
            5 questions · Dynamic minutes calculation · Dark theme
          </span>
        </div>

        <div
          data-theme="human"
          className="rounded-card border border-border bg-bg p-4 sm:p-8"
        >
          <QuizWizard
            initialQuiz={humanQuiz}
            productsMap={productsMap}
            kitsMap={kitsMap}
            locale="en-US"
          />
        </div>
      </div>

      {/* Pet Line Showcase */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-3">
          <div>
            <span className="label inline-block rounded-pill bg-accent/20 px-2.5 py-0.5 text-xs font-bold text-accent uppercase tracking-wider">
              Pet Line
            </span>
            <h3 className="text-xl font-bold text-fg mt-1">
              Dog, Cat &amp; Horse Longevity Plan Quiz
            </h3>
          </div>
          <span className="text-xs text-fg-muted">
            Species selector · Weight dosing · Light theme
          </span>
        </div>

        <div
          data-theme="pet"
          className="rounded-card border border-border bg-bg p-4 sm:p-8"
        >
          <QuizWizard
            initialQuiz={dogQuiz}
            productsMap={productsMap}
            kitsMap={kitsMap}
            locale="en-US"
          />
        </div>
      </div>
    </section>
  );
}
