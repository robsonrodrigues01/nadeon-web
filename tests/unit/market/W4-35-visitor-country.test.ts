import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { getMarketForCountry } from "@/lib/market/markets";
import { MARKET_COOKIE_NAME } from "@/lib/market/cookies";
import { getInternationalShippingNotice } from "@/lib/market/shipping";
import { proxy } from "@/proxy";

describe("W4-35 getMarketForCountry", () => {
  it("maps supported countries to their own market", () => {
    expect(getMarketForCountry("US")?.id).toBe("us");
    expect(getMarketForCountry("ca")?.id).toBe("ca");
    expect(getMarketForCountry("GB")?.id).toBe("gb");
  });

  it("maps EU member countries to the EU market", () => {
    expect(getMarketForCountry("DE")?.id).toBe("eu");
    expect(getMarketForCountry("PT")?.id).toBe("eu");
  });

  it("maps any other country to the international market, which gets the notice", () => {
    const market = getMarketForCountry("BR");
    expect(market?.id).toBe("intl");
    expect(market?.currency.code).toBe("USD");
    expect(market && getInternationalShippingNotice(market)).not.toBeNull();
  });

  it("returns undefined when the country is unknown", () => {
    expect(getMarketForCountry(undefined)).toBeUndefined();
    expect(getMarketForCountry("")).toBeUndefined();
    expect(getMarketForCountry("XX1")).toBeUndefined();
  });
});

function request(country?: string, cookie?: string) {
  const headers = new Headers();
  if (country) headers.set("x-vercel-ip-country", country);
  if (cookie) headers.set("cookie", cookie);
  return new NextRequest("https://www.nadeonlabs.com/human", { headers });
}

describe("W4-35 proxy sets the market from the visitor country", () => {
  it("sets the market cookie from the Vercel country header", () => {
    const response = proxy(request("BR"));
    expect(response.cookies.get(MARKET_COOKIE_NAME)?.value).toBe("intl");
  });

  it("keeps an existing market cookie", () => {
    const response = proxy(request("BR", `${MARKET_COOKIE_NAME}=gb`));
    expect(response.cookies.get(MARKET_COOKIE_NAME)).toBeUndefined();
  });

  it("does nothing without a country header", () => {
    const response = proxy(request());
    expect(response.cookies.get(MARKET_COOKIE_NAME)).toBeUndefined();
  });

  it("lets the current request see the market on the server", () => {
    const response = proxy(request("CA"));
    expect(response.headers.get("x-middleware-request-cookie")).toContain(
      `${MARKET_COOKIE_NAME}=ca`
    );
  });
});
