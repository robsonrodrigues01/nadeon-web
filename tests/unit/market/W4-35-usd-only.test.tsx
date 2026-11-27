// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import {
  DEFAULT_MARKET,
  MARKET_COOKIE_NAME,
  MarketProvider,
  MoneyDisplay,
  SUPPORTED_MARKETS,
  formatMarketPrice,
  formatMoneyWithMarket,
  getInternationalShippingNotice,
  getMarket,
  useMarket,
} from "@/lib/market";
import { getVisitorMarket } from "@/lib/market/visitor";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/commerce/cart-drawer";
import { CartView } from "@/app/(shared)/cart/_components/cart-view";
import ShippingReturnsPage from "@/app/(shared)/shipping-returns/page";
import {
  cartProvider,
  type Cart,
  type CartProvider,
} from "@/lib/providers/client";
import { toCartCatalogProduct } from "@/app/(shared)/cart/_components/types";
import { mockCatalogProvider } from "@/lib/providers/mock/catalog";

const mockCookieValue = vi.hoisted(() => ({
  value: undefined as string | undefined,
}));

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) =>
      name === MARKET_COOKIE_NAME && mockCookieValue.value !== undefined
        ? { name: MARKET_COOKIE_NAME, value: mockCookieValue.value }
        : undefined,
  }),
}));

const sampleCart: Cart = {
  id: "cart_w4_35",
  lines: [
    {
      id: "line_1",
      variantId: "var_biohack_1",
      quantity: 1,
      product: {
        id: "biohack",
        handle: "biohack",
        title: "BioHack",
        image: "/images/biohack.webp",
        line: "human",
      },
      price: { amount: 65, currencyCode: "USD" },
      total: { amount: 65, currencyCode: "USD" },
    },
  ],
  discountCodes: [],
  subtotalPrice: { amount: 65, currencyCode: "USD" },
  totalDiscount: { amount: 0, currencyCode: "USD" },
  totalPrice: { amount: 65, currencyCode: "USD" },
  totalQuantity: 1,
  checkoutUrl: "https://checkout.example/cart_w4_35",
};

const stubCartProvider: CartProvider = {
  get: async () => sampleCart,
  create: async () => sampleCart,
  addLines: async () => sampleCart,
  addKit: async () => sampleCart,
  updateLines: async () => sampleCart,
  removeLines: async () => sampleCart,
  applyDiscount: async () => sampleCart,
  setLineSellingPlan: async () => sampleCart,
  checkoutUrl: async () => sampleCart.checkoutUrl,
};

function MarketProbe() {
  const { market, formatMoney, formatPrice } = useMarket();
  return (
    <div>
      <span data-testid="probe-market">{market.id}</span>
      <span data-testid="probe-currency">{market.currency.code}</span>
      <span data-testid="probe-money">
        {formatMoney({ amount: 65, currencyCode: "USD" })}
      </span>
      <span data-testid="probe-price">{formatPrice(49)}</span>
      <MoneyDisplay amount={75} currencyCode="USD" />
    </div>
  );
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  mockCookieValue.value = undefined;
  document.cookie = `${MARKET_COOKIE_NAME}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
});

describe("W4-35: single USD currency, no selector, international notices", () => {
  describe("1. USD-only formatter & market layer", () => {
    it("configures every supported market in USD with rate 1 and en-US formatting", () => {
      for (const market of SUPPORTED_MARKETS) {
        expect(market.currency.code).toBe("USD");
        expect(market.currency.symbol).toBe("$");
        expect(market.currency.fractionDigits).toBe(2);
        expect(market.rate).toBe(1);
        expect(market.locale).toBe("en-US");
      }
      expect(DEFAULT_MARKET.id).toBe("us");
    });

    it("formats any market (including CA and GB) as USD $ without conversion", () => {
      for (const id of ["us", "ca", "gb", "eu", "au", "jp", "ch"]) {
        const market = getMarket(id)!;
        expect(market).toBeDefined();
        expect(formatMoneyWithMarket(65, market)).toBe("$65.00");
        expect(
          formatMoneyWithMarket({ amount: 44, currencyCode: "USD" }, market)
        ).toBe("$44.00");
      }
      expect(formatMarketPrice(25, "GBP", "en-GB")).toBe("$25.00");
      expect(formatMarketPrice(50, "EUR", "de-DE")).toBe("$50.00");
    });

    it("keeps visitor country from cookie while rendering USD in MarketProvider", async () => {
      mockCookieValue.value = "ca";
      const visitor = await getVisitorMarket();
      expect(visitor.id).toBe("ca");
      expect(visitor.countryCode).toBe("CA");
      expect(visitor.freeShipping).toBeNull();
      expect(visitor.currency.code).toBe("USD");

      document.cookie = `${MARKET_COOKIE_NAME}=gb`;
      render(
        <MarketProvider>
          <MarketProbe />
        </MarketProvider>
      );

      expect((await screen.findByTestId("probe-market")).textContent).toBe(
        "gb"
      );
      expect(screen.getByTestId("probe-currency").textContent).toBe("USD");
      expect(screen.getByTestId("probe-money").textContent).toBe("$65.00");
      expect(screen.getByTestId("probe-price").textContent).toBe("$49.00");
      expect(screen.getByText("$75.00")).toBeTruthy();
    });
  });

  describe("2. No country/currency selector in Header or Footer", () => {
    it("renders neither a country nor currency selector in Header", () => {
      render(
        <MarketProvider initialMarket="gb">
          <Header variant="human" />
          <Header variant="pet" />
        </MarketProvider>
      );

      expect(screen.queryByRole("combobox")).toBeNull();
      expect(
        screen.queryByRole("button", { name: /country|currency/i })
      ).toBeNull();
    });

    it("renders neither a country nor currency selector in Footer", () => {
      render(
        <MarketProvider initialMarket="ca">
          <Footer line="human" />
          <Footer line="pet" />
        </MarketProvider>
      );

      expect(screen.queryByRole("combobox")).toBeNull();
      expect(
        screen.queryByRole("button", { name: /country|currency/i })
      ).toBeNull();
    });
  });

  describe("3. International shipping & duties notices", () => {
    it("returns an international notice only for non-US markets", () => {
      expect(getInternationalShippingNotice(getMarket("us")!)).toBeNull();

      for (const id of ["ca", "gb", "eu", "au", "jp", "ch"]) {
        const notice = getInternationalShippingNotice(getMarket(id)!);
        expect(notice).toBeTruthy();
        expect(notice).toMatch(/international shipping/i);
        expect(notice).toMatch(/USD/);
        expect(notice).toMatch(/import duties and taxes/i);
        expect(notice).toMatch(/on delivery/i);
        expect(notice).toMatch(/calculated at checkout/i);
      }
    });

    it("shows the international notice in CartDrawer for non-US visitors and omits it for US visitors", () => {
      const { unmount } = render(
        <MarketProvider initialMarket="gb">
          <CartDrawer
            isOpen={true}
            theme="human"
            cart={sampleCart}
            cartProvider={stubCartProvider}
          />
        </MarketProvider>
      );

      const gbNotice = screen.getByRole("note", {
        name: /international shipping/i,
      });
      expect(gbNotice.textContent).toMatch(/USD/);
      expect(gbNotice.textContent).toMatch(/import duties and taxes/i);
      expect(gbNotice.textContent).toMatch(/on delivery/i);
      expect(gbNotice.textContent).toMatch(/calculated at checkout/i);
      expect(
        screen.queryByRole("progressbar", { name: "Free shipping progress" })
      ).toBeNull();
      expect(screen.getAllByText("$65.00").length).toBeGreaterThan(0);

      unmount();

      render(
        <MarketProvider initialMarket="us">
          <CartDrawer
            isOpen={true}
            theme="human"
            cart={sampleCart}
            cartProvider={stubCartProvider}
          />
        </MarketProvider>
      );

      expect(
        screen.queryByRole("note", { name: /international shipping/i })
      ).toBeNull();
      expect(
        screen.getByText("Taxes and shipping calculated at checkout")
      ).toBeTruthy();
      expect(
        screen.getByRole("progressbar", { name: "Free shipping progress" })
      ).toBeTruthy();
    });

    it("shows the international notice in /cart before checkout for non-US visitors and omits it for US visitors", async () => {
      const catalog = (await mockCatalogProvider.getProducts()).map(
        toCartCatalogProduct
      );
      vi.spyOn(cartProvider, "get").mockResolvedValue(sampleCart);

      const { unmount } = render(
        <MarketProvider initialMarket="ca">
          <CartView catalog={catalog} />
        </MarketProvider>
      );

      const summary = await screen.findByRole("region", {
        name: "Order summary",
      });
      const caNotice = within(summary).getByRole("note", {
        name: /international shipping/i,
      });
      expect(caNotice.textContent).toMatch(/USD/);
      expect(caNotice.textContent).toMatch(/import duties and taxes/i);
      expect(caNotice.textContent).toMatch(/on delivery/i);
      expect(caNotice.textContent).toMatch(/calculated at checkout/i);
      expect(within(summary).getAllByText("$65.00").length).toBeGreaterThan(0);

      unmount();

      render(
        <MarketProvider initialMarket="us">
          <CartView catalog={catalog} />
        </MarketProvider>
      );

      const usSummary = await screen.findByRole("region", {
        name: "Order summary",
      });
      expect(
        within(usSummary).queryByRole("note", {
          name: /international shipping/i,
        })
      ).toBeNull();
      expect(
        within(usSummary).getByText("Taxes and shipping calculated at checkout")
      ).toBeTruthy();
    });

    it("shows the international notice on /shipping-returns for non-US visitors and keeps US text for US visitors", async () => {
      mockCookieValue.value = "gb";
      const { unmount } = render(await ShippingReturnsPage());

      const gbNotice = screen.getByRole("note", {
        name: /international shipping/i,
      });
      expect(gbNotice.textContent).toMatch(/international shipping/i);
      expect(gbNotice.textContent).toMatch(/USD/);
      expect(gbNotice.textContent).toMatch(/import duties and taxes/i);
      expect(gbNotice.textContent).toMatch(/on delivery/i);
      expect(gbNotice.textContent).toMatch(/calculated at checkout/i);
      expect(screen.queryByText(/Free shipping over \$75/i)).toBeNull();

      unmount();

      mockCookieValue.value = undefined;
      render(await ShippingReturnsPage());

      expect(
        screen.queryByRole("note", { name: /international shipping/i })
      ).toBeNull();
      expect(
        screen.getAllByText(/Free shipping over \$75/i).length
      ).toBeGreaterThan(0);
      expect(
        screen.getByText("Sales tax calculated at checkout where applicable.")
      ).toBeTruthy();
    });
  });
});
