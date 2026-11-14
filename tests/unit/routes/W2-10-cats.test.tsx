// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import CatsPage, { metadata } from "@/app/(pet)/pet/cats/page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

async function renderCats(query: Record<string, string> = {}) {
  const jsx = await CatsPage({
    searchParams: Promise.resolve(query),
  });
  return render(jsx);
}

describe("W2-10 Route: /pet/cats", () => {
  afterEach(() => {
    cleanup();
  });

  it("exports metadata with canonical path /pet/cats", () => {
    expect(metadata.title).toMatch(/Shop for cats/);
    expect(metadata.alternates?.canonical).toBe(
      "https://nadeonlabs.com/pet/cats"
    );
  });

  it("renders the heading, breadcrumb and species navigation", async () => {
    await renderCats();

    expect(
      screen.getByRole("heading", { level: 1, name: "Shop for cats" })
    ).toBeDefined();
    expect(screen.getByText("Small doses for small bodies.")).toBeDefined();

    const breadcrumb = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(breadcrumb.querySelector('[aria-current="page"]')?.textContent).toBe(
      "Cats"
    );

    const species = screen.getByRole("navigation", { name: "Species" });
    expect(
      within(species).getByRole("link", { name: "Dogs" }).getAttribute("href")
    ).toBe("/pet/dogs");
    expect(
      within(species).getByRole("link", { name: "Cats" }).getAttribute("href")
    ).toBe("/pet/cats");
    expect(
      within(species).getByRole("link", { name: "Horses" }).getAttribute("href")
    ).toBe("/pet/horses");
  });

  it("lists only cat products, each with a real add-to-cart button", async () => {
    await renderCats();

    const products = screen.getByRole("region", { name: "Products" });
    const headings = within(products).getAllByRole("heading", { level: 3 });
    expect(headings.map((h) => h.textContent)).toEqual([
      "High Jump",
      "Purr Mode",
    ]);

    const addButtons = within(products).getAllByRole("button", {
      name: /Add .* to cart/,
    });
    expect(addButtons).toHaveLength(2);
    addButtons.forEach((b) => expect(b.getAttribute("type")).toBe("button"));
  });

  it("formats prices with Intl for the market currency, not a fixed symbol", async () => {
    await renderCats();

    const expected = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(32);
    expect(screen.getAllByText(expected).length).toBeGreaterThan(0);
  });

  it("shows the Pet animal-use notice on each product", async () => {
    await renderCats();

    const notices = screen.getAllByText("For animal use only.");
    expect(notices).toHaveLength(2);
  });

  it("exposes the format and concern filters as fieldsets with legends and radios", async () => {
    await renderCats();

    const concern = screen.getByRole("group", { name: "Concern" });
    const format = screen.getByRole("group", { name: "Format" });

    const concernRadios = within(concern).getAllByRole("radio");
    expect(concernRadios.map((r) => r.getAttribute("value"))).toEqual([
      "",
      "Joints",
      "Calm",
    ]);

    const formatRadios = within(format).getAllByRole("radio");
    expect(formatRadios.map((r) => r.getAttribute("value"))).toEqual([
      "",
      "drops",
      "treats",
    ]);
    expect(
      within(format).getByRole("radio", { name: /Drops 2/ })
    ).toBeDefined();
  });

  it("has a labelled sort control with the design options", async () => {
    await renderCats();

    const sort = screen.getByLabelText("Sort");
    expect(sort.tagName).toBe("SELECT");
    const options = within(sort).getAllByRole("option");
    expect(options.map((o) => o.textContent)).toEqual([
      "Featured",
      "Best sellers",
    ]);
  });

  it("filters products by concern from the URL", async () => {
    await renderCats({ concern: "Calm" });

    const products = screen.getByRole("region", { name: "Products" });
    expect(
      within(products).getByRole("heading", { name: "Purr Mode" })
    ).toBeDefined();
    expect(
      within(products).queryByRole("heading", { name: "High Jump" })
    ).toBeNull();
  });

  it("filters products by format from the URL", async () => {
    await renderCats({ format: "drops" });

    const products = screen.getByRole("region", { name: "Products" });
    expect(within(products).getAllByRole("heading", { level: 3 })).toHaveLength(
      2
    );
  });

  it("renders the cat kit with an Add kit button and no dog kits", async () => {
    await renderCats();

    const kit = screen.getByRole("heading", { level: 3, name: "Cat Care" });
    expect(kit).toBeDefined();
    const kitCard = kit.closest("article") as HTMLElement;
    expect(
      within(kitCard)
        .getByRole("button", { name: "Add kit" })
        .getAttribute("type")
    ).toBe("button");
    expect(screen.queryByRole("heading", { name: "Chew + Oil" })).toBeNull();
  });

  it("renders the quiz links and the guide link as real anchors", async () => {
    await renderCats();

    const quizLinks = screen.getAllByRole("link", { name: "Take the quiz" });
    expect(quizLinks).toHaveLength(2);
    quizLinks.forEach((l) => expect(l.getAttribute("href")).toBe("/pet/quiz"));

    expect(
      screen.getByRole("link", { name: "Read the guide" }).getAttribute("href")
    ).toBe("/pet/dose-calculator");
  });

  it("does not render design placeholders as text", async () => {
    const { container } = await renderCats();
    const text = container.textContent ?? "";

    expect(text).not.toMatch(/\[[A-Za-z ]+\]/);
    expect(text).not.toContain("$XX");
    expect(text).not.toContain("(example)");
    expect(text).not.toMatch(/placeholder/i);
  });
});
