// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from "vitest";
import {
  render,
  screen,
  cleanup,
  within,
  fireEvent,
} from "@testing-library/react";
import PetSubscribePage, {
  generateMetadata,
  getSubscriptionDiscount,
  getSubscriptionDiscountPercentage,
  getSubscriptionIntervals,
  formatIntervalsText,
  getUniqueSellingPlans,
  getProductSubscriptionDiscount,
} from "@/app/(pet)/pet/subscribe/page";
import { WhatYouSave } from "@/app/(pet)/pet/subscribe/_components/what-you-save";
import { DEFAULT_MARKET } from "@/lib/market/markets";
import type { Product } from "@/lib/contracts/catalog";

// Página de servidor lê o cookie de mercado; o teste não tem requisição HTTP.
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => undefined }),
}));

async function renderPetSubscribe() {
  const component = await PetSubscribePage();
  render(component);
  return document.body;
}

afterEach(() => cleanup());

describe("W2-31 /pet/subscribe contract derivation helpers", () => {
  it("derives discount percentage from selling plans rather than fixed values", () => {
    const mockProducts = [
      {
        sellingPlans: [{ intervalDays: 30, discountPercentage: 20 }],
      },
    ] as unknown as Product[];

    expect(getSubscriptionDiscountPercentage(mockProducts)).toBe(20);
    expect(getSubscriptionDiscount(mockProducts)).toBe(20);
  });

  it("returns null when products have plans=[] or no discount configured", () => {
    const emptyPlanProducts = [
      {
        sellingPlans: [],
      },
    ] as unknown as Product[];
    expect(getSubscriptionDiscountPercentage(emptyPlanProducts)).toBeNull();

    const noDiscountProducts = [
      {
        sellingPlans: [{ intervalDays: 30, discountPercentage: 0 }],
      },
    ] as unknown as Product[];
    expect(getSubscriptionDiscountPercentage(noDiscountProducts)).toBeNull();

    expect(getSubscriptionDiscountPercentage([])).toBeNull();
  });

  it("derives and formats unique interval days from selling plans including 180 days", () => {
    const mockProducts = [
      {
        sellingPlans: [
          { intervalDays: 30, discountPercentage: 15 },
          { intervalDays: 60, discountPercentage: 15 },
          { intervalDays: 90, discountPercentage: 15 },
          { intervalDays: 180, discountPercentage: 15 },
        ],
      },
      {
        sellingPlans: [{ intervalDays: 30, discountPercentage: 15 }],
      },
    ] as unknown as Product[];

    const intervals = getSubscriptionIntervals(mockProducts);
    expect(intervals).toEqual([30, 60, 90, 180]);
    expect(formatIntervalsText(intervals)).toBe("30, 60, 90 or 180 days");
  });

  it("returns empty array and null text when plans=[] (no fixed fallback)", () => {
    const emptyProducts = [
      {
        sellingPlans: [],
      },
    ] as unknown as Product[];

    const intervals = getSubscriptionIntervals(emptyProducts);
    expect(intervals).toEqual([]);
    expect(formatIntervalsText(intervals)).toBeNull();
    expect(formatIntervalsText([])).toBeNull();
  });

  it("deduplicates unique selling plans across products", () => {
    const mockProducts = [
      {
        sellingPlans: [
          { id: "p1", intervalDays: 30, discountPercentage: 15 },
          { id: "p2", intervalDays: 60, discountPercentage: 15 },
        ],
      },
      {
        sellingPlans: [
          { id: "p3", intervalDays: 30, discountPercentage: 15 },
          { id: "p4", intervalDays: 90, discountPercentage: 15 },
        ],
      },
    ] as unknown as Product[];

    const unique = getUniqueSellingPlans(mockProducts);
    expect(unique.map((p) => p.intervalDays)).toEqual([30, 60, 90]);
  });

  it("derives product subscription discount prioritizing 30-day plan or null when plans=[]", () => {
    const productWith30d = {
      sellingPlans: [
        { intervalDays: 60, discountPercentage: 10 },
        { intervalDays: 30, discountPercentage: 15 },
      ],
    } as unknown as Product;
    expect(getProductSubscriptionDiscount(productWith30d)).toBe(15);

    const productWithEmptyPlans = {
      sellingPlans: [],
    } as unknown as Product;
    expect(getProductSubscriptionDiscount(productWithEmptyPlans)).toBeNull();
  });
});

describe("W2-31 /pet/subscribe metadata and SEO", () => {
  it("builds title, description and canonical path via generateMetadata", async () => {
    const meta = await generateMetadata();
    expect(meta.title).toContain("Subscribe & Save");
    expect(meta.title).toContain("Nadeon Pet");
    expect(String(meta.alternates?.canonical)).toMatch(/\/pet\/subscribe$/);
    expect(meta.description).toContain("daily chew");
  });

  it("renders breadcrumb and FAQ json-ld schemas", async () => {
    await renderPetSubscribe();
    const scripts = document.querySelectorAll(
      'script[type="application/ld+json"]'
    );
    expect(scripts.length).toBeGreaterThanOrEqual(2);

    const scriptContents = Array.from(scripts).map((s) => s.textContent || "");
    const breadcrumb = scriptContents.find((c) => c.includes("BreadcrumbList"));
    const faq = scriptContents.find((c) => c.includes("FAQPage"));

    expect(breadcrumb).toBeTruthy();
    expect(breadcrumb).toContain("/pet/subscribe");

    expect(faq).toBeTruthy();
    expect(faq).toContain("When will I be charged?");
    expect(faq).toContain("Can I subscribe to more than one product?");
  });
});

describe("W2-31 /pet/subscribe semantic structure and headings", () => {
  it("keeps the subscription preview product heading at level three", async () => {
    await renderPetSubscribe();
    expect(
      screen.getAllByRole("heading", { level: 3, name: "More Good Years" })
    ).toHaveLength(2);
  });

  it("renders exactly one H1 heading", async () => {
    await renderPetSubscribe();
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0].textContent).toBe("Never run out of good days.");
  });

  it("renders all required H2 section headings from design", async () => {
    await renderPetSubscribe();
    const requiredH2s = [
      "Three steps, then relax",
      "What you save",
      "You are always in control",
      "Subscription FAQ",
      "Set it once. Save every time.",
    ];

    for (const title of requiredH2s) {
      expect(
        screen.getByRole("heading", { level: 2, name: title })
      ).toBeTruthy();
    }
  });
});

describe("W2-31 /pet/subscribe links and buttons (Catalog 5.7)", () => {
  it("renders 'Build a subscription' links pointing to /pet/build-your-box", async () => {
    await renderPetSubscribe();
    const buildLinks = screen.getAllByRole("link", {
      name: "Build a subscription",
    });
    expect(buildLinks.length).toBeGreaterThanOrEqual(2);
    for (const link of buildLinks) {
      expect(link.getAttribute("href")).toBe("/pet/build-your-box");
    }
  });

  it("renders 'How it works' anchor link", async () => {
    await renderPetSubscribe();
    const howItWorksLink = screen.getByRole("link", { name: "How it works" });
    expect(howItWorksLink.getAttribute("href")).toBe("#how-it-works");
  });

  it("renders 'Find the right formula' link pointing to /pet/quiz", async () => {
    await renderPetSubscribe();
    const quizLink = screen.getByRole("link", {
      name: "Find the right formula",
    });
    expect(quizLink.getAttribute("href")).toBe("/pet/quiz");
  });

  it("renders 'All FAQs' link pointing to /faq", async () => {
    await renderPetSubscribe();
    const faqLink = screen.getByRole("link", { name: "All FAQs" });
    expect(faqLink.getAttribute("href")).toBe("/faq");
  });

  it("renders all simulation panel buttons using semantic <button type='button'>", async () => {
    await renderPetSubscribe();
    expect(screen.getByRole("button", { name: "Skip next" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Pause" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Change date" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Swap product" })).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Cancel subscription" })
    ).toBeTruthy();

    const buttons = [
      screen.getByRole("button", { name: "Skip next" }),
      screen.getByRole("button", { name: "Pause" }),
      screen.getByRole("button", { name: "Change date" }),
      screen.getByRole("button", { name: "Swap product" }),
      screen.getByRole("button", { name: "Cancel subscription" }),
    ];

    for (const btn of buttons) {
      expect(btn.getAttribute("type")).toBe("button");
      expect(btn.className).toContain("min-h-[44px]");
    }
  });
});

describe("W2-31 /pet/subscribe pricing and savings calculation", () => {
  it("renders products from catalog in the savings table", async () => {
    const body = await renderPetSubscribe();
    expect(within(body).getAllByText("More Good Years").length).toBeGreaterThan(
      0
    );
    expect(within(body).getAllByText("Golden Years").length).toBeGreaterThan(0);
    expect(within(body).getAllByText("Good Days").length).toBeGreaterThan(0);
    expect(within(body).getAllByText("High Jump").length).toBeGreaterThan(0);
  });

  it("renders empty state in WhatYouSave when products have plans=[]", () => {
    const productsWithNoPlans = [
      {
        slug: "no-plan-pet",
        name: "No Plan Pet",
        variants: [{ id: "v1", price: { amount: 30, currencyCode: "USD" } }],
        sellingPlans: [],
      },
    ] as unknown as Product[];

    render(
      <WhatYouSave products={productsWithNoPlans} market={DEFAULT_MARKET} />
    );
    expect(screen.getByTestId("what-you-save-empty")).toBeTruthy();
    expect(
      screen.getByText("No subscription plans available at this time.")
    ).toBeTruthy();
  });

  it("renders empty state in WhatYouSave when products array is empty", () => {
    render(<WhatYouSave products={[]} market={DEFAULT_MARKET} />);
    expect(screen.getByTestId("what-you-save-empty")).toBeTruthy();
  });

  it("renders savings note without fixed unformatted currency", async () => {
    const body = await renderPetSubscribe();
    expect(
      within(body).getByText(/Final prices are set at launch\./)
    ).toBeTruthy();
  });
});

describe("W2-31 /pet/subscribe compliance (Rule 8)", () => {
  it("renders FDA disclaimer, pet notice and equine notice", async () => {
    const body = await renderPetSubscribe();
    expect(
      within(body).getAllByText(/Food and Drug Administration/).length
    ).toBeGreaterThan(0);
    expect(within(body).getByText(/For animal use only/)).toBeTruthy();
    expect(
      within(body).getByText(
        /Equine products: not for horses intended for food/
      )
    ).toBeTruthy();
  });
});

describe("W2-31 /pet/subscribe interactive simulation dashboard", () => {
  it("skips delivery date when 'Skip next' is clicked", async () => {
    await renderPetSubscribe();
    const skipBtn = screen.getByRole("button", { name: "Skip next" });

    fireEvent.click(skipBtn);
    expect(screen.getByText(/Next delivery skipped to/)).toBeTruthy();
  });

  it("toggles pause/resume when 'Pause' is clicked", async () => {
    await renderPetSubscribe();
    const pauseBtn = screen.getByRole("button", { name: "Pause" });

    fireEvent.click(pauseBtn);
    expect(
      screen.getByText(/Subscription paused for up to \d+ months\./)
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: "Resume" })).toBeTruthy();

    const resumeBtn = screen.getByRole("button", { name: "Resume" });
    fireEvent.click(resumeBtn);
    expect(
      screen.getByText("Subscription resumed. Your next shipment is scheduled.")
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: "Pause" })).toBeTruthy();
  });

  it("swaps product when 'Swap product' is clicked", async () => {
    await renderPetSubscribe();
    const swapBtn = screen.getByRole("button", { name: "Swap product" });

    fireEvent.click(swapBtn);
    expect(screen.getByText(/Swapped product to/)).toBeTruthy();

    fireEvent.click(swapBtn);
    expect(screen.getByText(/Swapped product to/)).toBeTruthy();
  });

  it("cancels and reactivates subscription", async () => {
    await renderPetSubscribe();
    const cancelBtn = screen.getByRole("button", {
      name: "Cancel subscription",
    });

    fireEvent.click(cancelBtn);
    expect(
      screen.getByText(
        "Subscription cancelled. You can reactivate anytime with one tap."
      )
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Reactivate subscription" })
    ).toBeTruthy();

    const reactivateBtn = screen.getByRole("button", {
      name: "Reactivate subscription",
    });
    fireEvent.click(reactivateBtn);
    expect(screen.getByText("Subscription reactivated.")).toBeTruthy();
  });
});

describe("W2-31 /pet/subscribe interactive FAQ accordion", () => {
  it("toggles answers open and closed with accessible attributes", async () => {
    await renderPetSubscribe();
    const firstQuestion = screen.getByRole("button", {
      name: /When will I be charged\?/,
    });
    expect(firstQuestion.getAttribute("aria-expanded")).toBe("true");

    const secondQuestion = screen.getByRole("button", {
      name: /Can I subscribe to more than one product\?/,
    });
    expect(secondQuestion.getAttribute("aria-expanded")).toBe("false");

    fireEvent.click(secondQuestion);
    expect(secondQuestion.getAttribute("aria-expanded")).toBe("true");
    expect(
      screen.getByText(
        /You can subscribe to multiple products across dogs, cats and horses/
      )
    ).toBeTruthy();
  });
});
