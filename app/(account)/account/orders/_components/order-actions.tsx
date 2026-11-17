"use client";

import { useState } from "react";
import { cartProvider } from "@/lib/providers/client";
import type { OrderLine } from "@/lib/contracts/account";
import { Button } from "@/components/ui/button";

export interface OrderActionsProps {
  lines?: OrderLine[];
  orderUrl?: string;
  copyLink?: string;
  canReorder?: boolean;
  showBuyAgain?: boolean;
}

export function OrderActions({
  lines,
  orderUrl,
  copyLink,
  canReorder = true,
  showBuyAgain = false,
}: OrderActionsProps) {
  const [message, setMessage] = useState("");

  const effectiveCopyLink = copyLink ?? orderUrl;

  async function buyAgain() {
    if (!canReorder || !lines?.length) return;
    try {
      await cartProvider.addLines(lines);
      setMessage("Added to cart");
    } catch {
      setMessage("Unable to add items to cart");
    }
  }

  async function handleCopyLink() {
    if (!effectiveCopyLink) return;
    try {
      await navigator.clipboard.writeText(
        new URL(effectiveCopyLink, window.location.origin).toString()
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
          disabled={!canReorder || !lines?.length}
          onClick={buyAgain}
        >
          Buy again
        </Button>
      )}
      {effectiveCopyLink && (
        <Button variant="secondary" size="sm" onClick={handleCopyLink}>
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
