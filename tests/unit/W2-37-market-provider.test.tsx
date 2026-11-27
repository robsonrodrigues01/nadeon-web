// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderToString } from "react-dom/server";
import { render, screen, cleanup } from "@testing-library/react";
import RootLayout from "@/app/layout";
import { MarketProvider, useMarket } from "@/lib/market/context";
import { getVisitorMarket } from "@/lib/market/visitor";
import { DEFAULT_MARKET, getMarket } from "@/lib/market/markets";
import { MARKET_COOKIE_NAME } from "@/lib/market/cookies";
import DogsPage from "@/app/(pet)/pet/dogs/page";
import HumanShopPage from "@/app/(human)/human/shop/page";

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

describe("W2-37: MarketProvider e isolamento SSR / hidratação", () => {
  beforeEach(() => {
    mockCookieValue = undefined;
    document.cookie = `${MARKET_COOKIE_NAME}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  });

  afterEach(() => {
    cleanup();
  });

  describe("RootLayout (síncrono e isolado de cookies)", () => {
    it("é síncrono e envolve children em MarketProvider sem initialMarket", () => {
      // RootLayout must not return a Promise
      const result = RootLayout({
        children: <ClientMarketConsumer />,
      });
      expect(result).not.toBeInstanceOf(Promise);
      expect(result).toBeDefined();
      expect(result.type).toBe("html");

      // No SSR render, mesmo se houver cookie, o provider sem initialMarket inicia em DEFAULT_MARKET
      document.cookie = `${MARKET_COOKIE_NAME}=gb`;
      const html = renderToString(result);
      expect(html).toContain('data-testid="market-id">us<');
      expect(html).toContain('data-testid="currency-code">USD<');
    });
  });

  describe("getVisitorMarket helper", () => {
    it("returns DEFAULT_MARKET (us) when no cookie is set", async () => {
      mockCookieValue = undefined;
      const market = await getVisitorMarket();
      expect(market.id).toBe(DEFAULT_MARKET.id);
      expect(market.currency.code).toBe("USD");
    });

    it("reads the UK market when nadeon_market cookie is 'gb' and keeps USD currency", async () => {
      mockCookieValue = "gb";
      const market = await getVisitorMarket();
      expect(market.id).toBe("gb");
      expect(market.currency.code).toBe("USD");
      expect(market.currency.symbol).toBe("$");
    });

    it("reads the Canada market when nadeon_market cookie is 'ca' and keeps USD currency", async () => {
      mockCookieValue = "ca";
      const market = await getVisitorMarket();
      expect(market.id).toBe("ca");
      expect(market.currency.code).toBe("USD");
    });

    it("reads the EU market when nadeon_market cookie is 'eu' and keeps USD currency", async () => {
      mockCookieValue = "eu";
      const market = await getVisitorMarket();
      expect(market.id).toBe("eu");
      expect(market.currency.code).toBe("USD");
      expect(market.currency.symbol).toBe("$");
    });

    it("reads the Australia market when nadeon_market cookie is 'au' and keeps USD currency", async () => {
      mockCookieValue = "au";
      const market = await getVisitorMarket();
      expect(market.id).toBe("au");
      expect(market.currency.code).toBe("USD");
    });

    it("falls back to DEFAULT_MARKET when cookie has invalid market value", async () => {
      mockCookieValue = "invalid-market";
      const market = await getVisitorMarket();
      expect(market.id).toBe(DEFAULT_MARKET.id);
    });
  });

  describe("MarketProvider sem initialMarket", () => {
    it("no SSR (renderToString) inicia em DEFAULT_MARKET mesmo com cookie no documento", () => {
      document.cookie = `${MARKET_COOKIE_NAME}=gb`;
      const html = renderToString(
        <MarketProvider>
          <ClientMarketConsumer />
        </MarketProvider>
      );
      // Evita erro de hidratação: no SSR não lê cookie, começa em US
      expect(html).toContain('data-testid="market-id">us<');
      expect(html).toContain('data-testid="currency-code">USD<');
    });

    it("aplica o cookie do mercado após montar no cliente mantendo USD (useEffect)", async () => {
      document.cookie = `${MARKET_COOKIE_NAME}=gb`;
      render(
        <MarketProvider>
          <ClientMarketConsumer />
        </MarketProvider>
      );

      // No cliente, após a montagem o useEffect aplica o cookie (país), mantendo USD
      const marketIdEl = await screen.findByTestId("market-id");
      expect(marketIdEl.textContent).toBe("gb");

      const currencyEl = screen.getByTestId("currency-code");
      expect(currencyEl.textContent).toBe("USD");

      const symbolEl = screen.getByTestId("currency-symbol");
      expect(symbolEl.textContent).toBe("$");

      const formattedMoneyEl = screen.getByTestId("formatted-money");
      expect(formattedMoneyEl.textContent).toBe("$65.00");
    });

    it("permanece em DEFAULT_MARKET se nenhum cookie estiver presente", async () => {
      render(
        <MarketProvider>
          <ClientMarketConsumer />
        </MarketProvider>
      );

      const marketIdEl = await screen.findByTestId("market-id");
      expect(marketIdEl.textContent).toBe("us");
      expect(screen.getByTestId("currency-code").textContent).toBe("USD");
    });
  });

  describe("Páginas dinâmicas com initialMarket", () => {
    it("MarketProvider com initialMarket sai no HTML inicial no mercado especificado em USD", () => {
      const gbMarket = getMarket("gb")!;
      const html = renderToString(
        <MarketProvider initialMarket={gbMarket}>
          <ClientMarketConsumer />
        </MarketProvider>
      );
      expect(html).toContain('data-testid="market-id">gb<');
      expect(html).toContain('data-testid="currency-code">USD<');
      expect(html).toContain("$65.00");
    });

    it("página dinâmica /pet/dogs entrega initialMarket={market} e renderiza em USD mesmo com cookie gb", async () => {
      mockCookieValue = "gb";
      const pageJsx = await DogsPage();
      const html = renderToString(pageJsx);

      expect(html).toContain("$");
      expect(html).not.toContain("£");
    });

    it("página dinâmica /human/shop entrega initialMarket={market} e renderiza em USD mesmo com cookie eu", async () => {
      mockCookieValue = "eu";
      const pageJsx = await HumanShopPage();
      const html = renderToString(pageJsx);

      expect(html).toContain("$");
      expect(html).not.toContain("€");
    });
  });
});
