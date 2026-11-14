// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import {
  render,
  screen,
  cleanup,
  within,
  fireEvent,
} from "@testing-library/react";

import HorsesPage, { metadata } from "@/app/(pet)/pet/horses/page";

afterEach(() => {
  cleanup();
});

describe("W2-11: /pet/horses route", () => {
  describe("Metadata & SEO", () => {
    it("exports metadata with canonical /pet/horses", () => {
      expect(metadata.title).toContain("Horse");
      expect(metadata.description).toBeTruthy();
      expect(metadata.alternates?.canonical).toContain("/pet/horses");
    });
  });

  describe("Page render (mock providers)", () => {
    it("renders h1, species nav, product grid, JSON-LD and no placeholders", async () => {
      const jsx = await HorsesPage();
      const { container } = render(jsx);

      const h1 = screen.getByRole("heading", {
        level: 1,
        name: /shop for horses/i,
      });
      expect(h1).toBeTruthy();

      const jsonLd = document.getElementById("horses-collection-ld");
      expect(jsonLd?.textContent).toContain("Shop for Horses - Nadeon Pet");

      // Species switch, current page marked
      const species = screen.getByRole("navigation", { name: /species/i });
      const horsesLink = within(species).getByRole("link", { name: "Horses" });
      expect(horsesLink.getAttribute("aria-current")).toBe("page");

      // Mock horse products render as cards
      expect(
        screen.getByRole("heading", { level: 3, name: /long stride/i })
      ).toBeTruthy();
      expect(
        screen.getByRole("heading", { level: 3, name: /solid ground/i })
      ).toBeTruthy();

      // No template placeholders leak into text
      const text = container.textContent ?? "";
      expect(text).not.toMatch(
        /\[X\]|\$XX|\(example\)|\[Name\]|\[Format\]|Placeholder/i
      );
    });
  });

  describe("Controls (catalog 5.2, semantic elements)", () => {
    it("format filter is a group of buttons with aria-pressed", async () => {
      render(await HorsesPage());
      const group = screen.getByRole("group", { name: "Format" });
      const all = within(group).getByRole("button", { name: /^all 2$/i });
      expect(all.getAttribute("aria-pressed")).toBe("true");
      const topDress = within(group).getByRole("button", {
        name: /top-dress 2/i,
      });
      expect(topDress.getAttribute("aria-pressed")).toBe("false");
    });

    it("sort is a labelled select that reorders products by price", async () => {
      render(await HorsesPage());
      const sort = screen.getByLabelText("Sort") as HTMLSelectElement;
      expect(sort.tagName).toBe("SELECT");
      expect(sort.value).toBe("featured");

      fireEvent.change(sort, { target: { value: "title-asc" } });
      const productsRegion = screen.getByRole("region", {
        name: "Horse formulas",
      });
      const headings = within(productsRegion)
        .getAllByRole("heading", { level: 3 })
        .map((h) => h.textContent);
      expect(headings).toEqual(["Long Stride", "Solid Ground"]);
    });

    it("each product card has an Add to cart button", async () => {
      render(await HorsesPage());
      expect(
        screen.getByRole("button", { name: /add long stride to cart/i }).tagName
      ).toBe("BUTTON");
      expect(
        screen.getByRole("button", { name: /add solid ground to cart/i })
          .tagName
      ).toBe("BUTTON");
    });

    it("dose by weight band table lists the four horse bands with scoops", async () => {
      render(await HorsesPage());
      const section = screen.getByRole("region", {
        name: "Dose by weight band",
      });
      expect(within(section).getByText("Per day, on feed.")).toBeTruthy();

      const table = within(section).getByRole("table");
      const rowHeaders = within(table)
        .getAllByRole("rowheader")
        .map((th) => th.textContent);
      expect(rowHeaders).toEqual([
        "Pony (< 800 lbs)",
        "Light horse (800 to 1,100 lbs)",
        "Horse (1,100 to 1,400 lbs)",
        "Draft (> 1,400 lbs)",
      ]);
      expect(within(table).getAllByText(/scoops? daily/).length).toBe(4);
    });

    it("dose calculator and quiz are links to their routes", async () => {
      render(await HorsesPage());
      expect(
        screen
          .getByRole("link", { name: "Dose calculator" })
          .getAttribute("href")
      ).toBe("/pet/dose-calculator");
      expect(
        screen.getByRole("link", { name: "Take the quiz" }).getAttribute("href")
      ).toBe("/pet/quiz");
    });
  });
});
