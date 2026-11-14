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
  getSubscriptionIntervals,
  formatIntervalsText,
} from "@/app/(pet)/pet/subscribe/page";
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

    expect(getSubscriptionDiscount(mockProducts)).toBe(20);
  });

  it("derives and formats unique interval days from selling plans", () => {
    const mockProducts = [
      {
        sellingPlans: [
          { intervalDays: 30, discountPercentage: 15 },
          { intervalDays: 60, discountPercentage: 15 },
          { intervalDays: 90, discountPercentage: 15 },
        ],
      },
      {
        sellingPlans: [{ intervalDays: 30, discountPercentage: 15 }],
      },
    ] as unknown as Product[];

    const intervals = getSubscriptionIntervals(mockProducts);
    expect(intervals).toEqual([30, 60, 90]);
    expect(formatIntervalsText(intervals)).toBe("30, 60 or 90 days");
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

  it("renders example savings note without fixed unformatted currency", async () => {
    const body = await renderPetSubscribe();
    expect(
      within(body).getByText(
        /Example prices\. Yearly savings assume delivery every \d+ days\./
      )
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

    expect(screen.getByText("Dec 3 (example)")).toBeTruthy();
    fireEvent.click(skipBtn);
    expect(screen.getByText("Jan 2 (example)")).toBeTruthy();
    expect(
      screen.getByText("Next delivery skipped to Jan 2 (example).")
    ).toBeTruthy();
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
    expect(screen.getByText("Swapped product to Golden Years.")).toBeTruthy();

    fireEvent.click(swapBtn);
    expect(
      screen.getByText("Swapped product to More Good Years.")
    ).toBeTruthy();
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
