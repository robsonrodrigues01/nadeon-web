import type { Money, ProductLine } from "@/lib/contracts/catalog";
import type { Market } from "./types";
import { formatMarketPrice } from "./formatter";

/**
 * Free shipping threshold for a product line in a market, as Money in the market currency.
 * Returns null when the market advertises no free shipping (Rule 14: values come from markets).
 */
export function getFreeShippingThreshold(
  market: Market,
  line: ProductLine
): Money | null {
  const thresholds = market.freeShipping;
  if (!thresholds) return null;
  return { amount: thresholds[line], currencyCode: market.currency.code };
}

/** Threshold formatted in the market currency, e.g. "$75"; null without free shipping. */
export function formatFreeShippingThreshold(
  market: Market,
  line: ProductLine
): string | null {
  const threshold = getFreeShippingThreshold(market, line);
  if (!threshold) return null;
  return formatMarketPrice(
    threshold.amount,
    threshold.currencyCode,
    market.locale,
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: market.currency.fractionDigits,
    }
  );
}

/** Announcement copy, e.g. "Free shipping over $75"; null without free shipping. */
export function formatFreeShippingLabel(
  market: Market,
  line: ProductLine
): string | null {
  const price = formatFreeShippingThreshold(market, line);
  return price === null ? null : `Free shipping over ${price}`;
}
