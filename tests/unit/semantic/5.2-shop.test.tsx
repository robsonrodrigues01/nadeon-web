// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup, within } from "@testing-library/react";

import HumanShopPage from "@/app/(human)/human/shop/page";
import ShopByFormatPage from "@/app/(human)/human/shop/[format]/page";
import DogsPage from "@/app/(pet)/pet/dogs/page";
import CatsPage from "@/app/(pet)/pet/cats/page";
import HorsesPage from "@/app/(pet)/pet/horses/page";
import HumanProductPage from "@/app/(human)/human/products/[slug]/page";
import PetProductPage from "@/app/(pet)/pet/products/[slug]/page";
import HumanKitsPage from "@/app/(human)/human/kits/page";
import PetKitsPage from "@/app/(pet)/pet/kits/page";
import HumanBuildYourBoxPage from "@/app/(human)/human/build-your-box/page";
import PetBuildYourBoxPage from "@/app/(pet)/pet/build-your-box/page";
import SearchPage from "@/app/(shared)/search/page";
import DoseCalculatorPage from "@/app/(pet)/pet/dose-calculator/page";
import { cartProvider, useCartStore } from "@/lib/providers/client";

vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => undefined }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => "/human/shop",
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

describe("5.2 Semantic Elements: Loja", () => {
  beforeEach(() => {
    useCartStore.getState().resetCart();
    vi.spyOn(cartProvider, "addLines").mockResolvedValue({
      id: "cart_test",
      lines: [],
      discountCodes: [],
      subtotalPrice: { amount: 100, currencyCode: "USD" },
      totalDiscount: { amount: 0, currencyCode: "USD" },
      totalPrice: { amount: 100, currencyCode: "USD" },
      totalQuantity: 1,
      checkoutUrl: "https://checkout.nadeon.com/mock",
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  describe("Collection Human `/human/shop`", () => {
    it("renders format filter buttons, objective buttons, sort select, and cards", async () => {
      const page = await HumanShopPage();
      render(page);

      // Filters by format: All 7 / Capsules 3 / Powders 2 / Tinctures 2
      expect(screen.getByRole("button", { name: /all 7/i })).toBeDefined();
      expect(screen.getByRole("button", { name: /capsules 3/i })).toBeDefined();
      expect(screen.getByRole("button", { name: /powders 2/i })).toBeDefined();
      expect(screen.getByRole("button", { name: /tinctures 2/i })).toBeDefined();

      // Objective buttons
      expect(screen.getByRole("button", { name: "Energy" })).toBeDefined();
      expect(screen.getByRole("button", { name: "Healthy aging" })).toBeDefined();
      expect(screen.getByRole("button", { name: "Beauty" })).toBeDefined();
      expect(screen.getByRole("button", { name: "Daily vitamins" })).toBeDefined();

      // Sort select menu
      expect(screen.getByRole("combobox", { name: /sort/i })).toBeDefined();

      // Cards: Add to cart, Compare link
      const addToCartButtons = screen.getAllByRole("button", {
        name: /add .* to cart/i,
      });
      expect(addToCartButtons.length).toBeGreaterThan(0);

      const compareLink = screen.getByRole("link", { name: "Compare" });
      expect(compareLink.getAttribute("href")).toBe("/human/compare");

      // Better together: Add the duo
      const addDuoButtons = screen.getAllByRole("button", {
        name: /add .* to cart for/i,
      });
      expect(addDuoButtons.length).toBeGreaterThan(0);

      // Quiz banner
      const quizLink = screen.getAllByRole("link", {
        name: /take the quiz/i,
      })[0];
      expect(quizLink).toBeDefined();
    });
  });

  describe("Shop by format `/human/shop/[formato]`", () => {
    it("renders format tabs with counts, goal filter, sort combobox, and compare", async () => {
      const page = await ShopByFormatPage({
        params: Promise.resolve({ format: "capsules" }),
        searchParams: Promise.resolve({}),
      });
      render(page);

      const formatNav = screen.getByRole("navigation", { name: "Formats" });
      expect(within(formatNav).getByRole("link", { name: /capsules/i })).toBeDefined();
      expect(within(formatNav).getByRole("link", { name: /powders/i })).toBeDefined();
      expect(within(formatNav).getByRole("link", { name: /tinctures/i })).toBeDefined();

      const goalNav = screen.getByRole("navigation", { name: "Filter by goal" });
      expect(within(goalNav).getAllByRole("link").length).toBeGreaterThan(0);

      expect(screen.getByRole("combobox", { name: "Sort" })).toBeDefined();

      const compareLink = screen.getByRole("link", { name: "Compare" });
      expect(compareLink.getAttribute("href")).toBe("#compare-formats");

      const compareSection = document.getElementById("compare-formats")!;
      expect(compareSection).toBeDefined();
      expect(within(compareSection).getByRole("link", { name: "Shop capsules" })).toBeDefined();
      expect(within(compareSection).getByRole("link", { name: "Shop powders" })).toBeDefined();
      expect(within(compareSection).getByRole("link", { name: "Shop tinctures" })).toBeDefined();

      expect(screen.getByRole("link", { name: "Take the quiz" })).toBeDefined();
    });
  });

  describe("Collection Pet, Dogs `/pet/dogs`", () => {
    it("renders species navigation, need/format filter groups, sort, and bundles", async () => {
      const page = await DogsPage();
      render(page);

      // Species nav
      const speciesNav = screen.getByRole("navigation", {
        name: /species navigation/i,
      });
      expect(within(speciesNav).getByRole("link", { name: /dogs/i })).toBeDefined();
      expect(within(speciesNav).getByRole("link", { name: /cats/i })).toBeDefined();
      expect(within(speciesNav).getByRole("link", { name: /horses/i })).toBeDefined();

      // Need buttons
      const needGroup = screen.getByRole("group", { name: /filter by need/i });
      expect(within(needGroup).getByRole("button", { name: "Longevity" })).toBeDefined();
      expect(within(needGroup).getByRole("button", { name: "Joints" })).toBeDefined();
      expect(within(needGroup).getByRole("button", { name: "Calm" })).toBeDefined();
      expect(within(needGroup).getByRole("button", { name: "Skin & coat" })).toBeDefined();

      // Format buttons with counts
      const formatGroup = screen.getByRole("group", {
        name: /filter by format/i,
      });
      expect(within(formatGroup).getByRole("button", { name: /all 10/i })).toBeDefined();
      expect(within(formatGroup).getByRole("button", { name: /chews 4/i })).toBeDefined();
      expect(within(formatGroup).getByRole("button", { name: /treats 1/i })).toBeDefined();
      expect(within(formatGroup).getByRole("button", { name: /oils 4/i })).toBeDefined();
      expect(within(formatGroup).getByRole("button", { name: /powder 1/i })).toBeDefined();

      // Sort
      expect(screen.getByRole("combobox", { name: /sort/i })).toBeDefined();

      // Dosing guide
      expect(screen.getByRole("link", { name: /full dosing guide/i })).toBeDefined();

      // Bundles: Add bundle
      const addBundleButtons = screen.getAllByRole("button", {
        name: /add .* bundle/i,
      });
      expect(addBundleButtons.length).toBeGreaterThan(0);
    });

    it.todo("Collection Pet Dogs `/pet/dogs`: 'See bundles' secondary link not implemented in route");
  });

  describe("Collection Cats `/pet/cats` e Collection Horses `/pet/horses`", () => {
    it("renders Cats collection semantic links, tabs, and quiz banner", async () => {
      const page = await CatsPage({ searchParams: Promise.resolve({}) });
      render(page);

      expect(screen.getByRole("heading", { level: 1, name: /shop for cats/i })).toBeDefined();
      const addButtons = screen.getAllByRole("button", { name: /add .* to cart/i });
      expect(addButtons.length).toBeGreaterThan(0);
      expect(screen.getByRole("link", { name: /read the guide/i })).toBeDefined();
      expect(screen.getAllByRole("link", { name: /take the quiz/i })[0]).toBeDefined();
    });

    it("renders Horses collection semantic elements and dose calculator link", async () => {
      const page = await HorsesPage();
      render(page);

      expect(screen.getByRole("heading", { level: 1, name: /horses/i })).toBeDefined();
      const addButtons = screen.getAllByRole("button", { name: /add .* to cart/i });
      expect(addButtons.length).toBeGreaterThan(0);
      expect(screen.getByRole("link", { name: /dose calculator/i })).toBeDefined();
    });
  });

  describe("Produto Human `/human/products/[slug]`", () => {
    it("renders gallery, purchase options, add to cart, and COA lot search", async () => {
      const page = await HumanProductPage({
        params: Promise.resolve({ slug: "biohack" }),
      });
      render(page);

      // Gallery tabs
      expect(screen.getByRole("tab", { name: "Capsules" })).toBeDefined();

      // Supplement facts link
      expect(screen.getByRole("link", { name: /supplement facts/i })).toBeDefined();

      // Purchase radio options
      expect(screen.getByRole("radio", { name: /one-time/i })).toBeDefined();
      expect(screen.getByRole("radio", { name: /subscribe/i })).toBeDefined();

      // Main Add to cart button
      expect(screen.getAllByRole("button", { name: /add to cart/i })[0]).toBeDefined();

      // COA Search
      expect(screen.getByPlaceholderText(/e\.g\. nl-0000/i)).toBeDefined();
      expect(screen.getByRole("button", { name: /search/i })).toBeDefined();

      // Supporting sections
      expect(screen.getAllByRole("link", { name: /read the science/i })[0]).toBeDefined();
      expect(screen.getByRole("button", { name: /add the duo/i })).toBeDefined();
    });

    it.todo("Produto Human `/human/products/[slug]`: 'Write a review' button suppressed at launch per Rule 8 compliance (No reviews yet)");
  });

  describe("Produto Pet `/pet/products/[slug]`", () => {
    it("renders weight selector, purchase options, and add to cart", async () => {
      const page = await PetProductPage({
        params: Promise.resolve({ slug: "more-good-years" }),
      });
      render(page);

      // Weight tier radio
      const weightGroup = screen.getByRole("radiogroup", {
        name: /your dog weighs/i,
      });
      expect(within(weightGroup).getByRole("radio", { name: /up to 20 lbs/i })).toBeDefined();
      expect(within(weightGroup).getByRole("radio", { name: /21 to 50 lbs/i })).toBeDefined();
      expect(within(weightGroup).getByRole("radio", { name: /51 to 90 lbs/i })).toBeDefined();
      expect(within(weightGroup).getByRole("radio", { name: /over 90 lbs/i })).toBeDefined();

      // Add to cart
      expect(screen.getAllByRole("button", { name: /add to cart/i })[0]).toBeDefined();

      // Add the kit button
      expect(screen.getAllByRole("button", { name: /add the kit/i }).length).toBeGreaterThan(0);
    });

    it.todo("Produto Pet `/pet/products/[slug]`: 'Write a review' button suppressed at launch per Rule 8 compliance (No reviews yet)");
  });

  describe("Kits Human e Pet `/human/kits`, `/pet/kits`", () => {
    it("renders Human kits filters and Add kit to cart buttons", async () => {
      const page = await HumanKitsPage();
      render(page);

      const filterGroup = screen.getByRole("group", { name: "Filter kits" });
      expect(within(filterGroup).getByRole("button", { name: /all kits 4/i })).toBeDefined();
      expect(within(filterGroup).getByRole("button", { name: /duos 3/i })).toBeDefined();
      expect(within(filterGroup).getByRole("button", { name: /trios 1/i })).toBeDefined();

      const addKitButtons = screen.getAllByRole("button", { name: /add kit to cart/i });
      expect(addKitButtons.length).toBeGreaterThan(0);
      expect(screen.getByRole("link", { name: "Build your box" })).toBeDefined();
    });

    it("renders Pet kits filters and Add kit to cart buttons", async () => {
      const page = await PetKitsPage();
      render(page);

      expect(screen.getByRole("button", { name: /all kits/i })).toBeDefined();
      const addKitButtons = screen.getAllByRole("button", { name: /add .* to cart/i });
      expect(addKitButtons.length).toBeGreaterThan(0);
      expect(screen.getByRole("link", { name: /build your box/i })).toBeDefined();
    });

    it.todo("Kits Human e Pet: 'View details' link not designed or implemented in route");
  });

  describe("Build your box Human `/human/build-your-box`", () => {
    it("renders product selection, frequency options, and subscription start", async () => {
      const page = await HumanBuildYourBoxPage();
      render(page);

      expect(screen.getByRole("button", { name: "Add BioHack" })).toBeDefined();
      expect(screen.getByRole("group", { name: /choose your frequency/i })).toBeDefined();
      expect(screen.getByRole("button", { name: "Start my subscription" })).toBeDefined();
    });
  });

  describe("Build your box Pet `/pet/build-your-box`", () => {
    it("renders pet profile fields, frequency options, and subscription start", async () => {
      const page = await PetBuildYourBoxPage();
      render(page);

      expect(screen.getByRole("textbox", { name: "Pet name" })).toBeDefined();
      expect(screen.getByRole("radio", { name: "Dog" })).toBeDefined();
      expect(screen.getByRole("radio", { name: "Cat" })).toBeDefined();
      expect(screen.getByRole("radio", { name: "Horse" })).toBeDefined();

      expect(screen.getByRole("group", { name: "Choose your frequency" })).toBeDefined();
      expect(screen.getByRole("button", { name: "Start my subscription" })).toBeDefined();
      expect(screen.getByRole("button", { name: "+ Add another pet" })).toBeDefined();
    });
  });

  describe("Search `/search`", () => {
    it("renders search input, filter pills, and query actions", async () => {
      const page = await SearchPage({
        searchParams: Promise.resolve({ q: "nmn" }),
      });
      render(page);

      expect(screen.getByRole("searchbox", { name: /search/i })).toBeDefined();
      expect(screen.getByRole("button", { name: /search/i })).toBeDefined();
    });
  });

  describe("Dose calculator `/pet/dose-calculator`", () => {
    it("renders species, weight input, unit toggle, life stage, activity, and calculate button", async () => {
      const page = await DoseCalculatorPage();
      render(page);

      expect(screen.getByRole("radio", { name: "Dog" })).toBeDefined();
      expect(screen.getByRole("radio", { name: "Cat" })).toBeDefined();
      expect(screen.getByRole("radio", { name: "Horse" })).toBeDefined();

      expect(screen.getByRole("spinbutton", { name: /pet weight/i })).toBeDefined();
      const unitGroup = screen.getByRole("group", { name: "Weight unit" });
      expect(within(unitGroup).getByRole("button", { name: "lb" })).toBeDefined();
      expect(within(unitGroup).getByRole("button", { name: "kg" })).toBeDefined();

      expect(screen.getByRole("button", { name: /calculate dose/i })).toBeDefined();
    });
  });

  describe("Non-implemented / Onda C routes from section 5.2", () => {
    it.todo("Compare formulas `/human/compare`: Onda C route not built in Onda 2");
    it.todo("Gift card `/gift-card`: Onda C route not built in Onda 2");
    it.todo("Ingredients glossary `/ingredients`: Onda C route not built in Onda 2");
    it.todo("Benefit collection `/pet/benefit/[beneficio]`: Onda C route not built in Onda 2");
    it.todo("Concern collection `/pet/concern/[problema]`: Onda C route not built in Onda 2");
    it.todo("Promo collection `/offers/[oferta]`: Onda C route not built in Onda 2");
    it.todo("Breed index `/pet/breeds`: Onda C route not built in Onda 2");
  });
});
