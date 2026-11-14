// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, within, cleanup } from "@testing-library/react";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => "/human/shop/capsules",
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

import ShopByFormatPage, {
  generateMetadata,
  generateStaticParams,
} from "@/app/(human)/human/shop/[format]/page";

async function renderFormat(format: string, sort?: string) {
  const element = await ShopByFormatPage({
    params: Promise.resolve({ format }),
    searchParams: Promise.resolve(sort ? { sort } : {}),
  });
  return render(element);
}

describe("W2-05 Route: Shop by format (/human/shop/[format])", () => {
  afterEach(() => {
    cleanup();
  });

  it("pre-renders the three formats", () => {
    expect(generateStaticParams()).toEqual([
      { format: "capsules" },
      { format: "powders" },
      { format: "tinctures" },
    ]);
  });

  it("exports canonical metadata per format", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ format: "powders" }),
    });
    expect(meta.title).toBe("Shop powders | Nadeon Labs");
    expect(meta.alternates?.canonical).toBe(
      "https://nadeonlabs.com/human/shop/powders"
    );
  });

  it("rejects unknown formats with notFound", async () => {
    await expect(
      ShopByFormatPage({
        params: Promise.resolve({ format: "gummies" }),
        searchParams: Promise.resolve({}),
      })
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("renders the heading, breadcrumb and format tabs with counts", async () => {
    const { container } = await renderFormat("capsules");

    expect(
      screen.getByRole("heading", { level: 1, name: "Capsules" })
    ).toBeDefined();

    const breadcrumb = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(
      within(breadcrumb)
        .getByRole("link", { name: "Home" })
        .getAttribute("href")
    ).toBe("/");

    const tabs = screen.getByRole("navigation", { name: "Formats" });
    const capsulesTab = within(tabs).getByRole("link", { name: /Capsules/ });
    expect(capsulesTab.getAttribute("aria-current")).toBe("page");
    expect(capsulesTab.getAttribute("href")).toBe("/human/shop/capsules");
    expect(
      within(tabs)
        .getByRole("link", { name: /Powders/ })
        .getAttribute("href")
    ).toBe("/human/shop/powders");
    expect(
      within(tabs)
        .getByRole("link", { name: /Tinctures/ })
        .getAttribute("href")
    ).toBe("/human/shop/tinctures");
    expect(
      within(tabs).getByRole("link", { name: /3 formulas/ })
    ).toBeDefined();
    expect(container.textContent).toContain("2 formulas");
  });

  it("renders one product card with an Add to cart button per capsule", async () => {
    await renderFormat("capsules");

    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(3);
    const addButtons = screen.getAllByRole("button", {
      name: /^Add .+ to cart/,
    });
    expect(addButtons).toHaveLength(3);
    addButtons.forEach((button) => {
      expect(button.tagName).toBe("BUTTON");
      expect(button.getAttribute("type")).toBe("button");
    });
  });

  it("formats prices with the market currency through Intl", async () => {
    const { container } = await renderFormat("capsules");
    // BioHack shows $65.00: the mock catalog overrides its data price (59).
    expect(container.textContent).toContain("$65.00");
    expect(container.textContent).toContain("$69.00");
  });

  it("exposes the sort control as a labelled select with the featured default", async () => {
    await renderFormat("capsules");

    const sort = screen.getByRole("combobox", { name: "Sort" });
    expect(sort.tagName).toBe("SELECT");
    expect((sort as HTMLSelectElement).value).toBe("featured");
    const options = within(sort)
      .getAllByRole("option")
      .map((o) => o.textContent);
    expect(options).toEqual([
      "Featured",
      "Price: low to high",
      "Price: high to low",
      "Title: A to Z",
    ]);
  });

  it("applies the price-asc sort from the URL", async () => {
    await renderFormat("powders", "price-asc");

    const first = screen.getAllByRole("article")[0];
    expect(
      within(first).getByRole("heading", { level: 3 }).textContent
    ).toContain("Prime");
    expect(
      (screen.getByRole("combobox", { name: "Sort" }) as HTMLSelectElement)
        .value
    ).toBe("price-asc");
  });

  it("applies the price-desc sort from the URL", async () => {
    await renderFormat("powders", "price-desc");

    const first = screen.getAllByRole("article")[0];
    expect(
      within(first).getByRole("heading", { level: 3 }).textContent
    ).toContain("Glow");
  });

  it("falls back to featured when the sort value is invalid", async () => {
    await renderFormat("powders", "not-a-sort");
    expect(
      (screen.getByRole("combobox", { name: "Sort" }) as HTMLSelectElement)
        .value
    ).toBe("featured");
  });

  it("renders the Compare link that points to the format comparison", async () => {
    await renderFormat("capsules");
    const compare = screen.getByRole("link", { name: "Compare" });
    expect(compare.getAttribute("href")).toBe("#compare-formats");
    expect(
      screen.getByRole("heading", { name: "Compare formulas" })
    ).toBeDefined();
  });

  it("renders the three format shop buttons in the comparison, marking the current one", async () => {
    await renderFormat("tinctures");

    const compareSection = document.getElementById("compare-formats");
    expect(compareSection).not.toBeNull();
    const scoped = within(compareSection as HTMLElement);
    expect(scoped.getByText("You are here")).toBeDefined();
    expect(
      scoped.getByRole("link", { name: "Shop capsules" }).getAttribute("href")
    ).toBe("/human/shop/capsules");
    expect(
      scoped.getByRole("link", { name: "Shop powders" }).getAttribute("href")
    ).toBe("/human/shop/powders");
    expect(
      scoped.getByRole("link", { name: "Shop tinctures" }).getAttribute("href")
    ).toBe("/human/shop/tinctures");
  });

  it("renders the quiz block with a Take the quiz link", async () => {
    await renderFormat("capsules");
    const quiz = screen.getByRole("link", { name: "Take the quiz" });
    expect(quiz.getAttribute("href")).toBe("/human/quiz");
    expect(
      screen.getByRole("heading", { level: 2, name: "Not sure which one?" })
    ).toBeDefined();
  });

  it("renders the FAQ with native disclosure controls and an All FAQs link", async () => {
    const { container } = await renderFormat("capsules");

    expect(
      screen.getByRole("heading", { level: 2, name: "Capsule questions" })
    ).toBeDefined();
    const disclosures = container.querySelectorAll("details");
    expect(disclosures.length).toBeGreaterThan(0);
    disclosures.forEach((d) => {
      expect(d.querySelector("summary")).not.toBeNull();
    });
    expect(
      screen.getByRole("link", { name: "All FAQs" }).getAttribute("href")
    ).toBe("/human/faq");
  });

  it("emits JSON-LD breadcrumb and FAQ data", async () => {
    const { container } = await renderFormat("capsules");
    const breadcrumb = container.querySelector("#breadcrumb-jsonld");
    expect(breadcrumb?.getAttribute("type")).toBe("application/ld+json");
    expect(JSON.parse(breadcrumb?.textContent ?? "{}")["@type"]).toBe(
      "BreadcrumbList"
    );
    const faq = container.querySelector("#faq-jsonld");
    expect(JSON.parse(faq?.textContent ?? "{}")["@type"]).toBe("FAQPage");
  });

  it("never shows design placeholders in visible text", async () => {
    const { container } = await renderFormat("capsules");
    const visible = container.cloneNode(true) as HTMLElement;
    visible.querySelectorAll("script").forEach((s) => s.remove());
    const text = visible.textContent ?? "";
    expect(text).not.toContain("[X]");
    expect(text).not.toContain("$XX");
    expect(text).not.toContain("(example)");
    expect(text).not.toContain("[Name]");
  });
});
