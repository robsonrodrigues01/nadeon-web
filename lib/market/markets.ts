import type { Market, MarketCurrency } from "./types";

const USD_CURRENCY: MarketCurrency = {
  code: "USD",
  symbol: "$",
  name: "US Dollar",
  fractionDigits: 2,
};

const USD_LOCALE = "en-US";

export const SUPPORTED_MARKETS: Market[] = [
  {
    id: "us",
    countryCode: "US",
    name: "United States",
    region: "North America",
    currency: USD_CURRENCY,
    locale: USD_LOCALE,
    rate: 1.0,
    flag: "🇺🇸",
    freeShipping: { human: 75, pet: 49 },
    taxNotice: "Sales tax calculated at checkout where applicable.",
  },
  {
    id: "ca",
    countryCode: "CA",
    name: "Canada",
    region: "North America",
    currency: USD_CURRENCY,
    locale: USD_LOCALE,
    rate: 1.0,
    flag: "🇨🇦",
    freeShipping: null,
    taxNotice: "Import duties and GST/HST paid by recipient upon delivery.",
  },
  {
    id: "gb",
    countryCode: "GB",
    name: "United Kingdom",
    region: "Europe",
    currency: USD_CURRENCY,
    locale: USD_LOCALE,
    rate: 1.0,
    flag: "🇬🇧",
    freeShipping: null,
    taxNotice: "Import duties and VAT paid by recipient upon delivery.",
  },
  {
    id: "eu",
    countryCode: "EU",
    name: "European Union",
    region: "Europe",
    currency: USD_CURRENCY,
    locale: USD_LOCALE,
    rate: 1.0,
    flag: "🇪🇺",
    freeShipping: null,
    taxNotice: "Import duties and local VAT paid by recipient upon delivery.",
  },
  {
    id: "au",
    countryCode: "AU",
    name: "Australia",
    region: "Asia Pacific",
    currency: USD_CURRENCY,
    locale: USD_LOCALE,
    rate: 1.0,
    flag: "🇦🇺",
    freeShipping: null,
    taxNotice: "Import duties and GST paid by recipient upon delivery.",
  },
  {
    id: "jp",
    countryCode: "JP",
    name: "Japan",
    region: "Asia Pacific",
    currency: USD_CURRENCY,
    locale: USD_LOCALE,
    rate: 1.0,
    flag: "🇯🇵",
    freeShipping: null,
    taxNotice: "Import consumption taxes paid by recipient upon delivery.",
  },
  {
    id: "ch",
    countryCode: "CH",
    name: "Switzerland",
    region: "Europe",
    currency: USD_CURRENCY,
    locale: USD_LOCALE,
    rate: 1.0,
    flag: "🇨🇭",
    freeShipping: null,
    taxNotice: "Import duties and Swiss VAT paid by recipient upon delivery.",
  },
];

export const DEFAULT_MARKET: Market = SUPPORTED_MARKETS[0];

export function getMarket(idOrCode?: string | null): Market | undefined {
  if (!idOrCode) return undefined;
  const normalized = idOrCode.trim().toLowerCase();
  return SUPPORTED_MARKETS.find(
    (m) =>
      m.id.toLowerCase() === normalized ||
      m.countryCode.toLowerCase() === normalized
  );
}

export function getDefaultMarket(): Market {
  return DEFAULT_MARKET;
}
