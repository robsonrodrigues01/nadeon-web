import React from "react";
import type { Product } from "@/lib/contracts/catalog";
import type { Market } from "@/lib/market/types";
import { formatMoneyWithMarket } from "@/lib/market/formatter";
import { getProductSubscriptionDiscount } from "./plan-utils";

export interface MathComparisonProps {
  products: Product[];
  market: Market;
}

interface MathItem {
  key: string;
  slug: string;
  name: string;
  technicalName?: string;
  format: string;
  discountPercentage: number;
  oneTimeMoStr: string;
  subMoStr: string;
  oneTimeYrStr: string;
  subYrStr: string;
  savedYrStr: string;
}

export function MathComparison({ products, market }: MathComparisonProps) {
  const items: MathItem[] = products.flatMap((product, idx) => {
    const singleVariant =
      product.variants.find((v) => v.jars === 1) ?? product.variants[0];
    if (!singleVariant) return [];

    const discountPercentage = getProductSubscriptionDiscount(product);
    const factor = (100 - discountPercentage) / 100;

    const baseAmount = singleVariant.price.amount;
    const oneTimeMo = baseAmount;
    const subMo = baseAmount * factor;
    const oneTimeYr = baseAmount * 12;
    const subYr = subMo * 12;
    const savedYr = oneTimeYr - subYr;

    return [
      {
        key: product.slug || `product-${idx}`,
        slug: product.slug,
        name: product.name,
        technicalName: product.technicalName,
        format: product.format,
        discountPercentage,
        oneTimeMoStr: formatMoneyWithMarket(oneTimeMo, market),
        subMoStr: formatMoneyWithMarket(subMo, market),
        oneTimeYrStr: formatMoneyWithMarket(oneTimeYr, market),
        subYrStr: formatMoneyWithMarket(subYr, market),
        savedYrStr: formatMoneyWithMarket(savedYr, market),
      },
    ];
  });

  return (
    <section
      aria-labelledby="math-comparison-title"
      className="w-full border-b border-border bg-bg-elevated text-fg py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-accent">
            THE MATH
          </span>
          <h2
            id="math-comparison-title"
            className="mt-3 font-archivo text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-fg"
          >
            What you save
          </h2>
        </div>

        {/* Desktop Table */}
        <div className="mt-12 hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-xs font-bold uppercase tracking-wider text-fg-muted">
                <th scope="col" className="pb-4 pl-4">
                  Formula
                </th>
                <th scope="col" className="pb-4">
                  One-time / mo
                </th>
                <th scope="col" className="pb-4">
                  Subscribe / mo
                </th>
                <th scope="col" className="pb-4">
                  One-time / yr
                </th>
                <th scope="col" className="pb-4">
                  Subscribe / yr
                </th>
                <th scope="col" className="pb-4 pr-4 text-accent">
                  You save / yr
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((item) => (
                <tr key={item.key} className="hover:bg-bg/40 transition-colors">
                  <td className="py-4 pl-4">
                    <div className="font-bold text-fg text-base">
                      {item.name}
                    </div>
                    {item.technicalName && (
                      <div className="text-xs text-fg-muted">
                        {item.technicalName}
                      </div>
                    )}
                  </td>
                  <td className="py-4 text-sm text-fg-muted">
                    {item.oneTimeMoStr}
                  </td>
                  <td className="py-4 text-sm font-semibold text-fg">
                    {item.subMoStr}
                  </td>
                  <td className="py-4 text-sm text-fg-muted">
                    {item.oneTimeYrStr}
                  </td>
                  <td className="py-4 text-sm font-semibold text-fg">
                    {item.subYrStr}
                  </td>
                  <td className="py-4 pr-4 text-sm font-bold text-accent">
                    {item.savedYrStr}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="mt-8 grid grid-cols-1 gap-4 md:hidden">
          {items.map((item) => (
            <div
              key={item.key}
              className="rounded-card border border-border bg-bg p-5 shadow-card"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-base text-fg">{item.name}</h3>
                  {item.technicalName && (
                    <p className="text-xs text-fg-muted">
                      {item.technicalName}
                    </p>
                  )}
                </div>
                <span className="shrink-0 rounded-full bg-accent/20 px-3 py-1 text-xs font-bold text-accent">
                  {item.savedYrStr} / yr
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-3 text-xs">
                <div>
                  <span className="block font-medium text-fg-muted">
                    One-time
                  </span>
                  <span className="font-semibold text-fg">
                    {item.oneTimeMoStr} / mo
                  </span>
                  <span className="block text-[11px] text-fg-muted">
                    {item.oneTimeYrStr} / yr
                  </span>
                </div>
                <div>
                  <span className="block font-medium text-accent">
                    Subscribe ({item.discountPercentage}% off)
                  </span>
                  <span className="font-semibold text-fg">
                    {item.subMoStr} / mo
                  </span>
                  <span className="block text-[11px] text-fg-muted">
                    {item.subYrStr} / yr
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-fg-muted">
          Assumes one jar per month (30 servings). Shipping is free on every
          subscription delivery.
        </p>
      </div>
    </section>
  );
}
