// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";

import DogsPage, { metadata } from "@/app/(pet)/pet/dogs/page";
import { Hero } from "@/app/(pet)/pet/dogs/_components/hero";
import {
  DogProductsSection,
  getProductNeed,
  matchesFormat,
} from "@/app/(pet)/pet/dogs/_components/dog-products-section";
import {
  DoseByWeightSection,
  DOG_WEIGHT_TIERS,
} from "@/app/(pet)/pet/dogs/_components/dose-by-weight-section";
import {
  BundlesSection,
  DOG_BUNDLES,
} from "@/app/(pet)/pet/dogs/_components/bundles-section";
import { CatsAndHorsesSection } from "@/app/(pet)/pet/dogs/_components/cats-and-horses-section";
import { mockCatalogProvider } from "@/lib/providers/mock/catalog";
import type { Cart, CartProvider } from "@/lib/contracts/cart";
import type { Product } from "@/lib/contracts/catalog";
import { DEFAULT_MARKET } from "@/lib/market/markets";
import { getAllKits } from "@/data/products";
import { formatMoneyWithMarket } from "@/lib/market/formatter";

// Página de servidor lê o cookie de mercado; o teste não tem requisição.
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => undefined }),
}));

describe("W2-09: /pet/dogs Route Suite", () => {
  let dogProducts: Product[];
  let catProducts: Product[];
  let horseProducts: Product[];
  let mockCart: Cart;
  let mockCartProviderInstance: CartProvider;

  beforeEach(async () => {
    dogProducts = await mockCatalogProvider.getProducts({ species: "dog" });
    catProducts = await mockCatalogProvider.getProducts({ species: "cat" });
    horseProducts = await mockCatalogProvider.getProducts({ species: "horse" });

    mockCart = {
      id: "cart_test_pet",
      lines: [],
      discountCodes: [],
      subtotalPrice: { amount: 75, currencyCode: "USD" },
      totalDiscount: { amount: 0, currencyCode: "USD" },
      totalPrice: { amount: 75, currencyCode: "USD" },
      totalQuantity: 1,
      checkoutUrl: "https://checkout.nadeon.com/mock/cart_test_pet",
    };

    mockCartProviderInstance = {
      get: vi.fn().mockResolvedValue(mockCart),
      create: vi.fn().mockResolvedValue(mockCart),
      addLines: vi.fn().mockResolvedValue(mockCart),
      addKit: vi.fn().mockResolvedValue(mockCart),
      updateLines: vi.fn().mockResolvedValue(mockCart),
      removeLines: vi.fn().mockResolvedValue(mockCart),
      applyDiscount: vi.fn().mockResolvedValue(mockCart),
      setLineSellingPlan: vi.fn().mockResolvedValue(mockCart),
      checkoutUrl: vi.fn().mockResolvedValue(mockCart.checkoutUrl),
    };
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe("Metadata & SEO", () => {
    it("has valid metadata matching SEO contract", () => {
      expect(metadata).toBeDefined();
      expect(metadata.title).toContain("Shop Dog");
      expect(metadata.description).toContain("NMN soft chews");
      expect(metadata.alternates?.canonical).toContain("/pet/dogs");
    });
  });

  describe("Server Page Component (DogsPage)", () => {
    it("uses level-two headings for top-level dog product cards", async () => {
      render(await DogsPage());

      expect(
        screen.getByRole("heading", { level: 2, name: "More Good Years" })
      ).toBeTruthy();
    });

    it("renders server component with all 6 sections and JSON-LD schema", async () => {
      const jsx = await DogsPage();
      render(jsx);

      // JSON-LD script presence
      const jsonLdScript = document.getElementById("dogs-collection-ld");
      expect(jsonLdScript).toBeTruthy();
      expect(jsonLdScript?.textContent).toContain("Shop for Dogs - Nadeon Pet");

      // Main container
      const main = screen.getByRole("main");
      expect(main).toBeTruthy();

      // Hero heading
      expect(
        screen.getByRole("heading", { level: 1, name: /shop for dogs/i })
      ).toBeTruthy();

      // Product section toolbar
      expect(screen.getByText(/10 products for dogs/i)).toBeTruthy();

      // Dose by weight section
      expect(
        screen.getByRole("heading", { level: 2, name: /dose by weight/i })
      ).toBeTruthy();

      // Bundles section
      expect(
        screen.getByRole("heading", { level: 2, name: /chew \+ oil, by need/i })
      ).toBeTruthy();

      // Cats and Horses section
      expect(
        screen.getByRole("heading", { level: 2, name: /not just for dogs/i })
      ).toBeTruthy();
    });
  });

  describe("Hero Component", () => {
    it("renders semantic breadcrumbs with active Dogs item", () => {
      render(<Hero />);

      const breadcrumbNav = screen.getByRole("navigation", {
        name: /breadcrumb/i,
      });
      expect(breadcrumbNav).toBeTruthy();

      const petLink = screen.getByRole("link", { name: "Pet" });
      expect(petLink.getAttribute("href")).toBe("/pet");

      const shopLink = screen.getByRole("link", { name: "Shop" });
      expect(shopLink.getAttribute("href")).toBe("/pet/dogs");

      const activeDogs = screen.getByText("Dogs", {
        selector: "li[aria-current='page']",
      });
      expect(activeDogs).toBeTruthy();
    });

    it("renders species navigation with Dogs, Cats and Horses links", () => {
      render(<Hero />);

      const speciesNav = screen.getByRole("navigation", {
        name: /species navigation/i,
      });
      expect(speciesNav).toBeTruthy();

      const dogsLink = screen.getByRole("link", { name: /dogs/i });
      expect(dogsLink.getAttribute("href")).toBe("/pet/dogs");
      expect(dogsLink.getAttribute("aria-current")).toBe("page");

      const catsLink = screen.getByRole("link", { name: /cats/i });
      expect(catsLink.getAttribute("href")).toBe("/pet/cats");

      const horsesLink = screen.getByRole("link", { name: /horses/i });
      expect(horsesLink.getAttribute("href")).toBe("/pet/horses");
    });
  });

  describe("DogProductsSection: Filters, Sorting & Semantic Elements", () => {
    it("renders NEED and FORMAT filter button groups with accurate counts", () => {
      render(<DogProductsSection initialProducts={dogProducts} />);

      // NEED filter group
      const needGroup = screen.getByRole("group", { name: /filter by need/i });
      expect(needGroup).toBeTruthy();

      const needButtons = ["Longevity", "Joints", "Calm", "Skin & coat"];
      needButtons.forEach((need) => {
        const btn = screen.getByRole("button", { name: need });
        expect(btn).toBeTruthy();
        expect(btn.getAttribute("aria-pressed")).toBe("false");
      });

      // FORMAT filter group with counts: All 10, Chews 4, Treats 1, Oils 4, Powder 1
      const formatGroup = screen.getByRole("group", {
        name: /filter by format/i,
      });
      expect(formatGroup).toBeTruthy();

      expect(screen.getByRole("button", { name: /all 10/i })).toBeTruthy();
      expect(screen.getByRole("button", { name: /chews 4/i })).toBeTruthy();
      expect(screen.getByRole("button", { name: /treats 1/i })).toBeTruthy();
      expect(screen.getByRole("button", { name: /oils 4/i })).toBeTruthy();
      expect(screen.getByRole("button", { name: /powder 1/i })).toBeTruthy();
    });

    it("filters products when clicking a NEED button and resets on toggle", () => {
      render(<DogProductsSection initialProducts={dogProducts} />);

      const jointsBtn = screen.getByRole("button", { name: "Joints" });
      fireEvent.click(jointsBtn);

      expect(jointsBtn.getAttribute("aria-pressed")).toBe("true");
      expect(screen.getByText("2 products for dogs")).toBeTruthy();
      expect(screen.getByText("Golden Years")).toBeTruthy();
      expect(screen.getByText("Golden Years Oil")).toBeTruthy();

      // Clicking again resets filter to All
      fireEvent.click(jointsBtn);
      expect(jointsBtn.getAttribute("aria-pressed")).toBe("false");
      expect(screen.getByText("10 products for dogs")).toBeTruthy();
    });

    it("filters products when clicking FORMAT buttons", () => {
      render(<DogProductsSection initialProducts={dogProducts} />);

      // Chews filter (4 products)
      const chewsBtn = screen.getByRole("button", { name: /chews 4/i });
      fireEvent.click(chewsBtn);
      expect(chewsBtn.getAttribute("aria-pressed")).toBe("true");
      expect(screen.getByText("4 products for dogs")).toBeTruthy();
      expect(screen.getByText("More Good Years")).toBeTruthy();
      expect(screen.getByText("Golden Years")).toBeTruthy();
      expect(screen.getByText("Still Sharp")).toBeTruthy();
      expect(screen.getByText("Shine On")).toBeTruthy();

      // Treats filter (1 product)
      const treatsBtn = screen.getByRole("button", { name: /treats 1/i });
      fireEvent.click(treatsBtn);
      expect(treatsBtn.getAttribute("aria-pressed")).toBe("true");
      expect(screen.getByText("1 products for dogs")).toBeTruthy();
      expect(screen.getByText("Good Days")).toBeTruthy();

      // Powder filter (1 product)
      const powderBtn = screen.getByRole("button", { name: /powder 1/i });
      fireEvent.click(powderBtn);
      expect(screen.getByText("Second Wind")).toBeTruthy();

      // Oils filter (4 products)
      const oilsBtn = screen.getByRole("button", { name: /oils 4/i });
      fireEvent.click(oilsBtn);
      expect(screen.getByText("4 products for dogs")).toBeTruthy();
      expect(screen.getByText("More Good Years Oil")).toBeTruthy();
    });

    it("renders semantic sort selector and changes sort order", () => {
      render(<DogProductsSection initialProducts={dogProducts} />);

      const sortSelect = screen.getByRole("combobox", {
        name: /sort products/i,
      }) as HTMLSelectElement;
      expect(sortSelect).toBeTruthy();

      // Check all 5 options
      const options = Array.from(sortSelect.options).map((o) => o.text);
      expect(options).toEqual([
        "Sort: Best sellers",
        "Sort: Featured",
        "Sort: Price: Low to High",
        "Sort: Price: High to Low",
        "Sort: Name: A to Z",
      ]);

      // Change sort to price low to high
      fireEvent.change(sortSelect, { target: { value: "price-asc" } });
      expect(sortSelect.value).toBe("price-asc");

      // Verify Good Days ($29) appears before More Good Years ($44)
      const headings = screen.getAllByRole("heading", { level: 2 });
      const names = headings.map((h) => h.textContent);
      const goodDaysIdx = names.findIndex((n) => n?.includes("Good Days"));
      const mgyIdx = names.findIndex((n) => n?.includes("More Good Years"));
      expect(goodDaysIdx).toBeLessThan(mgyIdx);
    });

    it("renders promo cards with Take the quiz and See bundles actions", () => {
      render(<DogProductsSection initialProducts={dogProducts} />);

      // Quiz Promo Card
      expect(screen.getByText("Which one for my dog?")).toBeTruthy();
      const quizLink = screen.getByRole("link", { name: "Take the quiz" });
      expect(quizLink.getAttribute("href")).toBe("/pet/quiz");

      // Bundles Promo Card
      expect(screen.getByText("Chew + oil bundles")).toBeTruthy();
      const seeBundlesLink = screen.getByRole("link", { name: "See bundles" });
      expect(seeBundlesLink.getAttribute("href")).toBe("#bundles");
    });
  });

  describe("DoseByWeightSection Component", () => {
    it("renders all 4 weight tier bands and Full dosing guide link", () => {
      render(<DoseByWeightSection />);

      expect(
        screen.getByRole("heading", { level: 2, name: /dose by weight/i })
      ).toBeTruthy();

      DOG_WEIGHT_TIERS.forEach((tier) => {
        expect(screen.getByText(tier.weightRange)).toBeTruthy();
        expect(screen.getByText(tier.doseText)).toBeTruthy();
      });

      const dosingGuideLink = screen.getByRole("link", {
        name: "Full dosing guide",
      });
      expect(dosingGuideLink.getAttribute("href")).toBe("/pet/dose-calculator");
    });
  });

  describe("BundlesSection Component", () => {
    it("renders only the bundles that have a catalog kit, priced from the kit", () => {
      render(
        <BundlesSection
          cartProvider={mockCartProviderInstance}
          kits={getAllKits()}
          market={DEFAULT_MARKET}
        />
      );

      expect(
        screen.getByRole("heading", { level: 2, name: /chew \+ oil, by need/i })
      ).toBeTruthy();

      const kitSlugs = new Set(getAllKits().map((kit) => kit.slug));
      const withKit = DOG_BUNDLES.filter(
        (bundle) => bundle.kitSlug && kitSlugs.has(bundle.kitSlug)
      );
      const withoutKit = DOG_BUNDLES.filter(
        (bundle) => !withKit.includes(bundle)
      );
      expect(withKit.length).toBeGreaterThan(0);

      withKit.forEach((bundle) => {
        expect(screen.getByText(bundle.name)).toBeTruthy();
        expect(screen.getByText(bundle.category)).toBeTruthy();
      });
      withoutKit.forEach((bundle) => {
        expect(screen.queryByText(bundle.name)).toBeNull();
      });

      const addButtons = screen.getAllByRole("button", {
        name: /add .* bundle/i,
      });
      expect(addButtons).toHaveLength(withKit.length);

      const chewOil = getAllKits().find((kit) => kit.slug === "chew-oil");
      const expected = formatMoneyWithMarket(chewOil!.price, DEFAULT_MARKET);
      expect(screen.getAllByText(expected).length).toBeGreaterThanOrEqual(1);
    });

    it("calls cartProvider.addKit with the chew-oil kit when clicking Add bundle", async () => {
      render(
        <BundlesSection
          cartProvider={mockCartProviderInstance}
          kits={getAllKits()}
          market={DEFAULT_MARKET}
        />
      );

      const mgyBundle = DOG_BUNDLES[0];
      const button = screen.getByRole("button", {
        name: /add more good years chew \+ oil/i,
      });

      fireEvent.click(button);

      await waitFor(() => {
        expect(mockCartProviderInstance.addKit).toHaveBeenCalledWith(
          "chew-oil",
          1
        );
      });

      // Accessible polite feedback
      await waitFor(() => {
        expect(
          screen.getByText(`Added ${mgyBundle.name} to cart`)
        ).toBeTruthy();
      });
    });
  });

  describe("CatsAndHorsesSection Component", () => {
    it("renders cats and horses products including equine food compliance notice", () => {
      render(
        <CatsAndHorsesSection products={[...catProducts, ...horseProducts]} />
      );

      expect(
        screen.getByRole("heading", { level: 2, name: /not just for dogs/i })
      ).toBeTruthy();

      expect(screen.getByText("High Jump")).toBeTruthy();
      expect(screen.getByText("Purr Mode")).toBeTruthy();
      expect(screen.getByText("Long Stride")).toBeTruthy();
      expect(screen.getByText("Solid Ground")).toBeTruthy();

      // Equine compliance rule 8
      const equineNotices = screen.getAllByText(
        /not for horses intended for food/i
      );
      expect(equineNotices.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("Helper Functions", () => {
    it("matches formats accurately", () => {
      const chew = dogProducts.find((p) => p.slug === "more-good-years")!;
      const oil = dogProducts.find((p) => p.slug === "more-good-years-oil")!;
      const treat = dogProducts.find((p) => p.slug === "good-days")!;
      const powder = dogProducts.find((p) => p.slug === "second-wind")!;

      expect(matchesFormat(chew, "Chews")).toBe(true);
      expect(matchesFormat(chew, "Oils")).toBe(false);

      expect(matchesFormat(oil, "Oils")).toBe(true);
      expect(matchesFormat(treat, "Treats")).toBe(true);
      expect(matchesFormat(powder, "Powder")).toBe(true);
      expect(matchesFormat(powder, "All")).toBe(true);
    });

    it("resolves product need category", () => {
      const joints = dogProducts.find((p) => p.slug === "golden-years")!;
      const calm = dogProducts.find((p) => p.slug === "still-sharp")!;
      const skin = dogProducts.find((p) => p.slug === "shine-on")!;
      const longevity = dogProducts.find((p) => p.slug === "more-good-years")!;

      expect(getProductNeed(joints)).toBe("Joints");
      expect(getProductNeed(calm)).toBe("Calm");
      expect(getProductNeed(skin)).toBe("Skin & coat");
      expect(getProductNeed(longevity)).toBe("Longevity");
    });
  });
});
