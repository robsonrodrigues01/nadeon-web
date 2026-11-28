"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cartProvider } from "@/lib/providers/client";
import type { OrderLine } from "@/lib/contracts/account";
import { Button } from "@/components/ui/button";

export function ReorderButton({ lines }: { lines: OrderLine[] }) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function reorder() {
    try {
      await cartProvider.addLines(lines);
      router.push("/cart");
    } catch {
      setMessage("Unable to add items to cart");
    }
  }

  return (
    <>
      <Button variant="primary" size="sm" onClick={reorder}>
        Reorder
      </Button>
      {message && (
        <span
          role="status"
          aria-live="polite"
          className="text-sm text-fg-muted"
        >
          {message}
        </span>
      )}
    </>
  );
}
