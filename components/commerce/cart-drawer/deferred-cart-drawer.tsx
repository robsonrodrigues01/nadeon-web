"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useCartDrawerStore } from "./use-cart-drawer";
import {
  DeferredOverlayBoundary,
  DeferredOverlayFallback,
  useDeferredOverlayReturnFocus,
} from "@/components/layout/deferred-overlay-fallback";

const LazyCartDrawer = dynamic(
  () => import("./cart-drawer").then((module) => module.CartDrawer),
  {
    ssr: false,
    loading: () => <DeferredOverlayFallback />,
  }
);

function LoadedCartDrawer({
  isOpen,
  theme,
}: {
  isOpen: boolean;
  theme: "human" | "pet";
}) {
  const returnFocusRef = useDeferredOverlayReturnFocus();
  return (
    <LazyCartDrawer
      isOpen={isOpen}
      theme={theme}
      returnFocusRef={returnFocusRef}
    />
  );
}

export function DeferredCartDrawer({ theme }: { theme: "human" | "pet" }) {
  const isOpen = useCartDrawerStore((state) => state.isOpen);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const [hasOpened, setHasOpened] = useState(
    () => useCartDrawerStore.getState().isOpen
  );

  useEffect(() => {
    return useCartDrawerStore.subscribe((state, previousState) => {
      if (state.isOpen && !previousState.isOpen) {
        returnFocusRef.current = document.activeElement as HTMLElement;
        setHasOpened(true);
      }
    });
  }, []);

  return hasOpened && isOpen ? (
    <DeferredOverlayBoundary
      label="cart"
      returnFocusRef={returnFocusRef}
      onEscape={() => useCartDrawerStore.getState().close()}
    >
      <LoadedCartDrawer isOpen={isOpen} theme={theme} />
    </DeferredOverlayBoundary>
  ) : null;
}
