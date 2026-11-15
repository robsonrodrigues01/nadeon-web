"use client";

import { useState } from "react";
import { cartProvider } from "@/lib/providers/client";
import type { OrderLine } from "@/lib/contracts/account";
import { Button } from "@/components/ui/button";

export function OrderActions({
  lines,
  orderUrl,
  showBuyAgain = false,
}: {
  lines?: OrderLine[];
  orderUrl?: string;
  showBuyAgain?: boolean;
}) {
  const [message, setMessage] = useState("");

  async function buyAgain() {
    if (!lines?.length) return;
    try {
      await cartProvider.addLines(lines);
      setMessage("Added to cart");
    } catch {
      setMessage("Unable to add items to cart");
    }
  }

  async function copyLink() {
    if (!orderUrl) return;
    try {
      await navigator.clipboard.writeText(
        new URL(orderUrl, window.location.origin).toString()
      );
      setMessage("Link copied");
    } catch {
      setMessage("Unable to copy link");
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {showBuyAgain && (
        <Button
          variant="primary"
          size="sm"
          disabled={!lines?.length}
          onClick={buyAgain}
        >
          Buy again
        </Button>
      )}
      {orderUrl && (
        <Button variant="secondary" size="sm" onClick={copyLink}>
          Copy link
        </Button>
      )}
      {message && (
        <span role="status" aria-live="polite" className="sr-only">
          {message}
        </span>
      )}
    </div>
  );
}
