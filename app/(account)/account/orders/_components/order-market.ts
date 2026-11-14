import {
  DEFAULT_MARKET,
  formatMoneyWithMarket,
  getMarket,
  type Market,
} from "@/lib/market";
import type { OrderFormatters } from "./order-view";

/** Market chosen by the shopper (cookie), falling back to the default market. */
export function resolveOrderMarket(marketId?: string | null): Market {
  return getMarket(marketId) ?? DEFAULT_MARKET;
}

/** Prices go through the market formatter; dates and countries follow the market locale. */
export function createOrderFormatters(market: Market): OrderFormatters {
  const dateFormat = new Intl.DateTimeFormat(market.locale, {
    dateStyle: "medium",
  });
  const regionNames = new Intl.DisplayNames([market.locale], {
    type: "region",
  });
  return {
    money: (money) => formatMoneyWithMarket(money, market),
    date: (iso) => dateFormat.format(new Date(iso)),
    country: (code) => regionNames.of(code) ?? code,
  };
}
