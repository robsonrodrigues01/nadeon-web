// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import WhereToBuyPage from "@/app/(shared)/where-to-buy/page";
import { DEFAULT_MARKET } from "@/lib/market";
import * as visitorMarket from "@/lib/market/visitor";
import { storeLocatorProvider } from "@/lib/providers";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("W5-16 /where-to-buy", () => {
  it("renders the semantic search, existing shop links, and honest empty state", async () => {
    vi.spyOn(visitorMarket, "getVisitorMarket").mockResolvedValue(
      DEFAULT_MARKET
    );
    const search = vi.spyOn(storeLocatorProvider, "search");
    render(await WhereToBuyPage({ searchParams: Promise.resolve({}) }));
    const main = within(screen.getByRole("main"));

    expect(
      main.getByRole("heading", { level: 1, name: "Where to buy" })
    ).toBeTruthy();
    expect(main.getByLabelText("ZIP code")).toBeTruthy();
    expect(main.getByLabelText("Within miles")).toBeTruthy();
    expect(main.getByRole("link", { name: "Shop Human" })).toHaveProperty(
      "href",
      expect.stringContaining("/human/shop")
    );
    expect(main.getByRole("link", { name: "Shop Pet" })).toHaveProperty(
      "href",
      expect.stringContaining("/pet/dogs")
    );
    for (const label of ["All stores", "Human line", "Pet line"]) {
      expect(main.getByRole("button", { name: label })).toBeTruthy();
    }
    expect(main.getByText("Marketplaces")).toBeTruthy();
    expect(main.getAllByText("Coming soon")).toHaveLength(2);
    expect(main.getByText("Store locations: To be confirmed.")).toBeTruthy();
    expect(
      main.getByRole("button", { name: "Apply for wholesale" })
    ).toHaveProperty("disabled", true);
    expect(
      main.getByRole("button", { name: "Retailer sign in" })
    ).toHaveProperty("disabled", true);
    expect(main.getByText("Wholesale actions: To be confirmed.")).toBeTruthy();
    expect(main.queryByRole("link", { name: /wholesale/i })).toBeNull();
    expect(search).not.toHaveBeenCalled();
  });

  it("searches the provider with selected ZIP, radius, and line and shows provider directions", async () => {
    vi.spyOn(visitorMarket, "getVisitorMarket").mockResolvedValue(
      DEFAULT_MARKET
    );
    vi.spyOn(storeLocatorProvider, "search").mockResolvedValue([
      {
        id: "store_TEST_01",
        name: "TEST Pet Supply",
        address: "123 TEST Main St, TEST City, TEST 00000",
        zip: "00000",
        distanceMiles: 2.4,
        lines: ["pet"],
      },
    ]);

    render(
      await WhereToBuyPage({
        searchParams: Promise.resolve({
          zip: "00000",
          radius: "10",
          line: "pet",
        }),
      })
    );

    expect(storeLocatorProvider.search).toHaveBeenCalledWith({
      zip: "00000",
      radiusMiles: 10,
      line: "pet",
    });
    expect(screen.getByText("TEST Pet Supply")).toBeTruthy();
    expect(
      screen.getByText("123 TEST Main St, TEST City, TEST 00000")
    ).toBeTruthy();
    expect(screen.getByRole("link", { name: "Directions →" })).toHaveProperty(
      "href",
      expect.stringContaining("google.com/maps/dir")
    );
  });

  it("keeps the selected Pet line when the ZIP is changed and searched again", async () => {
    vi.spyOn(visitorMarket, "getVisitorMarket").mockResolvedValue(
      DEFAULT_MARKET
    );
    const search = vi
      .spyOn(storeLocatorProvider, "search")
      .mockResolvedValue([]);
    render(
      await WhereToBuyPage({
        searchParams: Promise.resolve({
          zip: "00000",
          radius: "10",
        }),
      })
    );

    const filterButton = screen.getByRole("button", { name: "Pet line" });
    const filterForm = filterButton.closest("form");
    if (!filterForm) throw new Error("Pet line filter form is missing.");
    const filterParams = new FormData(filterForm);
    filterParams.set(
      (filterButton as HTMLButtonElement).name,
      (filterButton as HTMLButtonElement).value
    );
    expect(filterParams.get("line")).toBe("pet");
    cleanup();

    render(
      await WhereToBuyPage({
        searchParams: Promise.resolve({
          zip: String(filterParams.get("zip")),
          radius: String(filterParams.get("radius")),
          line: String(filterParams.get("line")),
        }),
      })
    );
    expect(
      screen
        .getByRole("button", { name: "Pet line" })
        .getAttribute("aria-pressed")
    ).toBe("true");
    expect(search).toHaveBeenLastCalledWith({
      zip: "00000",
      radiusMiles: 10,
      line: "pet",
    });

    const zipInput = screen.getByLabelText("ZIP code") as HTMLInputElement;
    fireEvent.change(zipInput, { target: { value: "00001" } });
    const form = zipInput.closest("form");
    if (!form) throw new Error("ZIP search form is missing.");
    const submitted = new FormData(form);

    expect(submitted.get("line")).toBe("pet");

    await WhereToBuyPage({
      searchParams: Promise.resolve({
        zip: String(submitted.get("zip")),
        radius: String(submitted.get("radius")),
        line: String(submitted.get("line")),
      }),
    });
    expect(search).toHaveBeenLastCalledWith({
      zip: "00001",
      radiusMiles: 10,
      line: "pet",
    });
  });
});
