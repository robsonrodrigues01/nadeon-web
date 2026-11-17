// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import IngredientsPage from "@/app/(shared)/ingredients/page";
import { catalogProvider } from "@/lib/providers";
import { mockContentProvider } from "@/lib/providers/mock/content";
import type { Ingredient } from "@/lib/contracts/content";

vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => ({ value: "gb" }) }),
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const ingredient = (
  slug: string,
  name: string,
  category: string
): Ingredient => ({
  slug,
  name,
  category,
  description: "To be confirmed",
  dose: "To be confirmed",
  form: "To be confirmed",
});

describe("W5-05 semantic ingredients glossary route", () => {
  it("renders search, category filters, load more, and the existing lab-results link", async () => {
    render(await IngredientsPage());

    expect(
      screen.getByRole("heading", { level: 1, name: "What goes in" })
    ).toBeTruthy();
    expect(
      screen.getByRole("searchbox", { name: "Search an ingredient" })
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: "Search" })).toBeTruthy();
    expect(screen.getByRole("group", { name: "CATEGORY" })).toBeTruthy();
    expect(screen.getByRole("radio", { name: "All" })).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Load more ingredients" })
    ).toHaveProperty("disabled", true);
    expect(
      screen.getByRole("link", { name: "See lab results" }).getAttribute("href")
    ).toBe("/lab-results");
    expect(screen.getAllByText("To be confirmed").length).toBeGreaterThan(0);
  });

  it("searches, filters by category, expands an ingredient, and links only to its contract product", async () => {
    const products = await catalogProvider.getProducts({ line: "human" });
    const product = products.find((item) =>
      item.actives.some((active) => active.name.includes("NMN"))
    );
    if (!product)
      throw new Error("The content fixture needs a matching catalog product.");
    const ingredientName = product!.actives.find((active) =>
      active.name.includes("NMN")
    )!.name;
    vi.spyOn(mockContentProvider, "getIngredientGlossary").mockResolvedValue({
      title: "What goes in",
      eyebrow: "INGREDIENT GLOSSARY",
      description: "To be confirmed",
      searchLabel: "Search an ingredient",
      categories: ["TEST Category", "TEST Other"],
    });
    vi.spyOn(mockContentProvider, "listIngredients").mockResolvedValue([
      ingredient("nmn", ingredientName, "TEST Category"),
      ingredient("test-item", "TEST Ingredient", "TEST Other"),
    ]);

    render(await IngredientsPage());
    fireEvent.click(screen.getByRole("radio", { name: "TEST Other" }));
    expect(screen.queryByRole("heading", { name: ingredientName })).toBeNull();
    fireEvent.click(screen.getByRole("radio", { name: "All" }));
    fireEvent.change(
      screen.getByRole("searchbox", { name: "Search an ingredient" }),
      {
        target: { value: "NMN" },
      }
    );
    fireEvent.click(screen.getByRole("button", { name: "Search" }));

    const card = screen
      .getByRole("heading", { name: ingredientName })
      .closest("article");
    const details = card?.querySelector("details") ?? null;
    expect(details).not.toBeNull();
    fireEvent.click(within(details!).getByText("Details ↓"));
    expect(within(details!).getByText("Why we use it.")).toBeTruthy();
    expect(
      within(details!).getAllByText("To be confirmed").length
    ).toBeGreaterThan(0);
    expect(within(details!).getAllByText(/£/).length).toBeGreaterThan(0);
    expect(
      within(details!)
        .getAllByRole("link", { name: /Shop/ })
        .some(
          (link) =>
            link.getAttribute("href") === `/human/products/${product.slug}`
        )
    ).toBe(true);
  });

  it("loads the next group of ingredients when more contract entries are available", async () => {
    vi.spyOn(mockContentProvider, "listIngredients").mockResolvedValue(
      Array.from({ length: 7 }, (_, index) =>
        ingredient(
          `test-${index}`,
          `TEST Ingredient ${index + 1}`,
          "TEST Category"
        )
      )
    );

    render(await IngredientsPage());
    expect(
      screen.queryByRole("heading", { name: "TEST Ingredient 7" })
    ).toBeNull();
    fireEvent.click(
      screen.getByRole("button", { name: "Load more ingredients" })
    );
    expect(
      screen.getByRole("heading", { name: "TEST Ingredient 7" })
    ).toBeTruthy();
  });
});
