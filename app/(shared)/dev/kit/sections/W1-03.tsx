import React from "react";
import { Header } from "@/components/layout/header";

export default function W103Section() {
  return (
    <section
      aria-labelledby="section-w1-03-title"
      className="mb-16 border-t border-border pt-10"
    >
      <div className="mb-6">
        <span className="label inline-block rounded-full bg-border px-3 py-1 text-fg-muted font-bold text-xs uppercase tracking-wider mb-2">
          Task W1-03 · Global Header
        </span>
        <h2
          id="section-w1-03-title"
          className="title text-2xl sm:text-3xl font-black uppercase text-fg"
        >
          Global Navigation Header
        </h2>
        <p className="lead text-fg-muted text-sm sm:text-base mt-1 max-w-3xl">
          Semantic header with responsive mobile drawer navigation, responsive
          line switching, dynamic cart counter bound to the CartProvider
          contract, and theme support across Human and Pet lines.
        </p>
      </div>

      <div className="space-y-10">
        {/* Human Line Variant */}
        <div className="rounded-card border border-border overflow-hidden bg-bg-elevated p-1 shadow-card">
          <div className="p-4 border-b border-border bg-bg-elevated flex items-center justify-between">
            <div>
              <h3 className="font-archivo text-base font-bold text-fg uppercase tracking-wide">
                Human Line Header (Dark Theme)
              </h3>
              <p className="text-xs text-fg-muted mt-0.5">
                Navigation: Shop, Science, Quiz, Subscribe, About · Line Switch:
                Shop Pet → · Gold pill cart
              </p>
            </div>
            <span className="label text-xs uppercase px-2.5 py-1 rounded-full bg-border text-fg font-bold">
              Variant: Human
            </span>
          </div>

          <div
            data-theme="human"
            className="bg-bg text-fg overflow-hidden rounded-b-card"
          >
            <Header variant="human" initialCartCount={0} />
          </div>
        </div>

        {/* Pet Line Variant */}
        <div className="rounded-card border border-border overflow-hidden bg-bg p-1 shadow-card">
          <div className="p-4 border-b border-border bg-bg-elevated flex items-center justify-between">
            <div>
              <h3 className="font-archivo text-base font-bold text-fg uppercase tracking-wide">
                Pet Line Header (Cream Theme)
              </h3>
              <p className="text-xs text-fg-muted mt-0.5">
                Navigation: Dogs, Cats, Horses, Quiz, Subscribe, About · Line
                Switch: Shop Human → · Espresso pill cart
              </p>
            </div>
            <span className="label text-xs uppercase px-2.5 py-1 rounded-full bg-border text-fg font-bold">
              Variant: Pet
            </span>
          </div>

          <div
            data-theme="pet"
            className="bg-bg text-fg overflow-hidden rounded-b-card"
          >
            <Header variant="pet" initialCartCount={3} />
          </div>
        </div>
      </div>
    </section>
  );
}
