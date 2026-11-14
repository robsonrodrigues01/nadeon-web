// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

import PetProductDetailPage from "@/app/(pet)/pet/products/[slug]/page";

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

  it("shows the FDA note once in the purchase card", async () => {
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
});
