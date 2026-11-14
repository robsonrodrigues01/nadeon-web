"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { Money } from "@/lib/contracts/catalog";
import type { FormatMoneyOptions, Market, MarketContextValue } from "./types";
import { DEFAULT_MARKET, SUPPORTED_MARKETS, getMarket } from "./markets";
import { getMarketCookie, setMarketCookie } from "./cookies";
import { formatMoneyWithMarket } from "./formatter";

const MarketContext = createContext<MarketContextValue | null>(null);

export interface MarketProviderProps {
  children: React.ReactNode;
  initialMarket?: Market | string;
}

export function MarketProvider({
  children,
  initialMarket,
}: MarketProviderProps) {
  const [market, setMarketState] = useState<Market>(() => {
    if (typeof initialMarket === "object" && initialMarket) {
      return initialMarket;
    }
    if (typeof initialMarket === "string") {
      const found = getMarket(initialMarket);
      if (found) return found;
    }
    const cookieValue = getMarketCookie();
    if (cookieValue) {
      const found = getMarket(cookieValue);
      if (found) return found;
    }
    return DEFAULT_MARKET;
  });

  const setMarket = useCallback((marketIdOrCode: string) => {
    const target = getMarket(marketIdOrCode);
    if (!target) return;
    setMarketState(target);
    setMarketCookie(target.id);
  }, []);

  const formatMoney = useCallback(
    (money: Money | number, options?: FormatMoneyOptions) => {
      return formatMoneyWithMarket(money, market, options);
    },
    [market]
  );

  const formatPrice = useCallback(
    (amount: number, options?: FormatMoneyOptions) => {
      return formatMoneyWithMarket(amount, market, options);
    },
    [market]
  );

  const value = useMemo<MarketContextValue>(
    () => ({
      market,
      markets: SUPPORTED_MARKETS,
      setMarket,
      formatMoney,
      formatPrice,
    }),
    [market, setMarket, formatMoney, formatPrice]
  );

  return (
    <MarketContext.Provider value={value}>{children}</MarketContext.Provider>
  );
}

export function useMarket(): MarketContextValue {
  const ctx = useContext(MarketContext);
  if (!ctx) {
    return {
      market: DEFAULT_MARKET,
      markets: SUPPORTED_MARKETS,
      setMarket: () => {},
      formatMoney: (money, options) =>
        formatMoneyWithMarket(money, DEFAULT_MARKET, options),
      formatPrice: (amount, options) =>
        formatMoneyWithMarket(amount, DEFAULT_MARKET, options),
    };
  }
  return ctx;
}
