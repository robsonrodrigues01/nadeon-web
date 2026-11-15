import React from "react";
import type { Product } from "@/lib/contracts/catalog";
import type { Market } from "@/lib/market/types";
import { formatMoneyWithMarket } from "@/lib/market/formatter";
import { getProductSubscriptionDiscount } from "./plan-utils";

interface WhatYouSaveProps {
  products: Product[];
  market: Market;
}

interface ItemSaving {
  slug: string;
  name: string;
  subtitle: string;
  colorClass: string;
  product: Product;
  discountPercentage: number | null;
  intervalDays: number;
  oneTimeAmount: number;
  subscribeAmount: number;
  yearlySavedAmount: number;
}

const PRODUCT_COLORS: Record<string, string> = {
  "more-good-years": "bg-product-mint",
  "golden-years": "bg-product-amber",
  "good-days": "bg-product-coral",
  "high-jump": "bg-product-sky",
  "still-sharp": "bg-product-sky",
  "shine-on": "bg-product-coral",
  "second-wind": "bg-product-amber",
  "more-good-years-oil": "bg-product-mint",
  "golden-years-oil": "bg-product-amber",
  "still-sharp-oil": "bg-product-sky",
  "shine-on-oil": "bg-product-coral",
  "purr-mode": "bg-product-sky",
  "long-stride": "bg-product-amber",
};

export function WhatYouSave({ products, market }: WhatYouSaveProps) {
  const savings: ItemSaving[] = products.flatMap((p) => {
    const singleVariant = p.variants.find((v) => v.jars === 1) ?? p.variants[0];
    if (!singleVariant) return [];

    const plans = p.sellingPlans ?? [];
    if (plans.length === 0) return [];

    const primaryPlan = plans.find((sp) => sp.intervalDays === 30) ?? plans[0];
    const discount = getProductSubscriptionDiscount(p);
    const intervalDays = primaryPlan.intervalDays;
    const oneTime = singleVariant.price.amount;
    const subscribe =
      discount !== null && discount > 0
        ? oneTime * (1 - discount / 100)
        : oneTime;
    const deliveriesPerYear =
      intervalDays > 0 ? Math.round(365 / intervalDays) : 12;
    const yearlySaved = (oneTime - subscribe) * deliveriesPerYear;

    return [
      {
        slug: p.slug,
        name: p.name,
        subtitle: p.technicalName || "",
        colorClass: PRODUCT_COLORS[p.slug] ?? "bg-accent",
        product: p,
        discountPercentage: discount,
        intervalDays,
        oneTimeAmount: oneTime,
        subscribeAmount: subscribe,
        yearlySavedAmount: yearlySaved,
      },
    ];
  });

  if (savings.length === 0) {
    return (
      <section
        aria-labelledby="what-you-save-heading"
        className="border-b border-border bg-bg py-16 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 text-center">
          <div className="text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">
              THE MATH
            </span>
            <h2
              id="what-you-save-heading"
              className="mt-3 font-sans text-3xl font-extrabold uppercase tracking-tight text-fg sm:text-4xl lg:text-5xl"
            >
              What you save
            </h2>
          </div>
          <div
            data-testid="what-you-save-empty"
            className="mt-10 rounded-2xl border border-border bg-bg-elevated p-8 text-center text-fg-muted"
          >
            No subscription plans available at this time.
          </div>
        </div>
      </section>
    );
  }

  const baseInterval = savings[0]?.intervalDays;

  return (
    <section
      aria-labelledby="what-you-save-heading"
      className="border-b border-border bg-bg py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-accent">
            THE MATH
          </span>
          <h2
            id="what-you-save-heading"
            className="mt-3 font-sans text-3xl font-extrabold uppercase tracking-tight text-fg sm:text-4xl lg:text-5xl"
          >
            What you save
          </h2>
        </div>

        {/* Desktop Table Header */}
        <div className="mt-10 hidden grid-cols-12 items-center px-6 pb-3 text-xs font-bold uppercase tracking-wider text-fg-muted md:grid">
          <div className="col-span-5">Product</div>
          <div className="col-span-2 text-right">One-time</div>
          <div className="col-span-2 text-right">Subscribe</div>
          <div className="col-span-3 text-right">Saved per year</div>
        </div>

        {/* Rows (Table on Desktop, Cards on Mobile) */}
        <div className="space-y-4">
          {savings.map((item) => {
            const formattedOneTime = formatMoneyWithMarket(
              item.oneTimeAmount,
              market
            );
            const formattedSubscribe = formatMoneyWithMarket(
              item.subscribeAmount,
              market
            );
            const formattedYearly = formatMoneyWithMarket(
              item.yearlySavedAmount,
              market
            );

            return (
              <div
                key={item.slug}
                className="rounded-2xl border border-border bg-bg-elevated p-4 shadow-card transition sm:p-5 md:grid md:grid-cols-12 md:items-center md:px-7 md:py-4"
              >
                {/* Product Column */}
                <div className="flex items-center gap-4 md:col-span-5">
                  <div
                    className="flex h-14 w-12 flex-shrink-0 flex-col items-center justify-end"
                    aria-hidden="true"
                  >
                    <div className="h-2 w-8 rounded-t bg-fg" />
                    <div className="flex h-11 w-11 flex-col items-center justify-center overflow-hidden rounded border border-border bg-bg-elevated">
                      <div
                        className={`h-3/5 w-full ${item.colorClass} flex items-center justify-center`}
                      >
                        <span className="text-[6px] font-extrabold text-fg">
                          ●
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-sans text-base font-extrabold uppercase tracking-tight text-fg sm:text-lg">
                      {item.name}
                    </h3>
                    {item.subtitle ? (
                      <p className="text-xs text-fg-muted">{item.subtitle}</p>
                    ) : null}
                  </div>
                </div>

                {/* Mobile: Price Breakdown */}
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3 md:hidden">
                  <div>
                    <span className="mr-2 text-sm text-fg-muted line-through">
                      {formattedOneTime}
                    </span>
                    <span className="text-base font-extrabold text-fg">
                      {formattedSubscribe}
                    </span>
                    <span className="text-xs text-fg-muted"> / delivery</span>
                  </div>
                  <div className="text-right">
                    <span className="font-sans text-lg font-extrabold text-fg">
                      {formattedYearly}
                    </span>
                    <div className="text-[11px] text-fg-muted">
                      saved / year
                    </div>
                  </div>
                </div>

                {/* Desktop: Columns */}
                <div className="col-span-2 hidden text-right text-sm text-fg-muted line-through md:block">
                  {formattedOneTime}
                </div>
                <div className="col-span-2 hidden text-right text-base font-extrabold text-fg md:block">
                  {formattedSubscribe}
                </div>
                <div className="col-span-3 hidden text-right font-sans text-xl font-extrabold text-fg md:block">
                  {formattedYearly}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-left text-xs text-fg-muted">
          {baseInterval
            ? `Yearly savings assume delivery every ${baseInterval} days. `
            : ""}
          Final prices are set at launch.
        </p>
      </div>
    </section>
  );
}
