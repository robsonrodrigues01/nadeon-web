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
import { MathComparison } from "@/app/(human)/human/subscribe/_components/math-comparison";
import { FrequencySection } from "@/app/(human)/human/subscribe/_components/frequency-section";
import {
  getSubscribeFaqs,
  SubscribeFaq,
} from "@/app/(human)/human/subscribe/_components/subscribe-faq";
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
  it("builds title, description and canonical path with derived discount", async () => {
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
    // Default mock human products have intervalDays 30, 60, 90
    expect(screen.getAllByText(/30/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/60/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/90/).length).toBeGreaterThan(0);
    // 120 and 180 do not exist in selling plans
    expect(screen.queryByText("120")).toBeNull();
    expect(screen.queryByText("180")).toBeNull();
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

describe("W2-30 review findings verification: dynamic discounts and frequencies", () => {
  it("derives math comparison calculations and discount text from sellingPlans.discountPercentage", () => {
    const market = getDefaultMarket();
    const customProduct: Product = {
      slug: "custom-longevity",
      handle: "custom-longevity",
      name: "Custom Longevity",
      technicalName: "Longevity Optimizer",
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
          id: "var_custom_1",
          jars: 1,
          title: "1 Jar",
          price: { amount: 100, currencyCode: "USD" },
          compareAtPrice: { amount: 100, currencyCode: "USD" },
          sku: "TEST-1",
        },
      ],
      sellingPlans: [
        {
          id: "plan_25",
          name: "1 jar every 30 days (25% off)",
          intervalDays: 30,
          discountPercentage: 25,
        },
      ],
      benefits: ["Longevity*"],
      howToUse: "Take daily",
      faq: [],
      related: [],
      claims: [{ text: "Longevity*", isClaim: true }],
      dosingByWeight: [],
    };

    render(<MathComparison products={[customProduct]} market={market} />);

    // 100 base, with 25% discount -> subMo = 75, subYr = 900, savedYr = 300
    expect(screen.getByText("$75.00")).toBeTruthy();
    expect(screen.getByText("$900.00")).toBeTruthy();
    expect(screen.getByText("Subscribe (25% off)")).toBeTruthy();
  });

  it("renders frequency section with contract intervals and sellingPlans names", () => {
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
    // 30 should not be rendered when not in plans
    expect(screen.queryByText("30")).toBeNull();
  });

  it("derives FAQ questions and answers from discount percentage", () => {
    const faqs = getSubscribeFaqs(20);
    render(<SubscribeFaq faqs={faqs} discountPercentage={20} />);

    expect(
      screen.getByRole("button", {
        name: /Does the 20% stack with other offers\?/i,
      })
    ).toBeTruthy();
  });
});
