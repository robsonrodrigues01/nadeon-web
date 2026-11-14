import React from "react";
import Link from "next/link";

// Estado vazio sem busca de best sellers: o catálogo não tem ranking de vendas.
export function CartEmpty() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-16 sm:py-24 text-center">
      <h1 className="font-archivo font-extrabold uppercase text-3xl sm:text-4xl text-fg">
        Your cart is empty
      </h1>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/human/quiz"
          className="inline-flex min-h-11 items-center rounded-pill bg-gradient-gold px-6 py-3 text-sm font-bold text-accent-fg hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Take the quiz
        </Link>
      </div>
    </div>
  );
}
