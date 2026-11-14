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

vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => undefined }),
}));

import DoseCalculatorPage, {
  metadata,
} from "@/app/(pet)/pet/dose-calculator/page";
import {
  DoseCalculator,
  findDosingProductForSpecies,
  findProductForSpecies,
} from "@/app/(pet)/pet/dose-calculator/_components/dose-calculator";
import { mockCatalogProvider } from "@/lib/providers/mock/catalog";
import { cartProvider } from "@/lib/providers/client";
import { getMarket, getDefaultMarket } from "@/lib/market/markets";
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

  const renderCalc = (
    overrides: Partial<React.ComponentProps<typeof DoseCalculator>> = {}
  ) =>
    render(
      <DoseCalculator
        products={petProducts}
        market={getDefaultMarket()}
        productImages={{}}
        {...overrides}
      />
    );

  const enterWeight = (value: string) =>
    fireEvent.change(screen.getByRole("spinbutton", { name: /pet weight/i }), {
      target: { value },
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
      expect(
        document.getElementById("dose-calculator-breadcrumb-ld")?.textContent
      ).toContain("Dose calculator");
      expect(screen.getByRole("main")).toBeTruthy();
      expect(
        screen.getByRole("button", { name: "Calculate dose" })
      ).toBeTruthy();
      expect(screen.getByText(/for animal use only/i)).toBeTruthy();
    });
  });

  describe("Inputs (semantic elements)", () => {
    it("renders species, age and activity as labelled radio groups", () => {
      renderCalc();

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
      renderCalc();

      const weight = screen.getByRole("spinbutton", {
        name: "Pet weight in lb",
      });
      expect(weight.tagName).toBe("INPUT");

      const group = screen.getByRole("group", { name: "Weight unit" });
      expect(
        within(group)
          .getByRole("button", { name: "lb" })
          .getAttribute("aria-pressed")
      ).toBe("true");
      expect(
        within(group)
          .getByRole("button", { name: "kg" })
          .getAttribute("aria-pressed")
      ).toBe("false");
    });

    it("converts the entered weight when the unit switches", () => {
      renderCalc();
      enterWeight("35");

      const group = screen.getByRole("group", { name: "Weight unit" });
      fireEvent.click(within(group).getByRole("button", { name: "kg" }));

      const kgWeight = screen.getByRole("spinbutton", {
        name: "Pet weight in kg",
      }) as HTMLInputElement;
      expect(kgWeight.value).toBe("15.9");
    });

    it("offers the species switch for the dose table as buttons", () => {
      renderCalc();

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

  describe("Dose comes from the product dosingByWeight", () => {
    it("calculates the dog dose from the product range on submit", () => {
      renderCalc();
      enterWeight("35");
      fireEvent.click(screen.getByRole("button", { name: "Calculate dose" }));

      const result = screen
        .getByRole("heading", { name: "YOUR RESULT" })
        .closest("section") as HTMLElement;
      expect(within(result).getByText("2 chews daily")).toBeTruthy();
      expect(within(result).getByText("21 to 50 lbs")).toBeTruthy();
      expect(
        screen.getByRole("heading", { name: /more good years/i })
      ).toBeTruthy();
    });

    it("shows the dog table rows from the product dosingByWeight", () => {
      renderCalc();
      const table = screen.getByRole("table");
      const dogProduct = findDosingProductForSpecies(petProducts, "dog");
      expect(dogProduct?.dosingByWeight.length).toBeGreaterThan(0);
      expect(within(table).getByText("Up to 20 lbs")).toBeTruthy();
      expect(within(table).getByText("1 chew daily")).toBeTruthy();
    });

    it("shows no dose for cats and horses, since their products have no dosingByWeight", () => {
      renderCalc();
      const group = screen.getByRole("group", {
        name: "Species for dose table",
      });
      fireEvent.click(within(group).getByRole("button", { name: "Cats" }));

      expect(screen.queryByRole("table")).toBeNull();
      expect(
        screen.getByText("No dose data in the catalog for cats yet.")
      ).toBeTruthy();
      // no hardcoded cat dose from the old lib constants
      expect(screen.queryByText("1 mL daily")).toBeNull();

      fireEvent.click(within(group).getByRole("button", { name: "Horses" }));
      expect(
        screen.getByText("No dose data in the catalog for horses yet.")
      ).toBeTruthy();
    });

    it("shows no dose in the result for a species whose product has no dosingByWeight", () => {
      renderCalc();
      fireEvent.click(screen.getByRole("radio", { name: "Cat" }));
      enterWeight("8");
      fireEvent.click(screen.getByRole("button", { name: "Calculate dose" }));

      expect(
        screen.getByText("No dose data in the catalog for this product yet.")
      ).toBeTruthy();
      expect(screen.queryByText("0.5 mL daily")).toBeNull();
      expect(screen.getByRole("heading", { name: /high jump/i })).toBeTruthy();
    });

    it("picks the recommended product per species", () => {
      expect(findProductForSpecies(petProducts, "cat")?.species).toBe("cat");
      expect(findProductForSpecies(petProducts, "horse")?.species).toBe(
        "horse"
      );
    });
  });

  describe("Validation and cart", () => {
    it("shows a validation message and no result when the weight is missing", () => {
      renderCalc();
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

      renderCalc();
      enterWeight("35");
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
  });

  describe("Price in market currency", () => {
    it("formats the price with the market currency and locale, not en-US", () => {
      const gb = getMarket("gb");
      expect(gb).toBeDefined();
      renderCalc({ market: gb! });
      enterWeight("35");
      fireEvent.click(screen.getByRole("button", { name: "Calculate dose" }));

      // 44 USD * 0.79 GBP rate = 34.76 GBP
      expect(screen.getByText("£34.76")).toBeTruthy();
      expect(screen.queryByText(/^\$/)).toBeNull();
    });

    it("uses the default US market price when no other market is set", () => {
      renderCalc();
      enterWeight("35");
      fireEvent.click(screen.getByRole("button", { name: "Calculate dose" }));
      expect(screen.getByText("$44.00")).toBeTruthy();
    });
  });

  describe("Product image", () => {
    it("renders the recommended product image with next/image when the file exists", () => {
      renderCalc({
        productImages: {
          "more-good-years": "/images/products/more-good-years-front.webp",
        },
      });
      enterWeight("35");
      fireEvent.click(screen.getByRole("button", { name: "Calculate dose" }));

      const img = screen.getByRole("img", { name: "More Good Years" });
      expect(img.getAttribute("src")).toContain("more-good-years-front");
    });

    it("renders no image when the product image is not available", () => {
      renderCalc({ productImages: {} });
      enterWeight("35");
      fireEvent.click(screen.getByRole("button", { name: "Calculate dose" }));

      expect(screen.queryByRole("img")).toBeNull();
    });
  });
});
