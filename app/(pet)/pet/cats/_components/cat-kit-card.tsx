"use client";

import { useState } from "react";
import { cartProvider } from "@/lib/providers/client";
import { Button } from "@/components/ui/button";
import { Claim } from "@/components/commerce/product-card/claim";
import { formatPrice, type CatKitView } from "./cat-query";

export interface CatKitCardProps {
  kit: CatKitView;
  locale: string;
}

export function CatKitCard({ kit, locale }: CatKitCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [failed, setFailed] = useState(false);

  async function addKit() {
    setIsAdding(true);
    setFailed(false);
    try {
      await cartProvider.addLines(kit.lines);
    } catch {
      setFailed(true);
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <article
      className="flex flex-col justify-between gap-4 rounded-card border border-border bg-bg-elevated p-5 shadow-card"
      aria-labelledby={`kit-${kit.slug}`}
    >
      <div>
        <p className="label mb-2 text-xs font-bold uppercase tracking-wider text-fg-muted">
          {kit.formats.join(" · ")}
        </p>
        <p className="text-sm font-semibold text-fg-muted">
          {kit.productNames.join(" + ")}
        </p>
        <h3
          id={`kit-${kit.slug}`}
          className="title mt-1 text-xl font-extrabold uppercase tracking-tight text-fg"
        >
          {kit.name}
        </h3>
        <p className="mt-2 text-xs text-fg-muted">
          <Claim>{kit.description}</Claim>
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-lg font-extrabold text-fg">
            {formatPrice(kit.price, locale)}
          </span>
          {kit.compareAtPrice && (
            <s className="text-sm text-fg-muted">
              {formatPrice(kit.compareAtPrice, locale)}
            </s>
          )}
          {kit.savePercent !== null && (
            <span className="text-sm font-semibold text-accent">
              Save {kit.savePercent}%
            </span>
          )}
        </div>
        <Button
          type="button"
          variant="primary"
          isLoading={isAdding}
          onClick={addKit}
          className="w-full"
        >
          Add kit
        </Button>
        {failed && (
          <p role="status" className="text-sm text-accent">
            Failed to add to cart
          </p>
        )}
      </div>
    </article>
  );
}
