"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cartProvider } from "@/lib/providers/client";

export interface KitAddToCartProps {
  kitName: string;
  kitSlug: string;
  disabled?: boolean;
}

type Status = "idle" | "adding" | "added" | "error";

export function KitAddToCart({
  kitName,
  kitSlug,
  disabled = false,
}: KitAddToCartProps) {
  const [status, setStatus] = useState<Status>("idle");

  const handleClick = async () => {
    setStatus("adding");
    try {
      await cartProvider.addKit(kitSlug, 1);
      setStatus("added");
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <Button
        type="button"
        onClick={handleClick}
        disabled={disabled || status === "adding"}
        isLoading={status === "adding"}
        className="w-full"
      >
        Add kit to cart
      </Button>
      <p role="status" className="text-xs text-fg-muted min-h-4">
        {status === "added" && `Added ${kitName} to cart`}
        {status === "error" && "Failed to add to cart"}
      </p>
    </div>
  );
}
