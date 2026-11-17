"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/contracts/catalog";
import { cartProvider } from "@/lib/providers/client";
import { Button } from "@/components/ui/button";

export function ConcernProductCard({
  product,
  price,
}: {
  product: Product;
  price: string;
}) {
  const [adding, setAdding] = useState(false);
  const [feedback, setFeedback] = useState("");
  const variant = product.variants[0];

  async function addToCart() {
    if (!variant) return;
    setAdding(true);
    try {
      await cartProvider.addLines([{ variantId: variant.id, quantity: 1 }]);
      setFeedback("Added to cart");
    } catch {
      setFeedback("To be confirmed.");
    } finally {
      setAdding(false);
    }
  }

  return (
    <article className="flex min-h-64 flex-col justify-between rounded-card border border-border bg-bg-elevated p-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-accent">
          {product.format}
        </p>
        <h3 className="mt-3 font-archivo text-xl font-extrabold uppercase text-fg">
          <Link
            href={`/pet/products/${product.slug}`}
            className="rounded-sm underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {product.name}
          </Link>
        </h3>
      </div>
      <div className="mt-6">
        <p className="mb-3 text-lg font-extrabold text-fg">{price}</p>
        <Button
          type="button"
          variant="primary"
          isLoading={adding}
          loadingText="Add to cart"
          disabled={!variant}
          onClick={addToCart}
          aria-label={`Add ${product.name} to cart`}
        >
          Add to cart
        </Button>
        {product.sellingPlans[0] && (
          <Link
            href="/pet/subscribe"
            className="mt-2 inline-flex min-h-11 items-center text-sm font-bold underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Subscribe &amp; save {product.sellingPlans[0].discountPercentage}%
          </Link>
        )}
        <p role="status" className="mt-2 min-h-5 text-xs text-fg-muted">
          {feedback}
        </p>
      </div>
    </article>
  );
}
