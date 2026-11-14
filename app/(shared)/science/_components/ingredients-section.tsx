import React from "react";
import { Button } from "@/components/ui/button";
import { Claim } from "@/components/commerce/product-card/claim";
import type { IngredientCard } from "./ingredient-data";

const sectionClass =
  "w-full bg-bg text-fg py-14 sm:py-20 border-b border-border";
const eyebrowClass =
  "text-xs font-semibold uppercase tracking-widest text-fg-muted";

export function IngredientsSection({
  ingredients,
}: {
  ingredients: IngredientCard[];
}) {
  return (
    <section
      id="ingredients"
      aria-labelledby="ingredients-title"
      className={sectionClass}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 space-y-10">
        <div className="space-y-3">
          <p className={eyebrowClass}>Ingredient deep dives</p>
          <h2
            id="ingredients-title"
            className="font-archivo font-extrabold uppercase text-3xl sm:text-4xl text-fg"
          >
            Four ingredients, explained
          </h2>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {ingredients.map((ingredient) => (
            <li key={ingredient.id}>
              <article className="h-full rounded-card border border-border bg-bg-elevated p-6 space-y-5">
                <header className="space-y-2">
                  {ingredient.featured && (
                    <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                      {ingredient.featured.name} ·{" "}
                      {ingredient.featured.technicalName}
                    </p>
                  )}
                  <h3 className="font-archivo font-extrabold text-2xl text-fg">
                    {ingredient.title}
                  </h3>
                  <p className="text-sm text-fg-muted">{ingredient.subtitle}</p>
                </header>

                <div className="space-y-1">
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
                    What it is
                  </h4>
                  <p className="text-base text-fg leading-relaxed">
                    {ingredient.whatItIs}
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
                    Why we use it
                  </h4>
                  <p className="text-base text-fg leading-relaxed">
                    <Claim>{ingredient.whyWeUse}</Claim>
                  </p>
                </div>

                {ingredient.findIn.length > 0 && (
                  <div className="space-y-1">
                    <h4 className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
                      Find it in
                    </h4>
                    <ul className="flex flex-wrap gap-2">
                      {ingredient.findIn.map((name) => (
                        <li
                          key={name}
                          className="rounded-pill border border-border px-3 py-1 text-sm text-fg"
                        >
                          {name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="/search" variant="primary">
            Shop by ingredient
          </Button>
          <Button href="/human/shop" variant="secondary">
            Compare formulas
          </Button>
        </div>
      </div>
    </section>
  );
}
