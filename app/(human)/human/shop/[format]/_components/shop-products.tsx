import type { CatalogSort, Product } from "@/lib/contracts/catalog";
import { ProductCard } from "@/components/commerce/product-card";
import { Button } from "@/components/ui/button";
import type { ShopFormat } from "./format-config";
import { GoalFilter, type GoalFilterItem } from "./goal-filter";
import { SortSelect } from "./sort-select";

export interface ShopProductsProps {
  format: ShopFormat;
  products: Product[];
  sort: CatalogSort;
  goals: GoalFilterItem[];
  activeGoal: string | null;
}

export function ShopProducts({
  format,
  products,
  sort,
  goals,
  activeGoal,
}: ShopProductsProps) {
  const headingId = `shop-${format.slug}-heading`;
  const basePath = `/human/shop/${format.slug}`;

  return (
    <section
      aria-labelledby={headingId}
      className="bg-bg-elevated px-4 py-10 text-fg sm:px-10 lg:px-[72px] lg:py-16"
    >
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
        All {format.label}
      </p>
      <h2
        id={headingId}
        className="title mt-2 text-3xl font-extrabold uppercase leading-none tracking-tight sm:text-5xl"
      >
        Shop {format.label.toLowerCase()}
      </h2>

      {goals.length > 0 && (
        <div className="mt-8">
          <GoalFilter
            basePath={basePath}
            goals={goals}
            active={activeGoal}
            sort={sort}
          />
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-fg-muted">
          {products.length} {format.label.toLowerCase()}
        </p>
        <SortSelect value={sort} goal={activeGoal} />
      </div>

      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {products.map((product) => (
          <li key={product.slug}>
            <ProductCard product={product} className="h-full" />
          </li>
        ))}
        <li>
          <div className="flex h-full flex-col justify-center gap-4 rounded-card border border-dashed border-border p-6">
            <h3 className="title text-xl font-extrabold uppercase leading-tight">
              Compare formulas
            </h3>
            <p className="text-sm text-fg-muted">
              Ingredients, servings and price side by side.
            </p>
            <div>
              <Button href="#compare-formats" variant="secondary">
                Compare
              </Button>
            </div>
          </div>
        </li>
      </ul>
    </section>
  );
}
