/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import {
  LiveCartProvider,
  CART_STORAGE_KEY,
} from "@/lib/providers/live/browser";
import { CartSchema } from "@/lib/contracts/cart";
import { useCartStore } from "@/lib/providers/client";
import { Header } from "@/components/layout/header";
import { CartDrawer } from "@/components/commerce/cart-drawer";

import cartCreatedFixture from "../../fixtures/shopify/cart-created.json";
import cartGetFixture from "../../fixtures/shopify/cart-get.json";
import cartAddLinesFixture from "../../fixtures/shopify/cart-add-lines.json";
import cartUpdateLinesFixture from "../../fixtures/shopify/cart-update-lines.json";
import cartRemoveLinesFixture from "../../fixtures/shopify/cart-remove-lines.json";
import cartApplyDiscountFixture from "../../fixtures/shopify/cart-apply-discount.json";
import cartApplyDiscountInvalidFixture from "../../fixtures/shopify/cart-apply-discount-invalid.json";
import cartUserErrorsFixture from "../../fixtures/shopify/cart-user-errors.json";
import cartExpiredFixture from "../../fixtures/shopify/cart-expired.json";
import graphqlErrorFixture from "../../fixtures/shopify/graphql-error.json";

class MockStorage implements Storage {
  private store: Record<string, string> = {};
  get length() {
    return Object.keys(this.store).length;
  }
  clear() {
    this.store = {};
  }
  getItem(key: string) {
    return this.store[key] ?? null;
  }
  key(index: number) {
    return Object.keys(this.store)[index] ?? null;
  }
  removeItem(key: string) {
    delete this.store[key];
  }
  setItem(key: string, value: string) {
    this.store[key] = value;
  }
}

function createMockFetch(
  responseOrHandler:
    unknown | ((query: string, variables: Record<string, unknown>) => unknown)
) {
  return vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
    const bodyStr = typeof init?.body === "string" ? init.body : "";
    let parsedBody: { query?: string; variables?: Record<string, unknown> } =
      {};
    try {
      parsedBody = JSON.parse(bodyStr);
    } catch {
      // ignore
    }

    let responseData: unknown;
    if (typeof responseOrHandler === "function") {
      responseData = responseOrHandler(
        parsedBody.query ?? "",
        parsedBody.variables ?? {}
      );
    } else {
      responseData = responseOrHandler;
    }

    return {
      ok: true,
      status: 200,
      json: async () => responseData,
      text: async () => JSON.stringify(responseData),
    } as unknown as Response;
  });
}

function parseRequestBody(init?: RequestInit): {
  query?: string;
  variables?: Record<string, unknown>;
} {
  const bodyStr = typeof init?.body === "string" ? init.body : "";
  try {
    return JSON.parse(bodyStr);
  } catch {
    return {};
  }
}

describe("W4-34 LiveCartProvider", () => {
  const credentials = {
    domain: "test-store.myshopify.com",
    publicToken: "test-public-token-12345",
  };

  let storage: MockStorage;

  beforeEach(() => {
    storage = new MockStorage();
    useCartStore.getState().resetCart();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe("Configuration & Environment", () => {
    it("throws a clear configuration error when domain or publicToken are missing", async () => {
      vi.stubEnv("NEXT_PUBLIC_SHOPIFY_STOREFRONT_DOMAIN", "");
      vi.stubEnv("NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN", "");

      const provider = new LiveCartProvider({ storage });
      await expect(provider.create()).rejects.toThrow(
        /Shopify Storefront configuration error.*NEXT_PUBLIC_SHOPIFY_STOREFRONT_DOMAIN.*NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN/
      );
    });

    it("reads credentials from NEXT_PUBLIC env variables when options not provided", async () => {
      vi.stubEnv(
        "NEXT_PUBLIC_SHOPIFY_STOREFRONT_DOMAIN",
        "env-store.myshopify.com"
      );
      vi.stubEnv(
        "NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN",
        "env-token-9999"
      );

      const mockFetch = createMockFetch(cartCreatedFixture);
      const provider = new LiveCartProvider({
        fetchImpl: mockFetch as unknown as typeof fetch,
        storage,
      });

      await provider.create();
      expect(mockFetch).toHaveBeenCalledTimes(1);
      const call = mockFetch.mock.calls[0];
      expect(call[0]).toBe(
        "https://env-store.myshopify.com/api/2026-10/graphql.json"
      );
      const headers = (call[1] as RequestInit)?.headers as Record<
        string,
        string
      >;
      expect(headers["X-Shopify-Storefront-Access-Token"]).toBe(
        "env-token-9999"
      );
    });
  });

  describe("create()", () => {
    it("calls cartCreate mutation, stores cart id, updates store, and maps to CartSchema", async () => {
      const mockFetch = createMockFetch(cartCreatedFixture);
      const provider = new LiveCartProvider({
        ...credentials,
        fetchImpl: mockFetch as unknown as typeof fetch,
        storage,
      });

      const cart = await provider.create();

      // Validates contract schema
      expect(CartSchema.parse(cart)).toEqual(cart);
      expect(cart.id).toBe("gid://shopify/Cart/c1-empty-cart-id");
      expect(cart.totalQuantity).toBe(0);
      expect(cart.checkoutUrl).toBe(
        "https://test-store.myshopify.com/checkouts/cn/c1-empty-cart-id"
      );
      expect(storage.getItem(CART_STORAGE_KEY)).toBe(
        "gid://shopify/Cart/c1-empty-cart-id"
      );
      expect(useCartStore.getState().cart.id).toBe(
        "gid://shopify/Cart/c1-empty-cart-id"
      );
    });
  });

  describe("get()", () => {
    it("returns null without calling fetch if no cart id is in storage", async () => {
      const mockFetch = createMockFetch(cartGetFixture);
      const provider = new LiveCartProvider({
        ...credentials,
        fetchImpl: mockFetch as unknown as typeof fetch,
        storage,
      });

      const cart = await provider.get();
      expect(cart).toBeNull();
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("clears a leftover cart from the browser store when there is no cart id", async () => {
      useCartStore.getState().setCart({
        ...useCartStore.getState().cart,
        totalQuantity: 3,
      });
      const provider = new LiveCartProvider({
        ...credentials,
        fetchImpl: createMockFetch(cartGetFixture) as unknown as typeof fetch,
        storage,
      });

      await provider.get();
      expect(useCartStore.getState().cart.totalQuantity).toBe(0);
    });

    it("fetches cart by id, maps lines, discounts, selling plans, attributes, and updates store", async () => {
      storage.setItem(CART_STORAGE_KEY, "gid://shopify/Cart/c1-test-cart-id");
      const mockFetch = createMockFetch(cartGetFixture);
      const provider = new LiveCartProvider({
        ...credentials,
        fetchImpl: mockFetch as unknown as typeof fetch,
        storage,
      });

      const cart = await provider.get();
      expect(cart).not.toBeNull();
      if (!cart) throw new Error("Cart should exist");

      expect(CartSchema.parse(cart)).toEqual(cart);
      expect(cart.id).toBe("gid://shopify/Cart/c1-test-cart-id");
      expect(cart.totalQuantity).toBe(2);
      expect(cart.lines).toHaveLength(2);

      // Line 1: Subscription with selling plan & compareAtPrice & attributes
      const line1 = cart.lines[0];
      expect(line1.id).toBe("gid://shopify/CartLine/line-1");
      expect(line1.variantId).toBe("gid://shopify/ProductVariant/2000000001");
      expect(line1.sellingPlanId).toBe("gid://shopify/SellingPlan/plan-1");
      expect(line1.sellingPlanTitle).toBe("1 jar every 30 days (15% off)");
      expect(line1.subscriptionDiscountPercentage).toBe(15);
      expect(line1.compareAtPrice).toEqual({ amount: 59, currencyCode: "USD" });
      expect(line1.price).toEqual({ amount: 50.15, currencyCode: "USD" });
      expect(line1.product.line).toBe("human");
      expect(line1.customAttributes).toEqual({ flavor: "berry" });

      // Line 2: One-time pet product without selling plan
      const line2 = cart.lines[1];
      expect(line2.id).toBe("gid://shopify/CartLine/line-2");
      expect(line2.variantId).toBe("gid://shopify/ProductVariant/2000000002");
      expect(line2.sellingPlanId).toBeNull();
      expect(line2.compareAtPrice).toBeUndefined();
      expect(line2.product.line).toBe("pet");

      // Verify store updated
      expect(useCartStore.getState().cart.id).toBe(
        "gid://shopify/Cart/c1-test-cart-id"
      );
      expect(useCartStore.getState().cart.totalQuantity).toBe(2);
    });

    it("clears stored cart id and resets store when Shopify returns null (expired cart)", async () => {
      storage.setItem(CART_STORAGE_KEY, "gid://shopify/Cart/expired-cart-id");
      const mockFetch = createMockFetch(cartExpiredFixture);
      const provider = new LiveCartProvider({
        ...credentials,
        fetchImpl: mockFetch as unknown as typeof fetch,
        storage,
      });

      const cart = await provider.get();
      expect(cart).toBeNull();
      expect(storage.getItem(CART_STORAGE_KEY)).toBeNull();
      expect(useCartStore.getState().cart.totalQuantity).toBe(0);
    });
  });

  describe("addLines()", () => {
    it("creates a new cart with lines when no cart exists yet", async () => {
      const mockFetch = createMockFetch((query: string) => {
        if (query.includes("cartCreate")) {
          return {
            data: {
              cartCreate: {
                cart: cartAddLinesFixture.data.cartLinesAdd.cart,
                userErrors: [],
              },
            },
          };
        }
        return cartAddLinesFixture;
      });
      const provider = new LiveCartProvider({
        ...credentials,
        fetchImpl: mockFetch as unknown as typeof fetch,
        storage,
      });

      const cart = await provider.addLines([
        {
          variantId: "gid://shopify/ProductVariant/2000000003",
          quantity: 1,
        },
      ]);

      expect(CartSchema.parse(cart)).toEqual(cart);
      expect(cart.totalQuantity).toBe(3);
      expect(storage.getItem(CART_STORAGE_KEY)).toBe(
        "gid://shopify/Cart/c1-test-cart-id"
      );
      expect(useCartStore.getState().cart.totalQuantity).toBe(3);

      const call = mockFetch.mock.calls[0];
      const body = parseRequestBody(call[1] as RequestInit);
      expect(body.query).toContain("cartCreate");
      expect(
        (body.variables?.input as { lines?: Array<{ merchandiseId: string }> })
          ?.lines?.[0]?.merchandiseId
      ).toBe("gid://shopify/ProductVariant/2000000003");
    });

    it("adds lines with sellingPlanId and customAttributes to an existing cart", async () => {
      storage.setItem(CART_STORAGE_KEY, "gid://shopify/Cart/c1-test-cart-id");
      const mockFetch = createMockFetch(cartAddLinesFixture);
      const provider = new LiveCartProvider({
        ...credentials,
        fetchImpl: mockFetch as unknown as typeof fetch,
        storage,
      });

      const cart = await provider.addLines([
        {
          variantId: "gid://shopify/ProductVariant/2000000001",
          quantity: 1,
          sellingPlanId: "gid://shopify/SellingPlan/plan-1",
          customAttributes: { notes: "leave at door" },
        },
      ]);

      expect(CartSchema.parse(cart)).toEqual(cart);
      const call = mockFetch.mock.calls[0];
      const body = parseRequestBody(call[1] as RequestInit);
      expect(body.query).toContain("cartLinesAdd");
      expect(body.variables?.cartId).toBe("gid://shopify/Cart/c1-test-cart-id");
      const addedLines = body.variables?.lines as Array<{
        sellingPlanId?: string;
        attributes?: Array<{ key: string; value: string }>;
      }>;
      expect(addedLines?.[0]?.sellingPlanId).toBe(
        "gid://shopify/SellingPlan/plan-1"
      );
      expect(addedLines?.[0]?.attributes).toEqual([
        { key: "notes", value: "leave at door" },
      ]);
    });
  });

  describe("updateLines()", () => {
    it("updates line item quantity and returns conforming Cart", async () => {
      storage.setItem(CART_STORAGE_KEY, "gid://shopify/Cart/c1-test-cart-id");
      const mockFetch = createMockFetch(cartUpdateLinesFixture);
      const provider = new LiveCartProvider({
        ...credentials,
        fetchImpl: mockFetch as unknown as typeof fetch,
        storage,
      });

      const cart = await provider.updateLines([
        {
          id: "gid://shopify/CartLine/line-1",
          quantity: 2,
        },
      ]);

      expect(CartSchema.parse(cart)).toEqual(cart);
      const call = mockFetch.mock.calls[0];
      const body = parseRequestBody(call[1] as RequestInit);
      expect(body.query).toContain("cartLinesUpdate");
      expect(
        (body.variables?.lines as Array<{ id: string; quantity: number }>)?.[0]
      ).toEqual({
        id: "gid://shopify/CartLine/line-1",
        quantity: 2,
      });
    });

    it("uses cartLinesRemove when updating a line quantity to 0", async () => {
      storage.setItem(CART_STORAGE_KEY, "gid://shopify/Cart/c1-test-cart-id");
      const mockFetch = createMockFetch(cartRemoveLinesFixture);
      const provider = new LiveCartProvider({
        ...credentials,
        fetchImpl: mockFetch as unknown as typeof fetch,
        storage,
      });

      const cart = await provider.updateLines([
        {
          id: "gid://shopify/CartLine/line-1",
          quantity: 0,
        },
      ]);

      expect(CartSchema.parse(cart)).toEqual(cart);
      const call = mockFetch.mock.calls[0];
      const body = parseRequestBody(call[1] as RequestInit);
      expect(body.query).toContain("cartLinesRemove");
      expect(body.variables?.lineIds).toEqual([
        "gid://shopify/CartLine/line-1",
      ]);
    });
  });

  describe("removeLines()", () => {
    it("calls cartLinesRemove and updates store", async () => {
      storage.setItem(CART_STORAGE_KEY, "gid://shopify/Cart/c1-test-cart-id");
      const mockFetch = createMockFetch(cartRemoveLinesFixture);
      const provider = new LiveCartProvider({
        ...credentials,
        fetchImpl: mockFetch as unknown as typeof fetch,
        storage,
      });

      const cart = await provider.removeLines([
        "gid://shopify/CartLine/line-1",
      ]);

      expect(CartSchema.parse(cart)).toEqual(cart);
      expect(cart.lines).toHaveLength(1);
      expect(cart.totalQuantity).toBe(1);
      expect(useCartStore.getState().cart.totalQuantity).toBe(1);
    });
  });

  describe("applyDiscount()", () => {
    it("appends discount code to existing codes and maps applicable discount amount", async () => {
      storage.setItem(CART_STORAGE_KEY, "gid://shopify/Cart/c1-test-cart-id");
      const mockFetch = createMockFetch((query: string) => {
        if (query.includes("query GetCart")) {
          return cartGetFixture;
        }
        return cartApplyDiscountFixture;
      });

      const provider = new LiveCartProvider({
        ...credentials,
        fetchImpl: mockFetch as unknown as typeof fetch,
        storage,
      });

      const cart = await provider.applyDiscount("WELCOME10");

      expect(CartSchema.parse(cart)).toEqual(cart);
      expect(cart.discountCodes).toHaveLength(1);
      expect(cart.discountCodes[0]).toEqual({
        code: "WELCOME10",
        applicable: true,
        discountAmount: { amount: 10.92, currencyCode: "USD" },
      });
      expect(cart.totalDiscount).toEqual({
        amount: 10.92,
        currencyCode: "USD",
      });
      expect(cart.totalPrice).toEqual({ amount: 98.23, currencyCode: "USD" });
    });

    it("handles non-applicable discount code", async () => {
      storage.setItem(CART_STORAGE_KEY, "gid://shopify/Cart/c1-test-cart-id");
      const mockFetch = createMockFetch((query: string) => {
        if (query.includes("query GetCart")) {
          return cartGetFixture;
        }
        return cartApplyDiscountInvalidFixture;
      });

      const provider = new LiveCartProvider({
        ...credentials,
        fetchImpl: mockFetch as unknown as typeof fetch,
        storage,
      });

      const cart = await provider.applyDiscount("INVALID_CODE");

      expect(CartSchema.parse(cart)).toEqual(cart);
      expect(cart.discountCodes[0].applicable).toBe(false);
      expect(cart.discountCodes[0].discountAmount).toBeUndefined();
    });
  });

  describe("setLineSellingPlan()", () => {
    it("updates line sellingPlanId via cartLinesUpdate", async () => {
      storage.setItem(CART_STORAGE_KEY, "gid://shopify/Cart/c1-test-cart-id");
      const mockFetch = createMockFetch(cartUpdateLinesFixture);
      const provider = new LiveCartProvider({
        ...credentials,
        fetchImpl: mockFetch as unknown as typeof fetch,
        storage,
      });

      const cart = await provider.setLineSellingPlan(
        "gid://shopify/CartLine/line-1",
        "gid://shopify/SellingPlan/plan-1"
      );

      expect(CartSchema.parse(cart)).toEqual(cart);
      const call = mockFetch.mock.calls[0];
      const body = parseRequestBody(call[1] as RequestInit);
      expect(body.query).toContain("cartLinesUpdate");
      expect(
        (
          body.variables?.lines as Array<{ id: string; sellingPlanId: string }>
        )?.[0]
      ).toEqual({
        id: "gid://shopify/CartLine/line-1",
        sellingPlanId: "gid://shopify/SellingPlan/plan-1",
      });
    });
  });

  describe("checkoutUrl()", () => {
    it("returns checkoutUrl from existing cart", async () => {
      storage.setItem(CART_STORAGE_KEY, "gid://shopify/Cart/c1-test-cart-id");
      const mockFetch = createMockFetch(cartGetFixture);
      const provider = new LiveCartProvider({
        ...credentials,
        fetchImpl: mockFetch as unknown as typeof fetch,
        storage,
      });

      const url = await provider.checkoutUrl();
      expect(url).toBe(
        "https://test-store.myshopify.com/checkouts/cn/c1-test-cart-id"
      );
    });
  });

  describe("addKit()", () => {
    it("throws clear error that kits are not available at launch", async () => {
      const provider = new LiveCartProvider({
        ...credentials,
        storage,
      });

      await expect(provider.addKit("test-kit", 1)).rejects.toThrow(
        /Kits are not available at launch/i
      );
    });
  });

  describe("Error Handling", () => {
    it("throws readable error when Shopify mutation returns userErrors", async () => {
      storage.setItem(CART_STORAGE_KEY, "gid://shopify/Cart/c1-test-cart-id");
      const mockFetch = createMockFetch(cartUserErrorsFixture);
      const provider = new LiveCartProvider({
        ...credentials,
        fetchImpl: mockFetch as unknown as typeof fetch,
        storage,
      });

      await expect(
        provider.addLines([
          {
            variantId: "gid://shopify/ProductVariant/out-of-stock",
            quantity: 5,
          },
        ])
      ).rejects.toThrow(/Shopify Cart error: The merchandise is out of stock/);
    });

    it("throws readable error when GraphQL returns top-level errors", async () => {
      storage.setItem(CART_STORAGE_KEY, "gid://shopify/Cart/c1-test-cart-id");
      const mockFetch = createMockFetch(graphqlErrorFixture);
      const provider = new LiveCartProvider({
        ...credentials,
        fetchImpl: mockFetch as unknown as typeof fetch,
        storage,
      });

      await expect(provider.get()).rejects.toThrow(
        /Shopify Storefront GraphQL error: TEST error: Storefront access denied/
      );
    });

    it("throws readable error when HTTP response is not ok", async () => {
      const mockFetch = vi.fn(async () => ({
        ok: false,
        status: 500,
        text: async () => "Internal Server Error",
      }));
      const provider = new LiveCartProvider({
        ...credentials,
        fetchImpl: mockFetch as unknown as typeof fetch,
        storage,
      });

      await expect(provider.create()).rejects.toThrow(
        /Shopify Storefront request failed \(500\): Internal Server Error/
      );
    });
  });

  describe("UI & State Integration", () => {
    it("updates Header cart count when live provider fetches or mutates cart", async () => {
      storage.setItem(CART_STORAGE_KEY, "gid://shopify/Cart/c1-test-cart-id");
      const mockFetch = createMockFetch(cartGetFixture);
      const provider = new LiveCartProvider({
        ...credentials,
        fetchImpl: mockFetch as unknown as typeof fetch,
        storage,
      });

      render(<Header variant="human" />);
      // Initially cart count is 0
      expect(
        screen.getAllByRole("link", { name: /cart \(0\)/i }).length
      ).toBeGreaterThan(0);

      // Provider fetches cart
      await provider.get();

      // Header updates to (2)
      await waitFor(() => {
        expect(
          screen.getAllByRole("link", { name: /cart \(2\)/i }).length
        ).toBeGreaterThan(0);
      });
    });

    it("renders live cart items in CartDrawer and triggers checkout redirect", async () => {
      storage.setItem(CART_STORAGE_KEY, "gid://shopify/Cart/c1-test-cart-id");
      const mockFetch = createMockFetch(cartGetFixture);
      const provider = new LiveCartProvider({
        ...credentials,
        fetchImpl: mockFetch as unknown as typeof fetch,
        storage,
      });

      await provider.get();

      render(<CartDrawer isOpen={true} cartProvider={provider} />);

      // Verify line items are visible
      expect(screen.getByText(/BioHack/i)).toBeDefined();
      expect(screen.getByText(/More Good Years Dog/i)).toBeDefined();

      // Verify checkout button is present with correct total
      const checkoutBtn = screen.getByRole("button", {
        name: /checkout \$109\.15/i,
      });
      expect(checkoutBtn).toBeDefined();
    });
  });
});
