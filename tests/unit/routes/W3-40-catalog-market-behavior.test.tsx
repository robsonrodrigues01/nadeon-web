// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import HumanShopPage from "@/app/(human)/human/shop/page";
import ShopByFormatPage from "@/app/(human)/human/shop/[format]/page";
import DogsPage from "@/app/(pet)/pet/dogs/page";
import ProductPage from "@/app/(human)/human/products/[slug]/page";
import HumanKitsPage from "@/app/(human)/human/kits/page";
import CartPage from "@/app/(shared)/cart/page";
import { cartProvider } from "@/lib/providers/client";
import { catalogProvider, mockCatalogProvider } from "@/lib/providers";
import { SUPPORTED_MARKETS } from "@/lib/market/markets";
import { getHumanShopGoals } from "@/app/(human)/human/shop/[format]/_components/format-goals";
import type { Market } from "@/lib/market/types";
import type { Cart } from "@/lib/contracts/cart";

const marketCookie = vi.hoisted(() => ({ value: "ca" }));
const routerPush = vi.hoisted(() => vi.fn());

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: () => ({ value: marketCookie.value }),
  }),
}));

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
  usePathname: () => "/human/shop/capsules",
  useRouter: () => ({ push: routerPush }),
}));

function expectedMarketPrice(amount: number, market: Market): string {
  const factor = 10 ** market.currency.fractionDigits;
  const converted = Math.round(amount * market.rate * factor) / factor;
  return new Intl.NumberFormat(market.locale, {
    style: "currency",
    currency: market.currency.code,
  }).format(converted);
}

function cardNames(region: HTMLElement): string[] {
  return within(region)
    .getAllByRole("article")
    .map((card) => within(card).getByRole("heading").textContent ?? "");
}

function formatQuery(href: string): { sort?: string; goal?: string } {
  const query = new URL(href, "https://nadeon.test").searchParams;
  return {
    sort: query.get("sort") ?? undefined,
    goal: query.get("goal") ?? undefined,
  };
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  routerPush.mockReset();
});

describe("W3-40 mounted catalog interactions", () => {
  it("filters and sorts products from the /human/shop controls", async () => {
    render(await HumanShopPage());
    const list = screen.getByRole("region", { name: "Product list" });

    fireEvent.click(screen.getByRole("button", { name: /Capsules/ }));
    const capsules = (await mockCatalogProvider.getProducts({ line: "human" }))
      .filter((product) => product.format.toLowerCase() === "capsules")
      .map((product) => product.name);
    expect(cardNames(list)).toEqual(capsules);

    fireEvent.change(
      screen.getByRole("combobox", { name: "Sort: Best sellers" }),
      {
        target: { value: "price-asc" },
      }
    );
    expect(cardNames(list)).toEqual(
      [...(await mockCatalogProvider.getProducts({ line: "human" }))]
        .filter((product) => product.format.toLowerCase() === "capsules")
        .sort((a, b) => a.variants[0].price.amount - b.variants[0].price.amount)
        .map((product) => product.name)
    );
  });

  it("applies a format goal link and sends sort selection to the route query", async () => {
    const initial = await ShopByFormatPage({
      params: Promise.resolve({ format: "capsules" }),
      searchParams: Promise.resolve({}),
    });
    const { rerender } = render(initial);
    const goalLink = screen.getByRole("link", { name: "Healthy aging" });
    expect(goalLink.getAttribute("href")).toBe(
      "/human/shop/capsules?goal=healthy-aging"
    );
    goalLink.addEventListener("click", (event) => event.preventDefault());
    fireEvent.click(goalLink);

    const goalRoute = new URL(
      goalLink.getAttribute("href")!,
      "https://nadeon.test"
    );
    const filtered = await ShopByFormatPage({
      params: Promise.resolve({
        format: goalRoute.pathname.split("/").at(-1)!,
      }),
      searchParams: Promise.resolve(formatQuery(goalRoute.href)),
    });
    rerender(filtered);
    const capsules = await mockCatalogProvider.getCollection("human", {
      line: "human",
      format: "capsules",
    });
    const healthyAging = getHumanShopGoals().find(
      (goal) => goal.id === "healthy-aging"
    )!;
    expect(
      cardNames(screen.getByRole("region", { name: "Shop capsules" }))
    ).toEqual(
      capsules!.products
        .filter((product) => healthyAging.productSlugs.has(product.slug))
        .map((product) => product.name)
    );

    fireEvent.change(screen.getByRole("combobox", { name: "Sort" }), {
      target: { value: "price-desc" },
    });
    expect(routerPush).toHaveBeenCalledWith(
      "/human/shop/capsules?sort=price-desc&goal=healthy-aging",
      { scroll: false }
    );

    const sortUrl = routerPush.mock.calls.at(-1)?.[0] as string;
    const sorted = await ShopByFormatPage({
      params: Promise.resolve({ format: "capsules" }),
      searchParams: Promise.resolve(formatQuery(sortUrl)),
    });
    rerender(sorted);
    const descendingCapsules = await mockCatalogProvider.getCollection(
      "human",
      { line: "human", format: "capsules" },
      "price-desc"
    );
    expect(
      cardNames(screen.getByRole("region", { name: "Shop capsules" }))
    ).toEqual(
      descendingCapsules!.products
        .filter((product) => healthyAging.productSlugs.has(product.slug))
        .map((product) => product.name)
    );
  });

  it("filters and sorts the mounted /pet/dogs catalog from its controls", async () => {
    render(await DogsPage());
    const list = screen.getByRole("region", { name: "Dog Products" });

    fireEvent.click(screen.getByRole("button", { name: /Chews/ }));
    const dogs = await mockCatalogProvider.getProducts({ species: "dog" });
    const chews = dogs.filter((product) =>
      product.format.toLowerCase().includes("chew")
    );
    expect(cardNames(list)).toEqual(chews.map((product) => product.name));

    fireEvent.change(screen.getByRole("combobox", { name: "Sort products" }), {
      target: { value: "price-asc" },
    });
    expect(cardNames(list)).toEqual(
      [...chews]
        .sort((a, b) => a.variants[0].price.amount - b.variants[0].price.amount)
        .map((product) => product.name)
    );
  });
});

describe.each(
  SUPPORTED_MARKETS.filter((market) =>
    ["CA", "EU"].includes(market.countryCode)
  )
)("W3-40 market pricing in $countryCode", (market) => {
  it("shows the product price converted from the catalog contract", async () => {
    marketCookie.value = market.id;
    const product = await catalogProvider.getProduct("biohack");
    expect(product).toBeTruthy();
    const page = await ProductPage({
      params: Promise.resolve({ slug: "biohack" }),
    });
    render(page);
    expect(
      screen.getAllByText(
        expectedMarketPrice(product!.variants[0].price.amount, market),
        { exact: true }
      ).length
    ).toBeGreaterThan(0);
  });

  it("shows a kit price converted from the catalog contract", async () => {
    marketCookie.value = market.id;
    const page = await HumanKitsPage();
    render(page);
    const kits = await catalogProvider.getKits("human");
    const energyDuo = kits.find((kit) => kit.slug === "energy-duo");
    expect(energyDuo).toBeTruthy();
    const card = screen.getByRole("article", { name: "Energy Duo" });
    expect(
      within(card).getByText(
        expectedMarketPrice(energyDuo!.price.amount, market),
        { exact: true }
      )
    ).toBeTruthy();
  });

  it("shows cart line, subtotal and total converted from contract amounts", async () => {
    marketCookie.value = market.id;
    const product = await catalogProvider.getProduct("biohack");
    expect(product).toBeTruthy();
    const variant = product!.variants[0];
    const quantity = 2;
    const total = variant.price.amount * quantity;
    const cart: Cart = {
      id: "cart-market-test",
      lines: [
        {
          id: "line-market-test",
          variantId: variant.id,
          quantity,
          sellingPlanId: null,
          product: {
            id: product!.slug,
            title: product!.name,
            handle: product!.handle,
            image: product!.images[0],
            line: "human",
          },
          price: variant.price,
          total: { amount: total, currencyCode: variant.price.currencyCode },
        },
      ],
      discountCodes: [],
      subtotalPrice: {
        amount: total,
        currencyCode: variant.price.currencyCode,
      },
      totalDiscount: { amount: 0, currencyCode: variant.price.currencyCode },
      totalPrice: { amount: total, currencyCode: variant.price.currencyCode },
      totalQuantity: quantity,
      checkoutUrl: "https://checkout.nadeon.test/mock",
    };
    vi.spyOn(cartProvider, "get").mockResolvedValue(cart);

    const page = await CartPage();
    render(page);
    const expectedUnitPrice = expectedMarketPrice(variant.price.amount, market);
    expect(
      await screen.findByText(expectedUnitPrice, { exact: true })
    ).toBeTruthy();
    const expectedLineTotal = expectedMarketPrice(total, market);
    const summary = screen.getByRole("region", { name: "Order summary" });
    expect(
      within(summary).getAllByText(expectedLineTotal, { exact: true })
    ).toHaveLength(2);
  });
});
