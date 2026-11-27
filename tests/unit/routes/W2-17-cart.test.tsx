// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
  within,
} from "@testing-library/react";
import CartPage, { generateMetadata } from "@/app/(shared)/cart/page";
import { CartView } from "@/app/(shared)/cart/_components/cart-view";
import { CartEmpty } from "@/app/(shared)/cart/_components/cart-empty";
import { formatMoneyWithMarket, getMarket } from "@/lib/market";
import { toCartCatalogProduct } from "@/app/(shared)/cart/_components/types";
import { redirectToCheckout } from "@/app/(shared)/cart/_components/checkout";
import { mockCatalogProvider } from "@/lib/providers/mock/catalog";
import {
  cartProvider,
  type Cart,
  type CartLineItem,
} from "@/lib/providers/client";

vi.mock("@/app/(shared)/cart/_components/checkout", () => ({
  redirectToCheckout: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => undefined }),
}));

const CART_ID = "cart_w217";

async function buildCart(): Promise<Cart> {
  const products = await mockCatalogProvider.getProducts({ line: "human" });
  const biohack = products.find((p) => p.handle === "biohack")!;
  const renew = products.find((p) => p.handle === "renew")!;
  const plan = biohack.sellingPlans[0];
  const subAmount = Number(
    (
      biohack.variants[0].price.amount *
      (1 - plan.discountPercentage / 100)
    ).toFixed(2)
  );

  const subLine: CartLineItem = {
    id: "line_sub",
    variantId: biohack.variants[0].id,
    quantity: 1,
    sellingPlanId: plan.id,
    sellingPlanTitle: plan.name,
    product: {
      id: biohack.slug,
      title: biohack.name,
      handle: biohack.handle,
      image: biohack.images[0],
      line: "human",
    },
    price: { amount: subAmount, currencyCode: "USD" },
    total: { amount: subAmount, currencyCode: "USD" },
  };
  const oneTimeAmount = renew.variants[0].price.amount;
  const oneTimeLine: CartLineItem = {
    id: "line_once",
    variantId: renew.variants[0].id,
    quantity: 1,
    sellingPlanId: null,
    product: {
      id: renew.slug,
      title: renew.name,
      handle: renew.handle,
      image: renew.images[0],
      line: "human",
    },
    price: { amount: oneTimeAmount, currencyCode: "USD" },
    total: { amount: oneTimeAmount, currencyCode: "USD" },
  };
  const total = Number((subAmount + oneTimeAmount).toFixed(2));
  return {
    id: CART_ID,
    lines: [subLine, oneTimeLine],
    discountCodes: [],
    subtotalPrice: { amount: total, currencyCode: "USD" },
    totalDiscount: { amount: 0, currencyCode: "USD" },
    totalPrice: { amount: total, currencyCode: "USD" },
    totalQuantity: 2,
    checkoutUrl: "https://checkout.nadeon.com/mock/cart_w217",
  };
}

const EMPTY_CART: Cart = {
  id: "cart_empty",
  lines: [],
  discountCodes: [],
  subtotalPrice: { amount: 0, currencyCode: "USD" },
  totalDiscount: { amount: 0, currencyCode: "USD" },
  totalPrice: { amount: 0, currencyCode: "USD" },
  totalQuantity: 0,
  checkoutUrl: "https://checkout.nadeon.com/mock/cart_empty",
};

async function renderCartView(cart: Cart) {
  const products = await mockCatalogProvider.getProducts({ line: "human" });
  vi.spyOn(cartProvider, "get").mockResolvedValue(cart);
  return render(<CartView catalog={products.map(toCartCatalogProduct)} />);
}

describe("W2-17: /cart route", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  describe("metadata and page", () => {
    it("builds metadata with noindex for the cart", async () => {
      const metadata = await generateMetadata();
      expect(metadata.title).toContain("Nadeon Labs");
      expect(metadata.robots).toMatchObject({ index: false });
    });

    it("renders the page with the empty state when the cart has no lines", async () => {
      vi.spyOn(cartProvider, "get").mockResolvedValue(EMPTY_CART);
      const pageJsx = await CartPage();
      const { container } = render(pageJsx);

      expect(
        await screen.findByRole("heading", {
          level: 1,
          name: "Your cart is empty",
        })
      ).toBeTruthy();
      expect(container.querySelector("main#main-content")).toBeTruthy();
      expect(container.textContent).not.toMatch(/\[X\]|\$XX|\(example\)/);
    });
  });

  describe("empty state (CartEmpty)", () => {
    it("exposes the quiz as a link to /human/quiz", () => {
      render(<CartEmpty />);
      const quiz = screen.getByRole("link", { name: "Take the quiz" });
      expect(quiz.getAttribute("href")).toBe("/human/quiz");
    });

    it("renders the empty state from the provider when the cart is null", async () => {
      vi.spyOn(cartProvider, "get").mockResolvedValue(null);
      await renderCartView(EMPTY_CART);
      expect(
        await screen.findByRole("heading", {
          level: 1,
          name: "Your cart is empty",
        })
      ).toBeTruthy();
    });
  });

  describe("cart page (CartView) with two lines", () => {
    beforeEach(async () => {
      await renderCartView(await buildCart());
      await screen.findByRole("list", { name: "Items in your cart" });
    });

    it("has a breadcrumb nav and a continue shopping link", () => {
      const breadcrumb = screen.getByRole("navigation", { name: "Breadcrumb" });
      expect(
        within(breadcrumb)
          .getByRole("link", { name: "Home" })
          .getAttribute("href")
      ).toBe("/");
      const cont = screen.getByRole("link", { name: /Continue shopping/ });
      expect(cont.getAttribute("href")).toBe("/human/shop");
    });

    it("lists each line with its product name and a status", () => {
      const list = screen.getByRole("list", { name: "Items in your cart" });
      expect(within(list).getAllByRole("listitem")).toHaveLength(2);
      expect(
        screen.getByRole("heading", { level: 2, name: /^BioHack/ })
      ).toBeTruthy();
      expect(screen.getByText(/Subscribe & save 15%/)).toBeTruthy();
      expect(screen.getByText("One-time purchase")).toBeTruthy();
    });

    it("has Remove buttons that call removeLines", async () => {
      const removeLines = vi
        .spyOn(cartProvider, "removeLines")
        .mockResolvedValue(EMPTY_CART);
      const removes = screen.getAllByRole("button", { name: "Remove" });
      expect(removes).toHaveLength(2);
      fireEvent.click(removes[0]);
      await waitFor(() =>
        expect(removeLines).toHaveBeenCalledWith(["line_sub"])
      );
    });

    it("has a Change button for subscriptions that opens a purchase option group", () => {
      const change = screen.getByRole("button", { name: "Change" });
      expect(change.getAttribute("aria-expanded")).toBe("false");
      fireEvent.click(change);
      expect(change.getAttribute("aria-expanded")).toBe("true");
      const group = screen.getByRole("group", {
        name: /Purchase option for BioHack/,
      });
      expect(
        within(group).getByRole("radio", { name: "One-time purchase" })
      ).toBeTruthy();
    });

    it("has a Switch to subscription button for one-time lines", async () => {
      const setPlan = vi
        .spyOn(cartProvider, "setLineSellingPlan")
        .mockResolvedValue(EMPTY_CART);
      fireEvent.click(
        screen.getByRole("button", { name: "Switch to subscription, save 15%" })
      );
      await waitFor(() =>
        expect(setPlan).toHaveBeenCalledWith("line_once", expect.any(String))
      );
    });

    it("has quantity buttons with accessible names that call updateLines", async () => {
      const updateLines = vi
        .spyOn(cartProvider, "updateLines")
        .mockResolvedValue(EMPTY_CART);
      const plus = screen.getByRole("button", {
        name: /Increase quantity of BioHack/,
      });
      const minus = screen.getByRole("button", {
        name: /Decrease quantity of BioHack/,
      });
      expect(minus.hasAttribute("disabled")).toBe(true);
      fireEvent.click(plus);
      await waitFor(() =>
        expect(updateLines).toHaveBeenCalledWith([
          { id: "line_sub", quantity: 2 },
        ])
      );
    });

    it("has a Promo code input and an Apply button that call applyDiscount", async () => {
      const applyDiscount = vi
        .spyOn(cartProvider, "applyDiscount")
        .mockResolvedValue(EMPTY_CART);
      const input = screen.getByLabelText("Promo code");
      expect(input.tagName).toBe("INPUT");
      fireEvent.change(input, { target: { value: " SAVE15 " } });
      fireEvent.click(screen.getByRole("button", { name: "Apply" }));
      await waitFor(() => expect(applyDiscount).toHaveBeenCalledWith("SAVE15"));
    });

    it("has a Checkout securely button that redirects to the provider checkout URL", async () => {
      const url = "https://checkout.nadeon.com/mock/cart_w217";
      const checkoutUrl = vi
        .spyOn(cartProvider, "checkoutUrl")
        .mockResolvedValue(url);
      fireEvent.click(
        screen.getByRole("button", { name: "Checkout securely" })
      );
      await waitFor(() => expect(redirectToCheckout).toHaveBeenCalledWith(url));
      expect(checkoutUrl).toHaveBeenCalled();
    });

    it("shows an alert when the checkout URL cannot be fetched", async () => {
      vi.spyOn(cartProvider, "checkoutUrl").mockRejectedValue(
        new Error("down")
      );
      fireEvent.click(
        screen.getByRole("button", { name: "Checkout securely" })
      );
      expect(await screen.findByRole("alert")).toBeTruthy();
      expect(redirectToCheckout).not.toHaveBeenCalled();
    });

    it("has Frequently bought together add buttons and an add-all button", async () => {
      const full = await buildCart();
      const addLines = vi
        .spyOn(cartProvider, "addLines")
        .mockResolvedValue(full);
      expect(
        screen.getByRole("heading", {
          level: 2,
          name: "Frequently bought together",
        })
      ).toBeTruthy();
      fireEvent.click(
        screen.getByRole("button", { name: "Add Prime to cart" })
      );
      await waitFor(() => expect(addLines).toHaveBeenCalledTimes(1));
      fireEvent.click(
        screen.getByRole("button", { name: "Add all 3 to cart" })
      );
      await waitFor(() => expect(addLines).toHaveBeenCalledTimes(2));
      expect(addLines.mock.calls[1][0]).toHaveLength(3);
    });

    it("shows the order summary with the cart total in the market currency", () => {
      const summary = screen.getByRole("region", { name: "Order summary" });
      expect(within(summary).getByText("Total")).toBeTruthy();
      expect(within(summary).getByText("Subscription savings")).toBeTruthy();
      expect(
        within(summary).getAllByText("Calculated at checkout").length
      ).toBe(2);
    });

    it("keeps the page free of template placeholders", () => {
      const text = document.body.textContent ?? "";
      expect(text).not.toMatch(/\[X\]|\$XX|\(example\)/);
    });
  });

  describe("error feedback", () => {
    it("shows an alert when an update fails", async () => {
      await renderCartView(await buildCart());
      await screen.findByRole("list", { name: "Items in your cart" });
      vi.spyOn(cartProvider, "removeLines").mockRejectedValue(
        new Error("down")
      );
      fireEvent.click(screen.getAllByRole("button", { name: "Remove" })[0]);
      expect(await screen.findByRole("alert")).toBeTruthy();
    });
  });

  describe("money formatting", () => {
    it("formats cart money in USD for all markets", () => {
      const us = getMarket("us")!;
      const gb = getMarket("gb")!;
      expect(
        formatMoneyWithMarket({ amount: 10, currencyCode: "USD" }, us)
      ).toBe("$10.00");
      expect(
        formatMoneyWithMarket({ amount: 10, currencyCode: "USD" }, gb)
      ).toBe("$10.00");
    });
  });
});
