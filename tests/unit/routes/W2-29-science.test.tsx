// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import {
  render,
  screen,
  cleanup,
  within,
  fireEvent,
} from "@testing-library/react";
import SciencePage, { generateMetadata } from "@/app/(shared)/science/page";

async function renderScience() {
  render(await SciencePage());
  return document.body;
}

afterEach(() => cleanup());

describe("W2-29 /science metadata", () => {
  it("builds title and canonical path from lib/seo", async () => {
    const meta = await generateMetadata();
    expect(meta.title).toContain("Science");
    expect(meta.title).toContain("Nadeon");
    expect(String(meta.alternates?.canonical)).toMatch(/\/science$/);
  });
});

describe("W2-29 /science content", () => {
  it("renders the hero heading as the only h1", async () => {
    await renderScience();
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0].textContent).toBe("The science of NAD+");
  });

  it("renders the design section headings", async () => {
    await renderScience();
    for (const name of [
      "A coenzyme with a big job",
      "From capsule to coenzyme",
      "NAD+ and age",
      "Four ingredients, explained",
      "Science questions",
    ]) {
      expect(screen.getByRole("heading", { name })).toBeTruthy();
    }
  });

  it("lists the ingredient formulas from the catalog provider", async () => {
    await renderScience();
    const nmn = document.getElementById("ingredients") as HTMLElement;
    expect(nmn).toBeTruthy();
    const scope = within(nmn);
    expect(scope.getByText("BioHack 500 mg")).toBeTruthy();
    expect(scope.getByText("Full Charge 500 mg")).toBeTruthy();
    expect(scope.getByText("Renew 500 mg")).toBeTruthy();
    expect(scope.getByText("Prime 250 mg")).toBeTruthy();
  });

  it("wraps asterisk claims in the Claim component (asterisk kept)", async () => {
    const body = await renderScience();
    expect(
      within(body).getByText(
        "NAD+ helps your cells turn the food you eat into usable energy inside the mitochondria.*"
      )
    ).toBeTruthy();
  });

  it("shows the FDA disclaimer and the illustrative chart caption", async () => {
    await renderScience();
    expect(
      screen.getAllByText(/These statements have not been evaluated/).length
    ).toBeGreaterThan(0);
    expect(screen.getByText("Illustrative")).toBeTruthy();
  });

  it("does not render design placeholders or fixed example text", async () => {
    const body = await renderScience();
    const text = body.textContent ?? "";
    expect(text).not.toContain("[X]");
    expect(text).not.toContain("$XX");
    expect(text).not.toContain("(example)");
  });
});

describe("W2-29 /science buttons and links (catalog 5.7)", () => {
  it("renders Shop NMN formulas as a link to the shop", async () => {
    await renderScience();
    const link = screen.getByRole("link", { name: "Shop NMN formulas" });
    expect(link.getAttribute("href")).toBe("/human/shop");
  });

  it("renders See lab results as a link to lab results", async () => {
    await renderScience();
    const link = screen.getByRole("link", { name: "See lab results" });
    expect(link.getAttribute("href")).toBe("/lab-results");
  });

  it("renders Shop by ingredient and Compare formulas as links", async () => {
    await renderScience();
    expect(
      screen
        .getByRole("link", { name: "Shop by ingredient" })
        .getAttribute("href")
    ).toBe("/search");
    expect(
      screen
        .getByRole("link", { name: "Compare formulas" })
        .getAttribute("href")
    ).toBe("/human/shop");
  });

  it("renders All FAQs as a link to the FAQ page", async () => {
    await renderScience();
    expect(
      screen.getByRole("link", { name: "All FAQs" }).getAttribute("href")
    ).toBe("/faq");
  });
});

describe("W2-29 /science FAQ accordion", () => {
  it("uses buttons with aria-expanded and toggles the answer", async () => {
    await renderScience();
    const question = screen.getByRole("button", {
      name: /Is NMN the same as NAD\+\?/,
    });
    expect(question.tagName).toBe("BUTTON");
    expect(question.getAttribute("type")).toBe("button");
    expect(question.getAttribute("aria-expanded")).toBe("true");

    fireEvent.click(question);
    expect(question.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByText(/No\. NMN is a precursor/)).toBeNull();

    fireEvent.click(question);
    expect(question.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText(/No\. NMN is a precursor/)).toBeTruthy();
  });
});
