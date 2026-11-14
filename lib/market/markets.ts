import type { Market } from "./types";

export const SUPPORTED_MARKETS: Market[] = [
  {
    id: "us",
    countryCode: "US",
    name: "United States",
    region: "North America",
    currency: {
      code: "USD",
      symbol: "$",
      name: "US Dollar",
      fractionDigits: 2,
    },
    locale: "en-US",
    rate: 1.0,
    flag: "🇺🇸",
    taxNotice: "Sales tax calculated at checkout where applicable.",
  },
  {
    id: "ca",
    countryCode: "CA",
    name: "Canada",
    region: "North America",
    currency: {
      code: "CAD",
      symbol: "CA$",
      name: "Canadian Dollar",
      fractionDigits: 2,
    },
    locale: "en-CA",
    rate: 1.36,
    flag: "🇨🇦",
    taxNotice: "Import duties and GST/HST paid by recipient upon delivery.",
  },
  {
    id: "gb",
    countryCode: "GB",
    name: "United Kingdom",
    region: "Europe",
    currency: {
      code: "GBP",
      symbol: "£",
      name: "British Pound",
      fractionDigits: 2,
    },
    locale: "en-GB",
    rate: 0.79,
    flag: "🇬🇧",
    taxNotice: "Import duties and VAT paid by recipient upon delivery.",
  },
  {
    id: "eu",
    countryCode: "EU",
    name: "European Union",
    region: "Europe",
    currency: {
      code: "EUR",
      symbol: "€",
      name: "Euro",
      fractionDigits: 2,
    },
    locale: "en-IE",
    rate: 0.92,
    flag: "🇪🇺",
    taxNotice: "Import duties and local VAT paid by recipient upon delivery.",
  },
  {
    id: "au",
    countryCode: "AU",
    name: "Australia",
    region: "Asia Pacific",
    currency: {
      code: "AUD",
      symbol: "A$",
      name: "Australian Dollar",
      fractionDigits: 2,
    },
    locale: "en-AU",
    rate: 1.52,
    flag: "🇦🇺",
    taxNotice: "Import duties and GST paid by recipient upon delivery.",
  },
  {
    id: "jp",
    countryCode: "JP",
    name: "Japan",
    region: "Asia Pacific",
    currency: {
      code: "JPY",
      symbol: "¥",
      name: "Japanese Yen",
      fractionDigits: 0,
    },
    locale: "ja-JP",
    rate: 155,
    flag: "🇯🇵",
    taxNotice: "Import consumption taxes paid by recipient upon delivery.",
  },
  {
    id: "ch",
    countryCode: "CH",
    name: "Switzerland",
    region: "Europe",
    currency: {
      code: "CHF",
      symbol: "CHF",
      name: "Swiss Franc",
      fractionDigits: 2,
    },
    locale: "de-CH",
    rate: 0.88,
    flag: "🇨🇭",
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
