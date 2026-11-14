// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { ProductCard } from "@/components/commerce/product-card";
import { mockCatalogProvider } from "@/lib/providers/mock/catalog";
import type { CartProvider, Cart } from "@/lib/contracts/cart";

describe("ProductCard component (W1-12)", () => {
  let mockCartProviderInstance: CartProvider;
  let sampleCart: Cart;

  beforeEach(() => {
    sampleCart = {
      id: "cart_test_123",
      lines: [],
      discountCodes: [],
      subtotalPrice: { amount: 65, currencyCode: "USD" },
      totalDiscount: { amount: 0, currencyCode: "USD" },
      totalPrice: { amount: 65, currencyCode: "USD" },
      totalQuantity: 1,
      checkoutUrl: "https://checkout.nadeon.com/mock/cart_test_123",
    };

    mockCartProviderInstance = {
      get: vi.fn().mockResolvedValue(sampleCart),
      create: vi.fn().mockResolvedValue(sampleCart),
      addLines: vi.fn().mockResolvedValue(sampleCart),
      updateLines: vi.fn().mockResolvedValue(sampleCart),
      removeLines: vi.fn().mockResolvedValue(sampleCart),
      applyDiscount: vi.fn().mockResolvedValue(sampleCart),
      setLineSellingPlan: vi.fn().mockResolvedValue(sampleCart),
      checkoutUrl: vi.fn().mockResolvedValue(sampleCart.checkoutUrl),
    };
  });

  afterEach(() => {
    cleanup();
  });

  it("renders BioHack card with semantic elements, image alt, technical name and Intl formatted price", async () => {
    const biohack = await mockCatalogProvider.getProduct("biohack");
    expect(biohack).not.toBeNull();

    render(
      <ProductCard
        product={biohack!}
        cartProvider={mockCartProviderInstance}
        locale="en-US"
      />
    );

    // Semantic article container
    const article = screen.getByRole("article", { name: /biohack/i });
    expect(article).toBeTruthy();

    // Semantic heading
    const heading = screen.getByRole("heading", { level: 3, name: "BioHack" });
    expect(heading).toBeTruthy();

    // Technical name
    expect(
      screen.getByText("Cellular Longevity & NAD+ Optimizer")
    ).toBeTruthy();

    // Format badge
    expect(screen.getByText("Capsules")).toBeTruthy();

    // Formatted price via Intl.NumberFormat ($65.00)
    expect(screen.getByText("$65.00")).toBeTruthy();

    // Subscribe and save percentage hint
    expect(screen.getByText(/or subscribe and save 15%/i)).toBeTruthy();

    // Semantic button element
    const addToCartBtn = screen.getByRole("button", {
      name: /add biohack to cart for \$65\.00/i,
    });
    expect(addToCartBtn).toBeTruthy();
    expect(addToCartBtn.getAttribute("type")).toBe("button");
  });

  it("calls CartProvider.addLines when Add to Cart button is clicked and shows feedback", async () => {
    const biohack = await mockCatalogProvider.getProduct("biohack");
    const onAddToCartSuccess = vi.fn();

    render(
      <ProductCard
        product={biohack!}
        cartProvider={mockCartProviderInstance}
        onAddToCartSuccess={onAddToCartSuccess}
      />
    );

    const addToCartBtn = screen.getByRole("button", {
      name: /add biohack to cart for \$65\.00/i,
    });
    fireEvent.click(addToCartBtn);

    await waitFor(() => {
      expect(mockCartProviderInstance.addLines).toHaveBeenCalledWith([
        {
          variantId: "var_biohack_1",
          quantity: 1,
        },
      ]);
    });

    await waitFor(() => {
      expect(onAddToCartSuccess).toHaveBeenCalledWith(sampleCart);
      expect(screen.getByText("Added BioHack to cart")).toBeTruthy();
    });
  });

  it("renders Pet product compliance notice and equine warning if applicable", async () => {
    const moreGoodYears =
      await mockCatalogProvider.getProduct("more-good-years");
    expect(moreGoodYears).not.toBeNull();

    render(
      <ProductCard
        product={moreGoodYears!}
        cartProvider={mockCartProviderInstance}
      />
    );

    // Compliance note
    const note = screen.getByRole("note");
    expect(note).toBeTruthy();
    expect(note.textContent).toContain("For animal use only.");

    // Claim with asterisk
    expect(
      screen.getByText(/Supports NAD\+ levels in senior dogs\*/i)
    ).toBeTruthy();

    // Chews format
    expect(screen.getByText("Soft chews")).toBeTruthy();

    // Formatted price ($44.00)
    expect(screen.getByText("$44.00")).toBeTruthy();
  });
});
