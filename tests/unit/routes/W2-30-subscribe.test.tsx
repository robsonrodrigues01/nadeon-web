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

async function renderSubscribe() {
  const page = await SubscribePage();
  render(page);
  return document.body;
}

afterEach(() => {
  cleanup();
});

describe("W2-30 /human/subscribe metadata and SEO", () => {
  it("builds title, description and canonical path", async () => {
    const meta = await generateMetadata();
    expect(meta.title).toContain("Subscribe");
    expect(meta.title).toContain("Nadeon");
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
    expect(screen.getByText("Save 15%")).toBeTruthy();
  });

  it("renders Math savings table/cards from catalog data", async () => {
    await renderSubscribe();
    expect(screen.getAllByText(/BioHack/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Assumes one jar per month/i)).toBeTruthy();
  });

  it("renders all delivery frequency options (30 to 180 days)", async () => {
    await renderSubscribe();
    expect(screen.getAllByText(/30/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/60/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/90/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/120/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/180/).length).toBeGreaterThan(0);
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
    // After clicking open/close, toggle state works
    expect(screen.getByText(/When each box ships/i)).toBeTruthy();
  });
});
