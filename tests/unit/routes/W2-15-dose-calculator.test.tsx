// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  within,
} from "@testing-library/react";

import DoseCalculatorPage, {
  metadata,
} from "@/app/(pet)/pet/dose-calculator/page";
import {
  DoseCalculator,
  findProductForSpecies,
  formatPrice,
} from "@/app/(pet)/pet/dose-calculator/_components/dose-calculator";
import { mockCatalogProvider } from "@/lib/providers/mock/catalog";
import { cartProvider } from "@/lib/providers/client";
import type { Product } from "@/lib/contracts/catalog";

describe("W2-15: /pet/dose-calculator Route Suite", () => {
  let petProducts: Product[];

  beforeEach(async () => {
    petProducts = await mockCatalogProvider.getProducts({ line: "pet" });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  describe("Metadata & SEO", () => {
    it("exposes title, description and canonical for the route", () => {
      expect(metadata.title).toContain("Pet Dose Calculator");
      expect(metadata.description).toContain("weight");
      expect(metadata.alternates?.canonical).toContain("/pet/dose-calculator");
    });
  });

  describe("Server page", () => {
    it("renders h1, breadcrumb JSON-LD, calculator and the animal-use notice", async () => {
      const jsx = await DoseCalculatorPage();
      render(jsx);

      expect(
        screen.getByRole("heading", { level: 1, name: /find the right dose/i })
      ).toBeTruthy();

      const ld = document.getElementById("dose-calculator-breadcrumb-ld");
      expect(ld?.textContent).toContain("Dose calculator");

      expect(screen.getByRole("main")).toBeTruthy();
      expect(
        screen.getByRole("button", { name: "Calculate dose" })
      ).toBeTruthy();
      expect(
        screen.getByText(/for animal use only/i, { exact: false })
      ).toBeTruthy();
    });
  });

  describe("Inputs (semantic elements)", () => {
    it("renders species, age and activity as labelled radio groups", () => {
      render(<DoseCalculator products={petProducts} />);

      for (const name of ["Dog", "Cat", "Horse"]) {
        expect(screen.getByRole("radio", { name })).toBeTruthy();
      }
      for (const name of ["Young", "Adult", "Senior"]) {
        expect(screen.getByRole("radio", { name })).toBeTruthy();
      }
      for (const name of ["Low", "Moderate", "High"]) {
        expect(screen.getByRole("radio", { name })).toBeTruthy();
      }

      for (const name of ["Species", "Age", "Activity level"]) {
        expect(screen.getByRole("group", { name })).toBeTruthy();
      }
    });

    it("exposes the weight field with an associated label and the lb/kg switch", () => {
      render(<DoseCalculator products={petProducts} />);

      const weight = screen.getByRole("spinbutton", {
        name: "Pet weight in lb",
      });
      expect(weight.tagName).toBe("INPUT");

      const group = screen.getByRole("group", { name: "Weight unit" });
      const lb = within(group).getByRole("button", { name: "lb" });
      const kg = within(group).getByRole("button", { name: "kg" });
      expect(lb.getAttribute("aria-pressed")).toBe("true");
      expect(kg.getAttribute("aria-pressed")).toBe("false");
    });

    it("converts the entered weight when the unit switches", () => {
      render(<DoseCalculator products={petProducts} />);

      const weight = screen.getByRole("spinbutton", {
        name: "Pet weight in lb",
      }) as HTMLInputElement;
      fireEvent.change(weight, { target: { value: "35" } });

      const group = screen.getByRole("group", { name: "Weight unit" });
      fireEvent.click(within(group).getByRole("button", { name: "kg" }));

      const kgWeight = screen.getByRole("spinbutton", {
        name: "Pet weight in kg",
      }) as HTMLInputElement;
      expect(kgWeight.value).toBe("15.9");
    });

    it("offers the species switch for the dose table as buttons", () => {
      render(<DoseCalculator products={petProducts} />);

      const group = screen.getByRole("group", {
        name: "Species for dose table",
      });
      for (const name of ["Dogs", "Cats", "Horses"]) {
        const btn = within(group).getByRole("button", { name });
        expect(btn.tagName).toBe("BUTTON");
        expect(btn.getAttribute("type")).toBe("button");
      }
      expect(
        within(group)
          .getByRole("button", { name: "Dogs" })
          .getAttribute("aria-pressed")
      ).toBe("true");
    });
  });

  describe("Calculation", () => {
    it("calculates the dose and shows the recommended product on submit", () => {
      render(<DoseCalculator products={petProducts} />);

      fireEvent.change(
        screen.getByRole("spinbutton", { name: "Pet weight in lb" }),
        { target: { value: "35" } }
      );
      fireEvent.click(screen.getByRole("button", { name: "Calculate dose" }));

      const result = screen
        .getByRole("heading", { name: "YOUR RESULT" })
        .closest("section") as HTMLElement;
      expect(within(result).getByText("2 chews daily")).toBeTruthy();
      expect(within(result).getByText("21 to 50 lbs")).toBeTruthy();
      expect(
        screen.getByRole("heading", { name: /more good years/i })
      ).toBeTruthy();
      expect(screen.getByRole("button", { name: "Add to cart" })).toBeTruthy();
    });

    it("shows a validation message and no result when the weight is missing", () => {
      render(<DoseCalculator products={petProducts} />);

      fireEvent.click(screen.getByRole("button", { name: "Calculate dose" }));

      expect(screen.getByRole("alert").textContent).toContain(
        "Enter a weight above 0."
      );
      expect(screen.queryByRole("button", { name: "Add to cart" })).toBeNull();
    });

    it("adds the recommended product to the cart through the client provider", async () => {
      const addLines = vi
        .spyOn(cartProvider, "addLines")
        .mockResolvedValue({} as never);

      render(<DoseCalculator products={petProducts} />);
      fireEvent.change(
        screen.getByRole("spinbutton", { name: "Pet weight in lb" }),
        { target: { value: "35" } }
      );
      fireEvent.click(screen.getByRole("button", { name: "Calculate dose" }));
      fireEvent.click(screen.getByRole("button", { name: "Add to cart" }));

      await vi.waitFor(() => expect(addLines).toHaveBeenCalledTimes(1));
      const dogProduct = findProductForSpecies(petProducts, "dog");
      expect(addLines).toHaveBeenCalledWith([
        {
          variantId: dogProduct?.variants[0].id,
          quantity: 1,
          sellingPlanId: null,
        },
      ]);
    });

    it("switches the quick reference table between species", () => {
      render(<DoseCalculator products={petProducts} />);

      const group = screen.getByRole("group", {
        name: "Species for dose table",
      });
      fireEvent.click(within(group).getByRole("button", { name: "Cats" }));

      const table = screen.getByRole("table");
      expect(within(table).getByText("Up to 10 lbs")).toBeTruthy();
      expect(within(table).getByText("1 mL daily")).toBeTruthy();
    });
  });

  describe("Helpers", () => {
    it("picks the first pet product for the selected species", () => {
      expect(findProductForSpecies(petProducts, "cat")?.species).toBe("cat");
      expect(findProductForSpecies(petProducts, "horse")?.species).toBe(
        "horse"
      );
    });

    it("formats prices with the catalog currency, not a hardcoded symbol", () => {
      expect(formatPrice(44, "USD")).toBe("$44.00");
      expect(formatPrice(44, "EUR")).toContain("44");
      expect(formatPrice(44, "EUR")).not.toContain("$");
    });
  });
});
