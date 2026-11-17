// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
  waitFor,
} from "@testing-library/react";
import ComparePage from "@/app/(human)/human/compare/page";
import { catalogProvider } from "@/lib/providers";
import { mockCartProvider } from "@/lib/providers/mock/cart";

vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => undefined }),
}));

describe("W5-01 semantic compare formulas route", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("uses contract products and presents the comparison as a table", async () => {
    const products = await catalogProvider.getProducts({ line: "human" });
    render(await ComparePage());

    expect(
      screen.getByRole("heading", { level: 1, name: "Compare formulas" })
    ).toBeTruthy();
    const table = screen.getByRole("table", { name: "Formula comparison" });
    for (const product of products) {
      expect(
        within(table).getByRole("columnheader", {
          name: new RegExp(product.name),
        })
      ).toBeTruthy();
    }
    expect(
      within(table).getByRole("rowheader", { name: "Servings" })
    ).toBeTruthy();
    expect(
      within(table).getByRole("rowheader", { name: "Best for" })
    ).toBeTruthy();
    expect(within(table).getAllByText("To be confirmed")).toHaveLength(
      products.length
    );
    expect(
      within(table).getByRole("columnheader", { name: /BioHack \$65\.00/ })
    ).toBeTruthy();
  });

  it("offers a differences checkbox and the board's quiz link", async () => {
    render(await ComparePage());

    const table = screen.getByRole("table", { name: "Formula comparison" });
    expect(
      screen.getByRole("checkbox", { name: "Show differences only" })
    ).toBeTruthy();
    expect(
      screen
        .getByRole("link", { name: "Take the quiz instead" })
        .getAttribute("href")
    ).toBe("/human/quiz");
    fireEvent.click(
      screen.getByRole("checkbox", { name: "Show differences only" })
    );
    expect(
      within(table).queryByRole("rowheader", { name: "Servings" })
    ).toBeNull();
  });

  it("provides labeled selectors for comparing two formulas", async () => {
    render(await ComparePage());
    fireEvent.click(
      screen.getByRole("radio", { name: "Compare two formulas" })
    );

    expect(
      screen.getByRole("combobox", { name: "First formula" })
    ).toBeTruthy();
    expect(
      screen.getByRole("combobox", { name: "Second formula" })
    ).toBeTruthy();
  });

  it("adds the selected product through the client cart provider", async () => {
    const addLines = vi
      .spyOn(mockCartProvider, "addLines")
      .mockResolvedValue({} as never);
    render(await ComparePage());
    fireEvent.click(
      within(
        screen.getByRole("table", { name: "Formula comparison" })
      ).getByRole("button", { name: "Add BioHack to cart" })
    );

    await waitFor(() =>
      expect(addLines).toHaveBeenCalledWith([
        { variantId: "var_biohack_1", quantity: 1 },
      ])
    );
  });

  it("keeps the table header fixed/sticky during vertical scrolling in its scroll container", async () => {
    render(await ComparePage());

    const table = screen.getByRole("table", { name: "Formula comparison" });
    const scrollContainer = table.parentElement;
    expect(scrollContainer).toBeTruthy();
    expect(scrollContainer?.className).toContain("overflow-auto");
    expect(scrollContainer?.className).toMatch(/max-h-/);

    const thead = table.querySelector("thead");
    expect(thead).toBeTruthy();
    expect(thead?.className).toContain("sticky");
    expect(thead?.className).toContain("top-0");
  });
});
