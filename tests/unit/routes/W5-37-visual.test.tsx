// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";
import OfferPage from "@/app/(shared)/offers/[oferta]/page";
import WhereToBuyPage from "@/app/(shared)/where-to-buy/page";
import { DEFAULT_MARKET } from "@/lib/market";
import * as visitorMarket from "@/lib/market/visitor";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("W5-37 visual responsive layout tests", () => {
  it("prevents horizontal overflow on /offers/[oferta] with responsive countdown grid", async () => {
    const page = await OfferPage({
      params: Promise.resolve({ oferta: "model" }),
    });
    const { container } = render(page);

    const countdownGrid = container.querySelector(
      '[aria-label="Countdown timer"]'
    );
    expect(countdownGrid).toBeTruthy();
    expect(countdownGrid?.className).toContain("grid-cols-2");
    expect(countdownGrid?.className).toContain("sm:grid-cols-4");

    const cells = countdownGrid?.querySelectorAll(".rounded-field");
    expect(cells?.length).toBe(4);
    cells?.forEach((cell) => {
      expect(cell.className).toContain("min-w-0");
    });
  });

  it("prevents horizontal overflow on /where-to-buy with min-w-0 cards and flex-wrap actions", async () => {
    vi.spyOn(visitorMarket, "getVisitorMarket").mockResolvedValue(
      DEFAULT_MARKET
    );
    const page = await WhereToBuyPage({ searchParams: Promise.resolve({}) });
    const { container } = render(page);

    const onlineSection = container.querySelector(
      '[aria-labelledby="shop-online-heading"]'
    );
    expect(onlineSection).toBeTruthy();

    const grid = onlineSection?.querySelector(".grid");
    expect(grid).toBeTruthy();

    const cards = grid?.children;
    expect(cards?.length).toBe(2);
    expect(cards?.[0].className).toContain("min-w-0");
    expect(cards?.[1].className).toContain("min-w-0");

    const actionsContainer = cards?.[0].querySelector(".flex-wrap");
    expect(actionsContainer).toBeTruthy();
    expect(actionsContainer?.textContent).toContain("Shop Human");
    expect(actionsContainer?.textContent).toContain("Shop Pet");
  });
});
