import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderToString } from "react-dom/server";
import RootLayout from "@/app/layout";
import { MarketProvider, useMarket } from "@/lib/market/context";
import { getVisitorMarket } from "@/lib/market/visitor";
import { DEFAULT_MARKET, getMarket } from "@/lib/market/markets";
import { MARKET_COOKIE_NAME } from "@/lib/market/cookies";

let mockCookieValue: string | undefined = undefined;

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) =>
      name === MARKET_COOKIE_NAME && mockCookieValue !== undefined
        ? { name: MARKET_COOKIE_NAME, value: mockCookieValue }
        : undefined,
  }),
}));

vi.mock("next/font/google", () => ({
  Archivo: () => ({ variable: "--font-archivo" }),
  DM_Sans: () => ({ variable: "--font-dm-sans" }),
}));

function ClientMarketConsumer() {
  const { market, formatMoney, formatPrice } = useMarket();
  return (
    <div data-testid="client-market-consumer">
      <span data-testid="market-id">{market.id}</span>
      <span data-testid="currency-code">{market.currency.code}</span>
      <span data-testid="currency-symbol">{market.currency.symbol}</span>
      <span data-testid="formatted-money">
        {formatMoney({ amount: 65, currencyCode: "USD" })}
      </span>
      <span data-testid="formatted-price">{formatPrice(100)}</span>
    </div>
  );
}

describe("W2-37: MarketProvider no layout raiz", () => {
  beforeEach(() => {
    mockCookieValue = undefined;
  });

  describe("getVisitorMarket helper", () => {
    it("returns DEFAULT_MARKET (us) when no cookie is set", async () => {
      mockCookieValue = undefined;
      const market = await getVisitorMarket();
      expect(market.id).toBe(DEFAULT_MARKET.id);
      expect(market.currency.code).toBe("USD");
    });

    it("reads the UK market when nadeon_market cookie is 'gb'", async () => {
      mockCookieValue = "gb";
      const market = await getVisitorMarket();
      expect(market.id).toBe("gb");
      expect(market.currency.code).toBe("GBP");
      expect(market.currency.symbol).toBe("£");
    });

    it("reads the Canada market when nadeon_market cookie is 'ca'", async () => {
      mockCookieValue = "ca";
      const market = await getVisitorMarket();
      expect(market.id).toBe("ca");
      expect(market.currency.code).toBe("CAD");
    });

    it("reads the EU market when nadeon_market cookie is 'eu'", async () => {
      mockCookieValue = "eu";
      const market = await getVisitorMarket();
      expect(market.id).toBe("eu");
      expect(market.currency.code).toBe("EUR");
      expect(market.currency.symbol).toBe("€");
    });

    it("reads the Australia market when nadeon_market cookie is 'au'", async () => {
      mockCookieValue = "au";
      const market = await getVisitorMarket();
      expect(market.id).toBe("au");
      expect(market.currency.code).toBe("AUD");
    });

    it("falls back to DEFAULT_MARKET when cookie has invalid market value", async () => {
      mockCookieValue = "invalid-market";
      const market = await getVisitorMarket();
      expect(market.id).toBe(DEFAULT_MARKET.id);
    });
  });

  describe("RootLayout wrapping with MarketProvider", () => {
    it("wraps children in MarketProvider with initialMarket matching cookie 'gb'", async () => {
      mockCookieValue = "gb";
      const rootJsx = await RootLayout({
        children: <ClientMarketConsumer />,
      });

      // Verify root structure
      expect(rootJsx).toBeDefined();
      expect(rootJsx.type).toBe("html");

      // Render to string and verify client component rendered UK market
      const html = renderToString(rootJsx);
      expect(html).toContain('data-testid="market-id">gb<');
      expect(html).toContain('data-testid="currency-code">GBP<');
      expect(html).toContain('data-testid="currency-symbol">£<');
      expect(html).toContain("£51.35");
      expect(html).toContain("£79.00");
    });

    it("renders client component with US default market when cookie is absent", async () => {
      mockCookieValue = undefined;
      const rootJsx = await RootLayout({
        children: <ClientMarketConsumer />,
      });

      const html = renderToString(rootJsx);
      expect(html).toContain('data-testid="market-id">us<');
      expect(html).toContain('data-testid="currency-code">USD<');
      expect(html).toContain('data-testid="currency-symbol">$<');
      expect(html).toContain("$65.00");
      expect(html).toContain("$100.00");
    });

    it("renders client component with CA market when cookie is 'ca'", async () => {
      mockCookieValue = "ca";
      const rootJsx = await RootLayout({
        children: <ClientMarketConsumer />,
      });

      const html = renderToString(rootJsx);
      expect(html).toContain('data-testid="market-id">ca<');
      expect(html).toContain('data-testid="currency-code">CAD<');
      expect(html).toContain("$88.40");
      expect(html).toContain("$136.00");
    });

    it("renders client component with EU market when cookie is 'eu'", async () => {
      mockCookieValue = "eu";
      const rootJsx = await RootLayout({
        children: <ClientMarketConsumer />,
      });

      const html = renderToString(rootJsx);
      expect(html).toContain('data-testid="market-id">eu<');
      expect(html).toContain('data-testid="currency-code">EUR<');
      expect(html).toContain("€59.80");
      expect(html).toContain("€92.00");
    });
  });

  describe("MarketProvider component isolated behavior", () => {
    it("provides initial market passed as Market object", () => {
      const gbMarket = getMarket("gb")!;
      const html = renderToString(
        <MarketProvider initialMarket={gbMarket}>
          <ClientMarketConsumer />
        </MarketProvider>
      );
      expect(html).toContain('data-testid="market-id">gb<');
      expect(html).toContain('data-testid="currency-code">GBP<');
      expect(html).toContain("£51.35");
      expect(html).toContain("£79.00");
    });

    it("provides initial market passed as string ID", () => {
      const html = renderToString(
        <MarketProvider initialMarket="au">
          <ClientMarketConsumer />
        </MarketProvider>
      );
      expect(html).toContain('data-testid="market-id">au<');
      expect(html).toContain('data-testid="currency-code">AUD<');
      expect(html).toContain("$98.80");
      expect(html).toContain("$152.00");
    });

    it("falls back to DEFAULT_MARKET when initialMarket is undefined and no cookie", () => {
      const html = renderToString(
        <MarketProvider>
          <ClientMarketConsumer />
        </MarketProvider>
      );
      expect(html).toContain('data-testid="market-id">us<');
      expect(html).toContain('data-testid="currency-code">USD<');
    });
  });
});
