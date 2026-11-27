// @vitest-environment jsdom
import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cartProvider, type Cart } from "@/lib/providers/client";
import { CartView } from "@/app/(shared)/cart/_components/cart-view";
import { toCartCatalogProduct } from "@/app/(shared)/cart/_components/types";
import { mockCatalogProvider } from "@/lib/providers/mock/catalog";
import { MarketProvider } from "@/lib/market";

const catalog = (await mockCatalogProvider.getProducts({ line: "pet" })).map(
  toCartCatalogProduct
);

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("W2-41 cart", () => {
  it("shows pet best sellers and category shortcuts when empty", async () => {
    vi.spyOn(cartProvider, "get").mockResolvedValue(null);
    render(
      <MarketProvider initialMarket="us">
        <CartView catalog={catalog} petBestSellers={catalog} />
      </MarketProvider>
    );

    expect(
      await screen.findByRole("heading", { name: "Best sellers" })
    ).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "Shop dogs" }).getAttribute("href")
    ).toBe("/pet/dogs");
    expect(
      screen.getByRole("link", { name: "Shop cats" }).getAttribute("href")
    ).toBe("/pet/cats");
    expect(
      screen.getByRole("link", { name: "Shop horses" }).getAttribute("href")
    ).toBe("/pet/horses");
    expect(screen.getByText("More Good Years")).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "Take the quiz" }).getAttribute("href")
    ).toBe("/human/quiz");
    expect(
      screen
        .getByRole("link", { name: "Take the pet quiz" })
        .getAttribute("href")
    ).toBe("/pet/quiz");
  });

  it.each([
    ["pet", "us", 49, "USD"],
    ["human", "us", 75, "USD"],
    ["pet", "ca", null, "USD"],
  ] as const)(
    "shows shared shipping progress for %s in %s",
    async (line, market, threshold, currency) => {
      vi.spyOn(cartProvider, "get").mockResolvedValue({
        id: "cart",
        lines: [
          {
            id: "line",
            variantId: "var_mgy_1",
            quantity: 1,
            product: {
              id: "more-good-years",
              handle: "more-good-years",
              title: "More Good Years",
              image: "/images/more-good-years.webp",
              line,
            },
            price: { amount: 44, currencyCode: "USD" },
            total: { amount: 44, currencyCode: "USD" },
          },
        ],
        subtotalPrice: { amount: 44, currencyCode: "USD" },
        totalDiscount: { amount: 0, currencyCode: "USD" },
        totalPrice: { amount: 44, currencyCode: "USD" },
        discountCodes: [],
        totalQuantity: 1,
        checkoutUrl: "https://checkout.example/cart",
      } satisfies Cart);
      render(
        <MarketProvider initialMarket={market}>
          <CartView catalog={catalog} />
        </MarketProvider>
      );

      if (threshold === null) {
        expect(
          await screen.findByRole("heading", { name: "Your cart" })
        ).toBeTruthy();
        expect(
          screen.queryByRole("progressbar", { name: "Free shipping progress" })
        ).toBeNull();
        return;
      }
      const progress = await screen.findByRole("progressbar", {
        name: "Free shipping progress",
      });
      expect(progress.getAttribute("aria-valuenow")).toBe("44");
      expect(progress.getAttribute("aria-valuemax")).toBe(String(threshold));
      expect(
        screen.getByText(new RegExp(`Free shipping at .*${threshold}`))
      ).toBeTruthy();
      expect(currency).toBe("USD");
    }
  );
});
