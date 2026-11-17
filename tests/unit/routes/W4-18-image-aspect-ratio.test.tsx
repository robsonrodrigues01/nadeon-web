// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Hero } from "@/app/(human)/human/_components/hero";
import { AgeBands } from "@/app/(human)/human/_components/age-bands";
import { PetGallery } from "@/app/(pet)/pet/products/[slug]/_components/pet-gallery";
import { mockCatalogProvider } from "@/lib/providers/mock/catalog";

afterEach(cleanup);

function expectContainedFillImage(image: HTMLElement) {
  expect(image.dataset.nimg).toBe("fill");
  expect(image.getAttribute("width")).toBeNull();
  expect(image.getAttribute("height")).toBeNull();
  expect(image.style.width).toBe("100%");
  expect(image.style.height).toBe("100%");
  expect(image.className).toContain("object-contain");
  expect(image.parentElement?.className).toContain("relative");
  expect(image.getAttribute("sizes")).toBeTruthy();
}

describe("W4-18 image aspect ratios", () => {
  it("renders Human hero product art into a ratio-preserving box", () => {
    render(<Hero />);

    expectContainedFillImage(
      screen.getByRole("img", { name: "Full Charge NMN 4-in-1" })
    );
  });

  it("renders the Human age-band product art into a ratio-preserving box", () => {
    render(<AgeBands />);

    expectContainedFillImage(
      screen.getByRole("img", { name: "Full Charge - NMN 4-in-1" })
    );
  });

  it("renders the Pet product gallery art in a sized aspect-ratio box", async () => {
    const product = await mockCatalogProvider.getProduct("more-good-years");
    expect(product).not.toBeNull();
    render(<PetGallery product={product!} />);
    const image = screen.getByRole("img", {
      name: "More Good Years - Jar",
    });

    expectContainedFillImage(image);
    expect(image.getAttribute("sizes")).toContain("100vw");
    expect(image.parentElement?.className).toContain("aspect-4/3");
  });
});
