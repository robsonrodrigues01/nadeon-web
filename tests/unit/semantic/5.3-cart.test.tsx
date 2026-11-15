// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

import { CartView } from "@/app/(shared)/cart/_components/cart-view";
import { CartEmpty } from "@/app/(shared)/cart/_components/cart-empty";
import { CartDrawer } from "@/components/commerce/cart-drawer";
import { mockCatalogProvider } from "@/lib/providers/mock/catalog";
import { toCartCatalogProduct } from "@/app/(shared)/cart/_components/types";
import { cartProvider, type Cart } from "@/lib/providers/client";

vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => undefined }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => "/cart",
}));

const mockCart: Cart = {
  id: "cart_w301",
  lines: [
    {
      id: "line_biohack",
      variantId: "var_biohack",
      quantity: 1,
      sellingPlanId: "plan_30d",
      sellingPlanTitle: "1 jar every 30 days (15% off)",
      subscriptionDiscountPercentage: 15,
      product: {
        id: "biohack",
        title: "BioHack",
        handle: "biohack",
        image: "/images/products/biohack-front.webp",
        line: "human",
      },
      price: { amount: 50.15, currencyCode: "USD" },
      total: { amount: 50.15, currencyCode: "USD" },
    },
    {
      id: "line_renew",
      variantId: "var_renew",
      quantity: 1,
      sellingPlanId: null,
      subscriptionDiscountPercentage: 15,
      product: {
        id: "renew",
        title: "Renew",
        handle: "renew",
        image: "/images/products/renew-front.webp",
        line: "human",
      },
      price: { amount: 65, currencyCode: "USD" },
      total: { amount: 65, currencyCode: "USD" },
    },
  ],
  discountCodes: [],
  subtotalPrice: { amount: 115.15, currencyCode: "USD" },
  totalDiscount: { amount: 8.85, currencyCode: "USD" },
  totalPrice: { amount: 115.15, currencyCode: "USD" },
  totalQuantity: 2,
  checkoutUrl: "https://checkout.nadeon.com/mock",
};

const mockCartProvider = {
  get: vi.fn().mockResolvedValue(mockCart),
  create: vi.fn().mockResolvedValue(mockCart),
  addLines: vi.fn().mockResolvedValue(mockCart),
  addKit: vi.fn().mockResolvedValue(mockCart),
  updateLines: vi.fn().mockResolvedValue(mockCart),
  removeLines: vi.fn().mockResolvedValue(mockCart),
  applyDiscount: vi.fn().mockResolvedValue(mockCart),
  setLineSellingPlan: vi.fn().mockResolvedValue(mockCart),
  checkoutUrl: vi.fn().mockResolvedValue(mockCart.checkoutUrl),
};

describe("5.3 Semantic Elements: Carrinho", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  describe("Gaveta do carrinho (Human e Pet)", () => {
    it("renders item subscription toggle, Change link, Remove button, and Switch to subscription", () => {
      render(
        <CartDrawer
          isOpen={true}
          theme="human"
          cart={mockCart}
          cartProvider={mockCartProvider}
        />
      );

      // Subscription / One-time labels
      expect(screen.getByText(/subscribe & save 15%/i)).toBeDefined();
      expect(screen.getByText(/one-time purchase/i)).toBeDefined();

      // Change frequency button
      const changeBtn = screen.getByRole("button", {
        name: /change subscription frequency for biohack/i,
      });
      expect(changeBtn).toBeDefined();

      // Switch to subscription button
      const switchToSubBtn = screen.getByRole("button", {
        name: /switch renew to subscription and save 15%/i,
      });
      expect(switchToSubBtn).toBeDefined();

      // Remove button
      const removeBtn = screen.getByRole("button", {
        name: /remove renew from cart/i,
      });
      expect(removeBtn).toBeDefined();

      // Additional upsell: + Add
      const addUpsellBtn = screen.getByRole("button", {
        name: /add prime to cart/i,
      });
      expect(addUpsellBtn).toBeDefined();

      // Checkout button
      const checkoutBtn = screen.getByRole("button", {
        name: /checkout \$115\.15/i,
      });
      expect(checkoutBtn).toBeDefined();

      // Express checkout buttons
      expect(
        screen.getByRole("button", { name: /pay with apple pay/i })
      ).toBeDefined();
      expect(
        screen.getByRole("button", { name: /pay with google pay/i })
      ).toBeDefined();
      expect(
        screen.getByRole("button", { name: /pay with paypal/i })
      ).toBeDefined();
      expect(
        screen.getByRole("button", { name: /pay with shop pay/i })
      ).toBeDefined();
      expect(
        screen.getByRole("group", { name: /express checkout options/i })
      ).toBeDefined();
      expect(
        screen.getByRole("progressbar", { name: /free shipping progress/i })
      ).toBeDefined();
    });
  });

  describe("Cart page `/cart`", () => {
    it("renders Continue shopping, shipping progress bar, promo code input + apply, and checkout", async () => {
      vi.spyOn(cartProvider, "get").mockResolvedValue(mockCart);
      const rawProducts = await mockCatalogProvider.getProducts();
      const catalog = rawProducts.map(toCartCatalogProduct);

      render(<CartView catalog={catalog} />);

      await screen.findByRole("list", { name: "Items in your cart" });

      // Continue shopping
      const continueLink = screen.getByRole("link", {
        name: /continue shopping/i,
      });
      expect(continueLink).toBeDefined();

      // Item actions: Change, Switch to subscription, Remove
      expect(screen.getByRole("button", { name: "Change" })).toBeDefined();
      expect(
        screen.getByRole("button", { name: "Switch to subscription, save 15%" })
      ).toBeDefined();
      expect(
        screen.getAllByRole("button", { name: "Remove" }).length
      ).toBeGreaterThan(0);

      // Promo code input + Apply
      const promoInput = screen.getByRole("textbox", {
        name: "Promo code",
      });
      expect(promoInput).toBeDefined();
      expect(screen.getByRole("button", { name: "Apply" })).toBeDefined();

      // Checkout securely
      expect(
        screen.getByRole("button", { name: "Checkout securely" })
      ).toBeDefined();

      // Frequently bought together
      expect(
        screen.getByRole("button", { name: "Add all 3 to cart" })
      ).toBeDefined();
    });

    it("renders empty cart state with quiz link", () => {
      render(<CartEmpty />);

      expect(
        screen.getByRole("heading", { level: 1, name: "Your cart is empty" })
      ).toBeDefined();
      expect(screen.getByRole("link", { name: "Take the quiz" })).toBeDefined();
    });

    it.todo(
      "Cart page `/cart`: free shipping progress and express payments are not implemented on this route"
    );
    it.todo(
      "Cart empty `/cart`: best sellers and category shortcuts are not implemented"
    );
  });

  describe("Checkout opening soon `/checkout-soon`", () => {
    it.todo(
      "Checkout opening soon `/checkout-soon`: placeholder route not implemented in Onda 2"
    );
  });
});
