// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import OfferPage, {
  generateMetadata,
} from "@/app/(shared)/offers/[oferta]/page";
import type { Offer } from "@/lib/contracts/offers";

vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => undefined }),
}));

// Mock offersProvider to test both unconfirmed fallback and confirmed offer scenarios
const mockGet = vi.fn();
vi.mock("@/lib/providers", async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    offersProvider: {
      list: vi.fn(async () => []),
      get: (id: string) => mockGet(id),
    },
  };
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("W5-04 /offers/[oferta] (Promo collection model)", () => {
  it("renders the promo collection model with unconfirmed fallbacks and semantic catalog controls", async () => {
    mockGet.mockResolvedValueOnce(null);

    const params = Promise.resolve({ oferta: "model" });
    const jsx = await OfferPage({ params });
    render(jsx);

    // Main landmark
    expect(screen.getByRole("main")).toBeTruthy();

    // Breadcrumb
    const breadcrumb = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(breadcrumb).toBeTruthy();
    expect(breadcrumb.querySelector('a[href="/pet"]')).toBeTruthy();

    // Hero title & badge
    expect(screen.getByText("Limited-time offer")).toBeTruthy();
    expect(
      screen.getByRole("heading", { level: 1, name: "Special Offer" })
    ).toBeTruthy();

    // Countdown placeholder
    expect(screen.getByText("DAYS")).toBeTruthy();
    expect(screen.getByText("HRS")).toBeTruthy();
    expect(screen.getByText("MIN")).toBeTruthy();
    expect(screen.getByText("SEC")).toBeTruthy();

    // Code badge
    expect(
      screen.getByText(/Code:\s*To be confirmed\s*or applied automatically/i)
    ).toBeTruthy();

    // Shop the offer link
    const shopOfferLink = screen.getByRole("link", { name: "Shop the offer" });
    expect(shopOfferLink.getAttribute("href")).toBe("#on-offer");

    // How the offer works
    expect(screen.getByText("HOW THE OFFER WORKS")).toBeTruthy();
    expect(screen.getByText("Three easy steps")).toBeTruthy();

    // Kits on offer has one honest placeholder and no fabricated cards.
    const kitsSection = screen.getByRole("region", {
      name: "Kits in the Special Offer",
    });
    expect(
      within(kitsSection).getByText("Kits on offer: To be confirmed.")
    ).toBeTruthy();
    expect(within(kitsSection).queryByRole("list")).toBeNull();
    expect(
      within(kitsSection).queryByRole("button", { name: "Add kit to cart" })
    ).toBeNull();

    // On offer has one honest placeholder and no fabricated product cards.
    const offersSection = screen.getByRole("region", {
      name: "Shop the Special Offer",
    });
    expect(
      within(offersSection).getByText("Products on offer: To be confirmed.")
    ).toBeTruthy();
    expect(within(offersSection).queryByRole("list")).toBeNull();
    expect(
      within(offersSection).queryByRole("button", { name: "Add to cart" })
    ).toBeNull();

    // Bundle builder & Add bundle to cart
    expect(screen.getByText("BUNDLE BUILDER")).toBeTruthy();
    const addBundleBtn = screen.getByRole("button", {
      name: "Add bundle to cart",
    });
    expect((addBundleBtn as HTMLButtonElement).disabled).toBe(true);

    // Full terms disclosure
    expect(screen.getByText("Full terms")).toBeTruthy();

    // Regulatory / FDA statement
    expect(document.body.textContent).toContain(
      "These statements have not been evaluated by the Food and Drug Administration"
    );

    // Placeholders check: no raw design bracket tokens or $XX
    expect(document.body.textContent).not.toMatch(
      /\[Offer name\]|\[CODE\]|\[Dose\]|\[Product name\]|\$XX|\(example\)/i
    );
  });

  it("renders confirmed offer details when available from offersProvider", async () => {
    const confirmedOffer: Offer = {
      id: "spring-2026",
      title: "Spring Longevity Sale",
      description: "Save on your favorite longevity formulas this spring.",
      code: "SPRING25",
      discount: {
        type: "percentage",
        amount: 25,
      },
    };
    mockGet.mockResolvedValueOnce(confirmedOffer);

    const params = Promise.resolve({ oferta: "spring-2026" });
    const jsx = await OfferPage({ params });
    render(jsx);

    expect(
      screen.getByRole("heading", { level: 1, name: "Spring Longevity Sale" })
    ).toBeTruthy();
    expect(screen.getByText("Save 25%")).toBeTruthy();
    expect(
      screen.getByText("Save on your favorite longevity formulas this spring.")
    ).toBeTruthy();
    expect(
      screen.getByText(/Code:\s*SPRING25\s*or applied automatically/i)
    ).toBeTruthy();
  });

  it("generates metadata properly with noIndex for promo collections", async () => {
    mockGet.mockResolvedValueOnce(null);
    const meta = await generateMetadata({
      params: Promise.resolve({ oferta: "model" }),
    });
    expect(meta.title).toContain("Special Offer");
    expect(meta.robots).toEqual({ index: false, follow: false });
  });
});
