// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import SearchPage, { generateMetadata } from "@/app/(shared)/search/page";
import { SearchField } from "@/app/(shared)/search/_components/search-field";
import { cartProvider } from "@/lib/providers/client";

const cookieJar = vi.hoisted(() => ({
  value: undefined as string | undefined,
}));

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) =>
      cookieJar.value ? { name, value: cookieJar.value } : undefined,
  }),
}));

async function renderSearch(q = "", format = "") {
  const jsx = await SearchPage({
    searchParams: Promise.resolve({ q, format }),
  });
  return render(jsx);
}

describe("W2-16: /search route", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    cookieJar.value = undefined;
    cleanup();
  });

  it("formats prices in USD even when the market cookie is non-US", async () => {
    await renderSearch("nmn");
    expect(screen.getAllByText(/^\$\d/).length).toBeGreaterThan(0);
    cleanup();

    cookieJar.value = "gb";
    await renderSearch("nmn");
    expect(screen.getAllByText(/^\$\d/).length).toBeGreaterThan(0);
    expect(screen.queryAllByText(/£/)).toHaveLength(0);
  });

  it("generates noindex metadata for the search page", async () => {
    const metadata = await generateMetadata();
    expect(metadata.title).toContain("Search Nadeon Human");
    expect(metadata.robots).toEqual(expect.objectContaining({ index: false }));
  });

  it("renders the search heading, field and suggestions with no query", async () => {
    await renderSearch();
    expect(
      screen.getByRole("heading", { level: 1, name: /search nadeon human/i })
    ).toBeTruthy();
    expect(screen.getByRole("searchbox")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Search" })).toBeTruthy();
    expect(
      screen.getByRole("navigation", { name: /try these searches/i })
    ).toBeTruthy();
    expect(
      screen.getByRole("heading", { level: 2, name: /popular searches/i })
    ).toBeTruthy();
    expect(
      screen.getByRole("heading", { level: 2, name: /not sure what you need/i })
    ).toBeTruthy();
    // No results section without a query
    expect(screen.queryByRole("heading", { name: /results for/i })).toBeNull();
  });

  it("lists mocked product results for a query, with price from the provider", async () => {
    await renderSearch("nmn");
    expect(
      screen.getByRole("heading", { level: 2, name: /results for “nmn”/i })
    ).toBeTruthy();
    expect(
      screen.getByRole("heading", { level: 3, name: "BioHack" })
    ).toBeTruthy();
    expect(
      screen.getAllByRole("button", { name: "Add to cart" }).length
    ).toBeGreaterThan(0);
    // Subscription label comes from the selling plan in the catalog
    expect(
      screen.getAllByText(/subscribe & save \d+%/i).length
    ).toBeGreaterThan(0);
  });

  it("keeps Pet products out of the Human search results", async () => {
    // "High Jump" is a Pet product in the mock catalog
    await renderSearch("High Jump");
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /0 results for “High Jump”/i,
      })
    ).toBeTruthy();
    expect(
      screen.queryByRole("heading", { level: 3, name: "High Jump" })
    ).toBeNull();
    expect(screen.queryByText("For animal use only.")).toBeNull();
  });

  it("shows only products: no Articles tab or article results", async () => {
    await renderSearch("nmn");
    expect(screen.queryByText(/articles/i)).toBeNull();
    expect(screen.getByRole("link", { name: /^All \(/ })).toBeTruthy();
  });

  it("filters results by format with semantic links and aria-current", async () => {
    await renderSearch("nmn", "capsules");
    const current = screen.getByRole("link", { current: "page" });
    expect(current.textContent).toMatch(/capsules/i);
  });

  it("renders the suggestion chips as links to search", async () => {
    await renderSearch();
    const link = screen.getByRole("link", { name: "nmn vs nad+" });
    expect(link.getAttribute("href")).toBe("/search?q=nmn%20vs%20nad%2B");
  });

  it("points the quiz action to the human quiz", async () => {
    await renderSearch();
    const links = screen.getAllByRole("link", { name: "Take the quiz" });
    expect(links.every((l) => l.getAttribute("href") === "/human/quiz")).toBe(
      true
    );
  });

  it("adds a product to the cart through the client provider", async () => {
    const addLines = vi.spyOn(cartProvider, "addLines").mockResolvedValue({
      id: "cart_search",
      lines: [],
      discountCodes: [],
      subtotalPrice: { amount: 0, currencyCode: "USD" },
      totalDiscount: { amount: 0, currencyCode: "USD" },
      totalPrice: { amount: 0, currencyCode: "USD" },
      totalQuantity: 1,
      checkoutUrl: "https://checkout.nadeon.com/mock",
    });
    await renderSearch("nmn");
    fireEvent.click(screen.getAllByRole("button", { name: "Add to cart" })[0]);
    expect(addLines).toHaveBeenCalledTimes(1);
  });

  describe("SearchField controls", () => {
    it("exposes a labelled search input and a submit button with accessible name", () => {
      render(<SearchField initialQuery="" />);
      expect(screen.getByRole("searchbox")).toBeTruthy();
      expect(screen.getByRole("searchbox").className).toContain("min-w-0");
      expect(
        screen.getByRole("button", { name: "Search" }).getAttribute("type")
      ).toBe("submit");
    });

    it("shows Clear only when the field has a value, and clears it", () => {
      render(<SearchField initialQuery="nmn" />);
      const input = screen.getByRole("searchbox") as HTMLInputElement;
      const clear = screen.getByRole("button", { name: /clear/i });
      expect(clear.getAttribute("type")).toBe("button");
      fireEvent.click(clear);
      expect(input.value).toBe("");
      expect(screen.queryByRole("button", { name: /clear/i })).toBeNull();
    });
  });
});
