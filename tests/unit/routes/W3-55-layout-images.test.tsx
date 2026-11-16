// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => undefined }),
}));
vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
  notFound: vi.fn(() => {
    throw new Error("NOT_FOUND");
  }),
}));

import CancelSubscriptionPage from "@/app/(account)/account/subscriptions/[id]/cancel/page";
import { ShopCollection } from "@/app/(human)/human/shop/_components/shop-collection";
import { ProductCard } from "@/components/commerce/product-card";
import { mockCatalogProvider } from "@/lib/providers/mock/catalog";

afterEach(cleanup);

describe("W3-55 responsive account cancellation and product card images", () => {
  it("keeps the account nav stacked until it becomes a sidebar", async () => {
    const page = await CancelSubscriptionPage({
      params: Promise.resolve({ id: "sub_biohack_001" }),
    });
    const { container } = render(page);
    const layout = container.querySelector("main > div > div:nth-child(3)");

    expect(layout?.className).toContain("lg:flex-row");
    expect(layout?.className).not.toContain("md:flex-row");
  });

  it("uses a sized fill image in shared product cards", async () => {
    const product = await mockCatalogProvider.getProduct("more-good-years");
    expect(product).not.toBeNull();

    const { container } = render(<ProductCard product={product!} />);
    const image = container.querySelector("img");

    expect(image?.getAttribute("data-nimg")).toBe("fill");
    expect(image?.getAttribute("sizes")).toContain("25vw");
    expect(image?.className).toContain("object-contain");
  });

  it("uses a sized fill image in the Human capsule listing", async () => {
    const product = await mockCatalogProvider.getProduct("renew");
    expect(product).not.toBeNull();

    render(<ShopCollection products={[product!]} />);
    const image = screen.getByRole("img", { name: /renew/i });

    expect(image.getAttribute("data-nimg")).toBe("fill");
    expect(image.getAttribute("sizes")).toContain("25vw");
    expect(image.className).toContain("object-contain");
  });
});
