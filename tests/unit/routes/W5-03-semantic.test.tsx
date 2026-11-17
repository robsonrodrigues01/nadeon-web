// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import ConcernPage from "@/app/(pet)/pet/concern/[problema]/page";
import { catalogProvider } from "@/lib/providers";
import { mockCartProvider } from "@/lib/providers/mock/cart";

const { mockCookies, mockPush } = vi.hoisted(() => ({
  mockCookies: vi.fn(),
  mockPush: vi.fn(),
}));

vi.mock("next/headers", () => ({ cookies: mockCookies }));
vi.mock("next/navigation", () => ({
  usePathname: () => "/pet/concern/mobility",
  useRouter: () => ({ push: mockPush }),
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  mockCookies.mockResolvedValue({ get: () => undefined });
  mockPush.mockClear();
});

describe("W5-03 semantic concern collection route", () => {
  it("keeps unknown concern content unconfirmed and exposes accessible collection controls", async () => {
    vi.spyOn(catalogProvider, "getCollection").mockResolvedValue(null);
    mockCookies.mockResolvedValue({ get: () => undefined });

    render(
      await ConcernPage({
        params: Promise.resolve({ problema: "arthritis" }),
        searchParams: Promise.resolve({}),
      })
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Dealing with To be confirmed? You are not alone.",
      })
    ).toBeTruthy();
    expect(screen.queryByText(/arthritis/i)).toBeNull();
    expect(
      screen.getByRole("link", { name: "See the routine" }).getAttribute("href")
    ).toBe("#routine");
    expect(
      screen.getByRole("link", { name: "Talk to us" }).getAttribute("href")
    ).toBe("/help#contact");
    expect(
      screen.getByRole("button", { name: "Add full routine to cart" })
    ).toHaveProperty("disabled", true);
    expect(screen.getByRole("group", { name: "Filters" })).toBeTruthy();
    expect(
      screen.getByRole("combobox", { name: "To be confirmed" })
    ).toBeTruthy();
    expect(screen.getByRole("combobox", { name: "Sort" })).toBeTruthy();
    expect(
      screen.getByRole("link", { name: /All concerns/ }).getAttribute("href")
    ).toBe("#related-concerns");
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "To be confirmed questions",
      })
    ).toBeTruthy();
  });

  it("shows only provider-related dog products and formats prices for the visitor market", async () => {
    const products = await catalogProvider.getProducts({
      line: "pet",
      species: "dog",
    });
    const product = products[0];
    expect(product).toBeDefined();
    vi.spyOn(catalogProvider, "getCollection").mockResolvedValue({
      handle: "mobility",
      title: "Mobility collection",
      products: [product],
    });
    mockCookies.mockResolvedValue({ get: () => ({ value: "gb" }) });

    render(
      await ConcernPage({
        params: Promise.resolve({ problema: "mobility" }),
        searchParams: Promise.resolve({ format: product.format }),
      })
    );

    expect(screen.getByRole("heading", { name: product.name })).toBeTruthy();
    expect(screen.queryByText(product.technicalName)).toBeNull();
    const addLines = vi
      .spyOn(mockCartProvider, "addLines")
      .mockResolvedValue({} as never);
    expect(
      screen.getByRole("button", {
        name: new RegExp(`Add ${product.name} to cart`),
      })
    ).toBeTruthy();
    fireEvent.click(
      screen.getByRole("button", {
        name: new RegExp(`Add ${product.name} to cart`),
      })
    );
    await waitFor(() =>
      expect(addLines).toHaveBeenCalledWith([
        { variantId: product.variants[0].id, quantity: 1 },
      ])
    );
    expect(screen.getByText(/£/)).toBeTruthy();
    fireEvent.change(
      screen.getByRole("combobox", { name: "To be confirmed" }),
      {
        target: { value: "" },
      }
    );
    expect(mockPush).toHaveBeenCalledWith("/pet/concern/mobility");
    expect(catalogProvider.getCollection).toHaveBeenCalledWith(
      "mobility",
      { line: "pet", species: "dog" },
      "featured"
    );
    expect(catalogProvider.getCollection).toHaveBeenCalledWith(
      "mobility",
      { line: "pet", species: "dog", format: product.format },
      "featured"
    );
  });

  it("does not treat a generic dog collection as a concern recommendation", async () => {
    const [product] = await catalogProvider.getProducts({
      line: "pet",
      species: "dog",
    });
    const getCollection = vi
      .spyOn(catalogProvider, "getCollection")
      .mockResolvedValue({
        handle: "dogs",
        title: "Canine Formulas",
        products: [product],
      });

    render(
      await ConcernPage({
        params: Promise.resolve({ problema: "dogs" }),
        searchParams: Promise.resolve({}),
      })
    );

    expect(screen.queryByRole("heading", { name: product.name })).toBeNull();
    expect(getCollection).not.toHaveBeenCalled();
  });
});
