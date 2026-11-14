import { describe, it, expect } from "vitest";
import {
  SUPPORTED_MARKETS,
  getFreeShippingThreshold,
  formatFreeShippingLabel,
  formatFreeShippingThreshold,
  getMarket,
} from "@/lib/market";

const US = getMarket("us")!;
const GB = getMarket("gb")!;

describe("W1-26: free shipping thresholds per market", () => {
  it("keeps the design thresholds for the US market: Human $75, Pet $49", () => {
    expect(US.freeShipping).toEqual({ human: 75, pet: 49 });
  });

  it("advertises no free shipping in the other markets", () => {
    const others = SUPPORTED_MARKETS.filter((m) => m.id !== "us");
    expect(others.length).toBeGreaterThan(0);
    for (const market of others) {
      expect(market.freeShipping).toBeNull();
    }
  });

  it("returns the threshold as Money in the market currency", () => {
    expect(getFreeShippingThreshold(US, "human")).toEqual({
      amount: 75,
      currencyCode: "USD",
    });
    expect(getFreeShippingThreshold(US, "pet")).toEqual({
      amount: 49,
      currencyCode: "USD",
    });
  });

  it("returns null for a market without free shipping", () => {
    expect(getFreeShippingThreshold(GB, "human")).toBeNull();
    expect(getFreeShippingThreshold(GB, "pet")).toBeNull();
  });

  it("formats the threshold price with the market formatter", () => {
    expect(formatFreeShippingThreshold(US, "human")).toBe("$75");
    expect(formatFreeShippingThreshold(US, "pet")).toBe("$49");
    expect(formatFreeShippingThreshold(GB, "human")).toBeNull();
  });

  it("builds the announcement label 'Free shipping over <price>'", () => {
    expect(formatFreeShippingLabel(US, "human")).toBe("Free shipping over $75");
    expect(formatFreeShippingLabel(US, "pet")).toBe("Free shipping over $49");
  });

  it("returns null label where no free shipping is advertised", () => {
    expect(formatFreeShippingLabel(GB, "human")).toBeNull();
    expect(formatFreeShippingLabel(GB, "pet")).toBeNull();
  });
});
