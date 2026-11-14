"use client";

import { create } from "zustand";
import { useEffect } from "react";

interface CartDrawerStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  theme: "human" | "pet";
  setTheme: (theme: "human" | "pet") => void;
}

export const useCartDrawerStore = create<CartDrawerStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  theme: "human",
  setTheme: (theme: "human" | "pet") => set({ theme }),
}));

export const OPEN_CART_EVENT = "nadeon:open-cart";
export const CLOSE_CART_EVENT = "nadeon:close-cart";
export const TOGGLE_CART_EVENT = "nadeon:toggle-cart";

export function openCartDrawer(theme?: "human" | "pet") {
  if (theme) {
    useCartDrawerStore.getState().setTheme(theme);
  }
  useCartDrawerStore.getState().open();
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(OPEN_CART_EVENT, { detail: { theme } })
    );
  }
}

export function closeCartDrawer() {
  useCartDrawerStore.getState().close();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CLOSE_CART_EVENT));
  }
}

export function toggleCartDrawer() {
  useCartDrawerStore.getState().toggle();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(TOGGLE_CART_EVENT));
  }
}

export function useCartDrawer() {
  const isOpen = useCartDrawerStore((state) => state.isOpen);
  const open = useCartDrawerStore((state) => state.open);
  const close = useCartDrawerStore((state) => state.close);
  const toggle = useCartDrawerStore((state) => state.toggle);
  const theme = useCartDrawerStore((state) => state.theme);
  const setTheme = useCartDrawerStore((state) => state.setTheme);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme?: "human" | "pet" }>;
      if (customEvent.detail?.theme) {
        setTheme(customEvent.detail.theme);
      }
      open();
    };

    const handleClose = () => {
      close();
    };

    const handleToggle = () => {
      toggle();
    };

    window.addEventListener(OPEN_CART_EVENT, handleOpen);
    window.addEventListener(CLOSE_CART_EVENT, handleClose);
    window.addEventListener(TOGGLE_CART_EVENT, handleToggle);

    return () => {
      window.removeEventListener(OPEN_CART_EVENT, handleOpen);
      window.removeEventListener(CLOSE_CART_EVENT, handleClose);
      window.removeEventListener(TOGGLE_CART_EVENT, handleToggle);
    };
  }, [open, close, toggle, setTheme]);

  return {
    isOpen,
    open,
    close,
    toggle,
    theme,
    setTheme,
  };
}
