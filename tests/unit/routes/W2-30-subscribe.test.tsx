// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: () => undefined,
  }),
}));

import SubscribePage, {
  generateMetadata,
} from "@/app/(human)/human/subscribe/page";
import { Hero } from "@/app/(human)/human/subscribe/_components/hero";
import { HowItWorks } from "@/app/(human)/human/subscribe/_components/how-it-works";
import { MathComparison } from "@/app/(human)/human/subscribe/_components/math-comparison";
import { FrequencySection } from "@/app/(human)/human/subscribe/_components/frequency-section";
import { BottomCta } from "@/app/(human)/human/subscribe/_components/bottom-cta";
import {
  getSubscribeFaqs,
  SubscribeFaq,
} from "@/app/(human)/human/subscribe/_components/subscribe-faq";
import {
  getSubscriptionDiscountPercentage,
  getProductSubscriptionDiscount,
  getUniqueSellingPlans,
} from "@/app/(human)/human/subscribe/_components/plan-utils";
import { getDefaultMarket } from "@/lib/market/markets";
import type { Product, SellingPlan } from "@/lib/contracts/catalog";

async function renderSubscribe() {
  const page = await SubscribePage();
  render(page);
  return document.body;
}

afterEach(() => {
  cleanup();
});

describe("W2-30 /human/subscribe metadata and SEO", () => {
  it("builds title, description and canonical path with derived discount from contract", async () => {
    const meta = await generateMetadata();
    expect(meta.title).toContain("Subscribe");
    expect(meta.title).toContain("Nadeon");
    expect(meta.title).toContain("15%");
    expect(String(meta.alternates?.canonical)).toMatch(/\/human\/subscribe$/);
  });
});

describe("W2-30 /human/subscribe structure and headings", () => {
  it("renders a single h1 heading for the hero", async () => {
    await renderSubscribe();
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0].textContent).toContain("Your routine,");
    expect(h1s[0].textContent).toContain("on autopilot");
  });

  it("renders all key section h2 headings", async () => {
    await renderSubscribe();
    const expectedHeadings = [
      "Three steps, then relax",
      "What you save",
      "Pick your rhythm",
      "Always in control",
      "Subscription FAQ",
      "Set it once. Save every time.",
    ];

    for (const text of expectedHeadings) {
      expect(
        screen.getByRole("heading", { name: new RegExp(text, "i") })
      ).toBeTruthy();
    }
  });

  it("does not render fixed design artifacts ([X], $XX, (example))", async () => {
    const body = await renderSubscribe();
    const text = body.textContent ?? "";
    expect(text).not.toContain("[X]");
    expect(text).not.toContain("$XX");
    expect(text).not.toContain("(example)");
  });
});

describe("W2-30 /human/subscribe CTAs and navigation", () => {
  it("renders hero CTAs linking to build-your-box and how-it-works", async () => {
    await renderSubscribe();
    const buildLinks = screen.getAllByRole("link", { name: /Build your box/i });
    expect(buildLinks.length).toBeGreaterThanOrEqual(1);
    expect(buildLinks[0].getAttribute("href")).toBe("/human/build-your-box");

    const howItWorksLink = screen.getByRole("link", { name: /How it works/i });
    expect(howItWorksLink.getAttribute("href")).toBe("#how-it-works");
  });

  it("renders bottom CTA buttons linking to build-your-box and quiz", async () => {
    await renderSubscribe();
    const quizLink = screen.getByRole("link", { name: /Take the quiz/i });
    expect(quizLink.getAttribute("href")).toBe("/human/quiz");
  });

  it("links to all FAQs in the FAQ section", async () => {
    await renderSubscribe();
    const faqLink = screen.getByRole("link", { name: /All FAQs/i });
    expect(faqLink.getAttribute("href")).toBe("/faq");
  });
});

describe("W2-30 /human/subscribe sections content", () => {
  it("renders How It Works 3 steps", async () => {
    await renderSubscribe();
    expect(screen.getByText("Choose")).toBeTruthy();
    expect(screen.getByText("Set the rhythm")).toBeTruthy();
    expect(
      screen.getByRole("heading", { level: 3, name: /Save 15%/i })
    ).toBeTruthy();
  });

  it("renders Math savings table/cards from catalog data", async () => {
    await renderSubscribe();
    expect(screen.getAllByText(/BioHack/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Assumes one jar per month/i)).toBeTruthy();
  });

  it("renders delivery frequency options derived from sellingPlans", async () => {
    await renderSubscribe();
    // Mock human products have intervalDays 30, 60, 90
    expect(screen.getAllByText(/30/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/60/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/90/).length).toBeGreaterThan(0);
  });

  it("renders the interactive subscription simulation panel with action buttons", async () => {
    await renderSubscribe();
    const skipBtn = screen.getByRole("button", { name: /Skip next/i });
    const pauseBtn = screen.getByRole("button", { name: /Pause/i });
    const changeDateBtn = screen.getByRole("button", { name: /Change date/i });
    const swapBtn = screen.getByRole("button", { name: /Swap formula/i });
    const cancelBtn = screen.getByRole("button", {
      name: /Cancel subscription/i,
    });

    expect(skipBtn).toBeTruthy();
    expect(pauseBtn).toBeTruthy();
    expect(changeDateBtn).toBeTruthy();
    expect(swapBtn).toBeTruthy();
    expect(cancelBtn).toBeTruthy();

    fireEvent.click(skipBtn);
    expect(screen.getByText(/Next box skipped/i)).toBeTruthy();

    fireEvent.click(pauseBtn);
    expect(screen.getByText(/Subscription paused/i)).toBeTruthy();
  });

  it("allows toggling FAQ accordion items", async () => {
    await renderSubscribe();
    const faqQuestion = screen.getByRole("button", {
      name: /When will I be charged\?/i,
    });
    expect(faqQuestion).toBeTruthy();

    fireEvent.click(faqQuestion);
    expect(screen.getByText(/When each box ships/i)).toBeTruthy();
  });
});

describe("W2-30 plan-utils unit tests without plans and with plans", () => {
  const dummyProductNoPlans: Product = {
    slug: "no-plans",
    handle: "no-plans",
    name: "No Plans Product",
    technicalName: "Test",
    line: "human",
    species: null,
    format: "Capsules",
    color: "var(--accent)",
    images: [],
    actives: [],
    serving: "2 capsules",
    servingsPerJar: 30,
    netWeight: "60g",
    variants: [],
    sellingPlans: [],
    benefits: [],
    howToUse: "Daily",
    faq: [],
    related: [],
    claims: [],
    dosingByWeight: [],
  };

  const dummyProductWithPlan: Product = {
    ...dummyProductNoPlans,
    slug: "with-plan",
    sellingPlans: [
      {
        id: "sp_1",
        name: "Monthly 20%",
        intervalDays: 30,
        discountPercentage: 20,
      },
      {
        id: "sp_2",
        name: "Every 60 days 20%",
        intervalDays: 60,
        discountPercentage: 20,
      },
    ],
  };

  it("returns null when product list is empty or products have no sellingPlans", () => {
    expect(getSubscriptionDiscountPercentage([])).toBeNull();
    expect(getSubscriptionDiscountPercentage([dummyProductNoPlans])).toBeNull();
    expect(getProductSubscriptionDiscount(dummyProductNoPlans)).toBeNull();
  });

  it("returns discount percentage when sellingPlans are present", () => {
    expect(getSubscriptionDiscountPercentage([dummyProductWithPlan])).toBe(20);
    expect(getProductSubscriptionDiscount(dummyProductWithPlan)).toBe(20);
  });

  it("returns empty selling plans array when products have no plans", () => {
    expect(getUniqueSellingPlans([])).toEqual([]);
    expect(getUniqueSellingPlans([dummyProductNoPlans])).toEqual([]);
  });

  it("deduplicates unique selling plans by intervalDays", () => {
    const plans = getUniqueSellingPlans([dummyProductWithPlan]);
    expect(plans).toHaveLength(2);
    expect(plans.map((p) => p.intervalDays)).toEqual([30, 60]);
  });
});

describe("W2-30 FrequencySection empty state and dynamic plans", () => {
  it("renders empty state without frequency cards when plans=[]", () => {
    render(<FrequencySection plans={[]} />);
    expect(
      screen.getByText(/No delivery frequencies currently available/i)
    ).toBeTruthy();
    expect(screen.queryByText("Popular")).toBeNull();
    expect(screen.queryByText("EVERY")).toBeNull();
  });

  it("renders empty state when plans prop is omitted", () => {
    render(<FrequencySection />);
    expect(
      screen.getByText(/No delivery frequencies currently available/i)
    ).toBeTruthy();
    expect(screen.queryByText("Popular")).toBeNull();
  });

  it("renders provided plans when non-empty", () => {
    const testPlans: SellingPlan[] = [
      {
        id: "plan_45",
        name: "Delivery every 45 days (special rhythm)",
        intervalDays: 45,
        discountPercentage: 10,
      },
      {
        id: "plan_90",
        name: "Quarterly stock up",
        intervalDays: 90,
        discountPercentage: 15,
      },
    ];

    render(<FrequencySection plans={testPlans} />);

    expect(screen.getByText("45")).toBeTruthy();
    expect(
      screen.getByText("Delivery every 45 days (special rhythm)")
    ).toBeTruthy();
    expect(screen.getByText("90")).toBeTruthy();
    expect(screen.getByText("Quarterly stock up")).toBeTruthy();
    expect(screen.queryByText("30")).toBeNull();
  });
});

describe("W2-30 components omit percentage when discount is null", () => {
  it("Hero omits percentage when discountPercentage is null", () => {
    render(<Hero discountPercentage={null} />);
    expect(screen.getByText("SUBSCRIBE & SAVE")).toBeTruthy();
    expect(screen.queryByText(/SUBSCRIBE & SAVE \d+%/i)).toBeNull();
    expect(screen.getByText(/Save on every box/i)).toBeTruthy();
  });

  it("HowItWorks omits percentage when discountPercentage is null", () => {
    render(<HowItWorks discountPercentage={null} />);
    expect(
      screen.getByRole("heading", { level: 3, name: /^Save on every box$/i })
    ).toBeTruthy();
  });

  it("BottomCta omits percentage when discountPercentage is null", () => {
    render(<BottomCta discountPercentage={null} />);
    expect(screen.getByText("SAVE ON EVERY BOX")).toBeTruthy();
    expect(screen.queryByText(/SAVE \d+% ON EVERY BOX/i)).toBeNull();
  });

  it("SubscribeFaq omits percentage when discountPercentage is null", () => {
    const faqs = getSubscribeFaqs(null);
    render(<SubscribeFaq faqs={faqs} discountPercentage={null} />);
    expect(
      screen.getByRole("button", {
        name: /Does the subscription discount stack with other offers\?/i,
      })
    ).toBeTruthy();
    expect(screen.queryByText(/Does the \d+%/i)).toBeNull();
  });

  it("MathComparison handles product with no discount gracefully", () => {
    const market = getDefaultMarket();
    const productWithoutDiscount: Product = {
      slug: "no-discount",
      handle: "no-discount",
      name: "Standard Formula",
      technicalName: "Daily Formula",
      line: "human",
      species: null,
      format: "Capsules",
      color: "var(--accent)",
      images: [],
      actives: [],
      serving: "2 capsules",
      servingsPerJar: 30,
      netWeight: "60g",
      variants: [
        {
          id: "var_std_1",
          jars: 1,
          title: "1 Jar",
          price: { amount: 50, currencyCode: "USD" },
          compareAtPrice: { amount: 50, currencyCode: "USD" },
          sku: "STD-1",
        },
      ],
      sellingPlans: [],
      benefits: ["Daily energy*"],
      howToUse: "Daily",
      faq: [],
      related: [],
      claims: [],
      dosingByWeight: [],
    };

    render(
      <MathComparison products={[productWithoutDiscount]} market={market} />
    );

    expect(screen.getAllByText("Standard Formula").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Subscribe").length).toBeGreaterThan(0);
    expect(screen.queryByText(/Subscribe \(\d+% off\)/i)).toBeNull();
  });
});
