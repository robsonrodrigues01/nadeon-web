"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useCartDrawerStore } from "./use-cart-drawer";

const LazyCartDrawer = dynamic(
  () => import("./cart-drawer").then((module) => module.CartDrawer),
  {
    ssr: false,
    loading: () => (
      <span className="sr-only" role="status" aria-live="polite">
        Opening cart
      </span>
    ),
  }
);

export function DeferredCartDrawer({ theme }: { theme: "human" | "pet" }) {
  const isOpen = useCartDrawerStore((state) => state.isOpen);
  const [hasOpened, setHasOpened] = useState(
    () => useCartDrawerStore.getState().isOpen
  );

  useEffect(() => {
    return useCartDrawerStore.subscribe((state) => {
      if (state.isOpen) setHasOpened(true);
    });
  }, []);

  return hasOpened ? <LazyCartDrawer isOpen={isOpen} theme={theme} /> : null;
}
