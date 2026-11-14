// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

import PetProductDetailPage, {
  generateMetadata,
} from "@/app/(pet)/pet/products/[slug]/page";
import { catalogProvider } from "@/lib/providers";

const marketCookie = vi.hoisted(() => ({
  value: undefined as string | undefined,
}));

vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => ({ value: marketCookie.value }) }),
}));

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

describe("Route W2-12: copy and price rules", () => {
  afterEach(() => {
    cleanup();
  });

  it("takes the discount from the catalog, not from fixed copy", async () => {
    const jsx = await PetProductDetailPage({
      params: Promise.resolve({ slug: "more-good-years" }),
    });
    const { container } = render(jsx);

    // Mock selling plans for More Good Years carry 15% off
    expect(container.textContent).toMatch(/Subscribe & save\s*15%/);
  });

  it("shows the FDA note in the purchase card", async () => {
    const jsx = await PetProductDetailPage({
      params: Promise.resolve({ slug: "more-good-years" }),
    });
    render(jsx);

    const notes = screen.getAllByRole("note");
    const fdaNotes = notes.filter((n) =>
      /not been evaluated by the Food and Drug Administration/.test(
        n.textContent ?? ""
      )
    );
    expect(fdaNotes.length).toBeGreaterThanOrEqual(1);
  });

  it("has no fixed dollar amounts or template placeholders in the copy", async () => {
    const jsx = await PetProductDetailPage({
      params: Promise.resolve({ slug: "more-good-years" }),
    });
    const { container } = render(jsx);
    const text = container.textContent ?? "";

    expect(text).not.toMatch(/Keep out of reach/);
    expect(text).not.toMatch(/Lab report published for every lot/);
    expect(text).not.toMatch(/\[X\]|\$XX|\(example\)/);
  });

  it("renders another pet product with its own copy, not More Good Years text", async () => {
    const jsx = await PetProductDetailPage({
      params: Promise.resolve({ slug: "golden-years" }),
    });
    const { container } = render(jsx);
    const text = container.textContent ?? "";

    // Golden Years' own FAQ may name More Good Years (catalog data), so check
    // the headings that the page builds from the product instead.
    expect(
      screen.getByRole("heading", { name: /the science behind golden years/i })
    ).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: /golden years faq/i })
    ).toBeTruthy();
    expect(text).not.toMatch(/Senior dogs 7\+/);
    expect(text).not.toMatch(/Is More Good Years right/);
  });

  it("formats prices with the market from the cookie, not a fixed locale", async () => {
    marketCookie.value = "eu";
    try {
      const jsx = await PetProductDetailPage({
        params: Promise.resolve({ slug: "more-good-years" }),
      });
      const { container } = render(jsx);
      const text = container.textContent ?? "";

      expect(text).toMatch(/€/);
    } finally {
      marketCookie.value = undefined;
    }
  });

  it("gives metadata per product", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "golden-years" }),
    });

    expect(meta.title).toContain("Golden Years");
    expect(meta.title).not.toContain("More Good Years");
    expect(meta.alternates?.canonical).toContain("/pet/products/golden-years");
  });

  it("shows the same FAQ questions in the page and in the FAQPage JSON-LD", async () => {
    const product = await catalogProvider.getProduct("more-good-years");
    expect(product).not.toBeNull();
    const jsx = await PetProductDetailPage({
      params: Promise.resolve({ slug: "more-good-years" }),
    });
    const { container } = render(jsx);

    const jsonLd = JSON.parse(
      container.querySelector("#faq-jsonld")?.textContent ?? "{}"
    ) as { mainEntity: { name: string }[] };
    const jsonQuestions = jsonLd.mainEntity.map((q) => q.name);
    const visibleQuestions = Array.from(
      container.querySelectorAll("#faq summary span:first-child")
    ).map((el) => el.textContent);

    expect(visibleQuestions).toEqual(product!.faq.map((f) => f.question));
    expect(visibleQuestions).toEqual(jsonQuestions);
  });

  it("renders no write review button at launch", async () => {
    const jsx = await PetProductDetailPage({
      params: Promise.resolve({ slug: "more-good-years" }),
    });
    render(jsx);

    expect(
      screen.queryByRole("button", { name: /write a review/i })
    ).toBeNull();
  });
});
