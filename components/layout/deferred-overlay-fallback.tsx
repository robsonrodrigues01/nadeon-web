"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";

interface DeferredOverlayContextValue {
  label: string;
  onEscape: () => void;
  returnFocusRef: RefObject<HTMLElement | null>;
}

const DeferredOverlayContext =
  createContext<DeferredOverlayContextValue | null>(null);

export function DeferredOverlayBoundary({
  label,
  onEscape,
  returnFocusRef: providedReturnFocusRef,
  children,
}: {
  label: string;
  onEscape: () => void;
  returnFocusRef?: RefObject<HTMLElement | null>;
  children: ReactNode;
}) {
  const localReturnFocusRef = useRef<HTMLElement | null>(null);
  const returnFocusRef = providedReturnFocusRef ?? localReturnFocusRef;

  return (
    <DeferredOverlayContext.Provider
      value={{ label, onEscape, returnFocusRef }}
    >
      {children}
    </DeferredOverlayContext.Provider>
  );
}

export function useDeferredOverlayReturnFocus() {
  const context = useContext(DeferredOverlayContext);
  if (!context) {
    throw new Error("Deferred overlay must be inside its boundary");
  }
  return context.returnFocusRef;
}

export function DeferredOverlayFallback() {
  const context = useContext(DeferredOverlayContext);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!context) return;

    context.returnFocusRef.current ??= document.activeElement as HTMLElement;
    dialogRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        context.onEscape();
        context.returnFocusRef.current?.focus();
      } else if (event.key === "Tab") {
        event.preventDefault();
        dialogRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [context]);

  if (!context) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Loading ${context.label}`}
        tabIndex={-1}
        className="w-full max-w-sm rounded-card border border-border bg-bg-elevated p-6 text-fg shadow-elevated outline-none"
      >
        <p role="status" aria-live="polite">
          Loading {context.label}
        </p>
      </div>
    </div>
  );
}
