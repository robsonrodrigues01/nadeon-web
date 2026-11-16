import { describe, it, expect } from "vitest";
import {
  convertAmount,
  formatMarketPrice,
  formatMoneyWithMarket,
} from "@/lib/market/formatter";
import { getMarket } from "@/lib/market/markets";

const US = getMarket("us")!;
const GB = getMarket("gb")!;
const JP = getMarket("jp")!;

describe("W3-74: convertAmount", () => {
  it("rounds cleanly to 0 fraction digits for zero-decimal currencies (e.g. JPY)", () => {
    // 10.55 * 155 = 1635.25 -> 1635
    expect(convertAmount(10.55, 155, 0)).toBe(1635);
    // 10.56 * 155 = 1636.8 -> 1637
    expect(convertAmount(10.56, 155, 0)).toBe(1637);
    // half-way rounding
    expect(convertAmount(1.4, 1, 0)).toBe(1);
    expect(convertAmount(1.5, 1, 0)).toBe(2);
  });

  it("rounds cleanly to 2 fraction digits for standard currencies", () => {
    // 19.99 * 1.36 = 27.1864 -> 27.19
    expect(convertAmount(19.99, 1.36, 2)).toBe(27.19);
    // 10.004 -> 10, 10.006 -> 10.01
    expect(convertAmount(10.004, 1, 2)).toBe(10);
    expect(convertAmount(10.006, 1, 2)).toBe(10.01);
  });

  it("handles edge cases: zero, negative amounts, and rate 1.0", () => {
    expect(convertAmount(0, 1.36, 2)).toBe(0);
    expect(convertAmount(-10, 1.5, 2)).toBe(-15);
    expect(convertAmount(42.5, 1.0, 2)).toBe(42.5);
  });

  it("supports arbitrary fraction digits", () => {
    expect(convertAmount(1.0004, 1, 3)).toBe(1);
    expect(convertAmount(1.0006, 1, 3)).toBe(1.001);
  });
});

describe("W3-74: formatMarketPrice", () => {
  it("formats standard amounts with currency code and locale", () => {
    expect(formatMarketPrice(25, "USD", "en-US")).toBe("$25.00");
    expect(formatMarketPrice(25, "GBP", "en-GB")).toBe("£25.00");
  });

  it("handles non-finite values safely by formatting 0 instead of throwing or NaN", () => {
    expect(formatMarketPrice(NaN, "USD", "en-US")).toBe("$0.00");
    expect(formatMarketPrice(Infinity, "USD", "en-US")).toBe("$0.00");
    expect(formatMarketPrice(-Infinity, "USD", "en-US")).toBe("$0.00");
  });

  it("falls back gracefully to en-US when given an unsupported or invalid locale", () => {
    expect(formatMarketPrice(50, "USD", "unsupported-locale-xyz-999")).toBe(
      "$50.00"
    );
  });

  it("passes custom Intl.NumberFormatOptions", () => {
    expect(
      formatMarketPrice(25, "USD", "en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    ).toBe("$25");
  });
});

describe("W3-74: formatMoneyWithMarket", () => {
  it("formats a number using default market (US)", () => {
    expect(formatMoneyWithMarket(75)).toBe("$75.00");
  });

  it("converts numeric amount according to market rate and fraction digits", () => {
    // US -> GB: 10 * 0.79 = 7.90 GBP
    expect(formatMoneyWithMarket(10, GB)).toBe("£7.90");
    // US -> JP: 10 * 155 = 1550 JPY (0 fraction digits)
    expect(formatMoneyWithMarket(10, JP)).toBe(
      new Intl.NumberFormat(JP.locale, {
        style: "currency",
        currency: JP.currency.code,
      }).format(1550)
    );
  });

  it("respects options.convert = false for numeric amounts", () => {
    expect(formatMoneyWithMarket(10, GB, { convert: false })).toBe("£10.00");
    expect(formatMoneyWithMarket(10, JP, { convert: false })).toBe(
      new Intl.NumberFormat(JP.locale, {
        style: "currency",
        currency: JP.currency.code,
      }).format(10)
    );
  });

  it("converts Money object when currencyCode is USD and target is non-USD", () => {
    expect(formatMoneyWithMarket({ amount: 10, currencyCode: "USD" }, GB)).toBe(
      "£7.90"
    );
    expect(formatMoneyWithMarket({ amount: 10, currencyCode: "USD" }, JP)).toBe(
      new Intl.NumberFormat(JP.locale, {
        style: "currency",
        currency: JP.currency.code,
      }).format(1550)
    );
  });

  it("does not convert Money object when currencyCode is already non-USD", () => {
    // Already in GBP: amount remains 10 GBP, not multiplied by 0.79
    expect(formatMoneyWithMarket({ amount: 10, currencyCode: "GBP" }, GB)).toBe(
      "£10.00"
    );
  });

  it("does not convert Money object when options.convert = false", () => {
    expect(
      formatMoneyWithMarket({ amount: 10, currencyCode: "USD" }, GB, {
        convert: false,
      })
    ).toBe("£10.00");
  });

  it("accepts custom currency, locale, and fraction digits options", () => {
    expect(
      formatMoneyWithMarket(50, US, {
        currency: "EUR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    ).toBe("€50");
  });

  it("falls back gracefully when options specify an invalid locale", () => {
    expect(
      formatMoneyWithMarket(100, US, {
        locale: "invalid-locale-123",
      })
    ).toBe("$100.00");
  });
});
