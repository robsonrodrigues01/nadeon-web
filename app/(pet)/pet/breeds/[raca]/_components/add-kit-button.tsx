"use client";

import React, { useState, useTransition } from "react";
import { cartProvider } from "@/lib/providers/client";

interface AddKitButtonProps {
  kitSlug?: string;
  className?: string;
}

export function AddKitButton({
  kitSlug = "chew-oil",
  className,
}: AddKitButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    startTransition(async () => {
      try {
        await cartProvider.addKit(kitSlug, 1);
        setAdded(true);
        setTimeout(() => setAdded(false), 2500);
      } catch (err) {
        console.error("Failed to add kit to cart:", err);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={
        className ??
        "min-h-12 py-3 px-8 rounded-full bg-fg text-bg font-extrabold text-sm sm:text-base hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-sm text-center disabled:opacity-50"
      }
    >
      {isPending ? "Adding..." : added ? "Added to cart ✓" : "Add kit to cart"}
    </button>
  );
}
