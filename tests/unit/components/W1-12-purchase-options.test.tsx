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
import { PurchaseOptions } from "@/components/commerce/purchase-options";
import { mockCatalogProvider } from "@/lib/providers/mock/catalog";
import type { CartProvider, Cart } from "@/lib/contracts/cart";

describe("PurchaseOptions component (W1-12)", () => {
  let mockCartProviderInstance: CartProvider;
  let sampleCart: Cart;

  beforeEach(() => {
    sampleCart = {
      id: "cart_test_po",
      lines: [],
      discountCodes: [],
      subtotalPrice: { amount: 100.3, currencyCode: "USD" },
      totalDiscount: { amount: 17.7, currencyCode: "USD" },
      totalPrice: { amount: 100.3, currencyCode: "USD" },
      totalQuantity: 1,
      checkoutUrl: "https://checkout.nadeon.com/mock/cart_test_po",
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

  it("renders Subscribe & save by default with 60 days recommended plan and discounted price", async () => {
    const biohack = await mockCatalogProvider.getProduct("biohack");
    expect(biohack).not.toBeNull();

    render(
      <PurchaseOptions
        product={biohack!}
        cartProvider={mockCartProviderInstance}
        defaultPurchaseType="subscription"
      />
    );

    // Radios for purchase type
    const subRadio = screen.getByRole("radio", {
      name: /subscribe & save 15%/i,
    });
    const oneTimeRadio = screen.getByRole("radio", {
      name: /one-time purchase/i,
    });

    expect(subRadio).toBeTruthy();
    expect((subRadio as HTMLInputElement).checked).toBe(true);
    expect(oneTimeRadio).toBeTruthy();
    expect((oneTimeRadio as HTMLInputElement).checked).toBe(false);

    // Free shipping badge
    expect(screen.getByText("FREE SHIPPING EVERY DELIVERY")).toBeTruthy();

    // Selling plans list
    expect(screen.getByText("1 jar every 30 days")).toBeTruthy();
    expect(screen.getByText("2 jars every 60 days")).toBeTruthy();
    expect(screen.getByText("3 jars every 90 days")).toBeTruthy();
    expect(screen.getByText("RECOMMENDED")).toBeTruthy();

    // Discounted price for 2 jars @ 15% off: $118 * 0.85 = $100.30
    const addToCartBtn = screen.getByRole("button", {
      name: /add to cart · \$100\.30/i,
    });
    expect(addToCartBtn).toBeTruthy();

    // Shop Pay installment breakdown ($100.30 / 4 = $25.08)
    expect(
      screen.getByText(/4 interest-free payments of \$25\.08 with shop pay/i)
    ).toBeTruthy();

    // 60-day guarantee
    expect(screen.getByText(/60-day money-back guarantee\./i)).toBeTruthy();
  });

  it("switches to One-time purchase and updates total when selecting jar quantities", async () => {
    const biohack = await mockCatalogProvider.getProduct("biohack");

    render(
      <PurchaseOptions
        product={biohack!}
        cartProvider={mockCartProviderInstance}
        defaultPurchaseType="subscription"
      />
    );

    // Switch to One-time purchase
    const oneTimeRadio = screen.getByRole("radio", {
      name: /one-time purchase/i,
    });
    fireEvent.click(oneTimeRadio);
    expect((oneTimeRadio as HTMLInputElement).checked).toBe(true);

    // Jar selection options (1 jar, 2 jars, 3 jars)
    const jar1Radio = screen.getByRole("radio", { name: /1 jar/i });
    const jar2Radio = screen.getByRole("radio", { name: /2 jars/i });
    const jar3Radio = screen.getByRole("radio", { name: /3 jars/i });

    expect(jar1Radio).toBeTruthy();
    expect(jar2Radio).toBeTruthy();
    expect(jar3Radio).toBeTruthy();

    // Default was 2 jars ($118.00)
    expect(
      screen.getByRole("button", { name: /add to cart · \$118\.00/i })
    ).toBeTruthy();

    // Select 1 jar ($65.00)
    fireEvent.click(jar1Radio);
    expect((jar1Radio as HTMLInputElement).checked).toBe(true);
    expect(
      screen.getByRole("button", { name: /add to cart · \$65\.00/i })
    ).toBeTruthy();

    // Select 3 jars ($165.00)
    fireEvent.click(jar3Radio);
    expect((jar3Radio as HTMLInputElement).checked).toBe(true);
    expect(
      screen.getByRole("button", { name: /add to cart · \$165\.00/i })
    ).toBeTruthy();
  });

  it("calls CartProvider.addLines with variantId and sellingPlanId when adding subscription", async () => {
    const biohack = await mockCatalogProvider.getProduct("biohack");
    const onAddToCartSuccess = vi.fn();

    render(
      <PurchaseOptions
        product={biohack!}
        cartProvider={mockCartProviderInstance}
        defaultPurchaseType="subscription"
        onAddToCartSuccess={onAddToCartSuccess}
      />
    );

    const addToCartBtn = screen.getByRole("button", {
      name: /add to cart · \$100\.30/i,
    });
    fireEvent.click(addToCartBtn);

    await waitFor(() => {
      expect(mockCartProviderInstance.addLines).toHaveBeenCalledWith([
        {
          variantId: "var_biohack_2",
          quantity: 1,
          sellingPlanId: "plan_biohack_60d",
        },
      ]);
    });

    await waitFor(() => {
      expect(onAddToCartSuccess).toHaveBeenCalledWith(sampleCart);
      expect(
        screen.getByText(/added 2 jars \(60 days\) \(subscription\) to cart/i)
      ).toBeTruthy();
    });
  });

  it("calls CartProvider.addLines with null sellingPlanId when adding one-time purchase", async () => {
    const biohack = await mockCatalogProvider.getProduct("biohack");

    render(
      <PurchaseOptions
        product={biohack!}
        cartProvider={mockCartProviderInstance}
        defaultPurchaseType="one-time"
      />
    );

    // Click 1 jar radio
    const jar1Radio = screen.getByRole("radio", { name: /1 jar/i });
    fireEvent.click(jar1Radio);

    const addToCartBtn = screen.getByRole("button", {
      name: /add to cart · \$65\.00/i,
    });
    fireEvent.click(addToCartBtn);

    await waitFor(() => {
      expect(mockCartProviderInstance.addLines).toHaveBeenCalledWith([
        {
          variantId: "var_biohack_1",
          quantity: 1,
          sellingPlanId: null,
        },
      ]);
    });
  });

  it("renders Pet product compliance notice and handles Pet variant prices correctly", async () => {
    const moreGoodYears =
      await mockCatalogProvider.getProduct("more-good-years");

    render(
      <PurchaseOptions
        product={moreGoodYears!}
        cartProvider={mockCartProviderInstance}
        defaultPurchaseType="one-time"
      />
    );

    // Compliance note
    expect(
      screen.getByText(/for animal use only\. keep out of reach of children\./i)
    ).toBeTruthy();

    // 1 jar $44, 2 jars $80, 3 jars $108
    expect(screen.getAllByText("$44.00").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("$80.00").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("$108.00").length).toBeGreaterThanOrEqual(1);
  });
});
