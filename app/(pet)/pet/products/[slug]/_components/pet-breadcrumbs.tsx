import React from "react";
import Link from "next/link";
import type { Product } from "@/lib/contracts/catalog";

export interface PetBreadcrumbsProps {
  product: Product;
  className?: string;
}

export function PetBreadcrumbs({
  product,
  className = "",
}: PetBreadcrumbsProps) {
  const speciesLabel =
    product.species === "cat"
      ? "Cats"
      : product.species === "horse"
        ? "Horses"
        : "Dogs";

  const speciesHref =
    product.species === "cat"
      ? "/pet/cats"
      : product.species === "horse"
        ? "/pet/horses"
        : "/pet/dogs";

  return (
    <nav
      aria-label="Breadcrumb"
      className={`text-xs text-fg/70 py-4 ${className}`}
    >
      <ol className="flex items-center gap-2 flex-wrap">
        <li>
          <Link
            href="/pet"
            className="hover:text-fg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm py-1"
          >
            Pet
          </Link>
        </li>
        <li aria-hidden="true" className="opacity-40">
          /
        </li>
        <li>
          <Link
            href={speciesHref}
            className="hover:text-fg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm py-1"
          >
            {speciesLabel}
          </Link>
        </li>
        <li aria-hidden="true" className="opacity-40">
          /
        </li>
        <li>
          <span
            aria-current="page"
            className="font-bold text-fg select-none py-1"
          >
            {product.name}
          </span>
        </li>
      </ol>
    </nav>
  );
}
