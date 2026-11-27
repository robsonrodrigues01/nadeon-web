import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { ProductCardMin } from "@/components/commerce/product-card-min";
import { mockCatalogProvider } from "@/lib/providers/mock/catalog";

describe("ProductCardMin component", () => {
  it("renders BioHack with prices formatted in USD only", async () => {
    const biohack = await mockCatalogProvider.getProduct("biohack");
    expect(biohack).not.toBeNull();

    const html = renderToString(<ProductCardMin product={biohack!} />);

    // Product name and technical name
    expect(html).toContain("BioHack");
    expect(html).toContain("Cellular Longevity &amp; NAD+ Optimizer");

    // Price formatted in USD only
    expect(html).toContain("$65.00");
    expect(html).not.toContain("EUR");
    expect(html).not.toContain("€");

    // Primary action button
    expect(html).toContain("Add to cart");
  });

  it("renders More Good Years (Pet product) with animal compliance notice", async () => {
    const mgy = await mockCatalogProvider.getProduct("more-good-years");
    expect(mgy).not.toBeNull();

    const html = renderToString(<ProductCardMin product={mgy!} />);

    expect(html).toContain("More Good Years");
    expect(html).toContain("For animal use only");
    expect(html).toContain("$44.00");
  });
});
