// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
  within,
} from "@testing-library/react";

import PetProductDetailPage, {
  generateMetadata,
  generateStaticParams,
} from "@/app/(pet)/pet/products/[slug]/page";
import { cartProvider } from "@/lib/providers/client";
import { catalogProvider, reviewsProvider } from "@/lib/providers";
import { DEFAULT_MARKET } from "@/lib/market/markets";
import { PetPurchaseCard } from "@/app/(pet)/pet/products/[slug]/_components/pet-purchase-card";

// Mock next/navigation notFound
const mockNotFound = vi.fn();
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => undefined }),
}));

vi.mock("next/navigation", () => ({
  notFound: () => {
    mockNotFound();
    throw new Error("NEXT_NOT_FOUND");
  },
}));

describe("Route W2-12: /pet/products/[slug]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("generateStaticParams returns all pet product slugs", async () => {
    const params = await generateStaticParams();
    expect(params.length).toBeGreaterThanOrEqual(10);
    const slugs = params.map((p) => p.slug);
    expect(slugs).toContain("more-good-years");
    expect(slugs).toContain("golden-years");
    expect(slugs).toContain("high-jump");
    expect(slugs).toContain("long-stride");
  });

  it("generateMetadata generates rich SEO metadata for More Good Years", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "more-good-years" }),
    });

    expect(meta.title).toContain("More Good Years");
    expect(meta.title).toContain("Nadeon");
    expect(meta.alternates?.canonical).toContain(
      "/pet/products/more-good-years"
    );
    expect(meta.openGraph?.title).toContain("More Good Years");
  });

  it("calls notFound when product slug does not exist or belongs to human line", async () => {
    await expect(
      PetProductDetailPage({
        params: Promise.resolve({ slug: "nonexistent-product" }),
      })
    ).rejects.toThrow("NEXT_NOT_FOUND");
    expect(mockNotFound).toHaveBeenCalled();

    // Human product in pet route should trigger notFound
    await expect(
      PetProductDetailPage({
        params: Promise.resolve({ slug: "biohack" }),
      })
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("renders page header, breadcrumbs, and structured data scripts", async () => {
    const pageJsx = await PetProductDetailPage({
      params: Promise.resolve({ slug: "more-good-years" }),
    });
    const { container } = render(pageJsx);

    // Breadcrumbs
    const breadcrumbNav = screen.getByRole("navigation", {
      name: /breadcrumb/i,
    });
    expect(breadcrumbNav).toBeTruthy();
    expect(
      within(breadcrumbNav).getByRole("link", { name: /^pet$/i })
    ).toBeTruthy();
    expect(
      within(breadcrumbNav).getByRole("link", { name: /^dogs$/i })
    ).toBeTruthy();

    // JSON-LD scripts
    const productScript = container.querySelector("#product-jsonld");
    expect(productScript).toBeTruthy();
    const productJson = JSON.parse(productScript?.textContent || "{}");
    expect(productJson["@type"]).toBe("Product");
    expect(productJson.name).toBe("More Good Years");

    const breadcrumbScript = container.querySelector("#breadcrumb-jsonld");
    expect(breadcrumbScript).toBeTruthy();
    const breadcrumbJson = JSON.parse(breadcrumbScript?.textContent || "{}");
    expect(breadcrumbJson["@type"]).toBe("BreadcrumbList");

    const faqScript = container.querySelector("#faq-jsonld");
    expect(faqScript).toBeTruthy();
    const faqJson = JSON.parse(faqScript?.textContent || "{}");
    expect(faqJson["@type"]).toBe("FAQPage");
  });

  it("renders gallery with all 8 thumbnails and allows switching slides", async () => {
    const pageJsx = await PetProductDetailPage({
      params: Promise.resolve({ slug: "more-good-years" }),
    });
    render(pageJsx);

    // Badges
    expect(screen.getByText("FOR DOGS")).toBeTruthy();
    expect(screen.getByText("1 / 8")).toBeTruthy();

    // Semantic buttons in gallery
    const jarBtn = screen.getByRole("button", { name: /view jar/i });
    const chewBtn = screen.getByRole("button", { name: /view the chew/i });
    const labelBtn = screen.getByRole("button", { name: /view label/i });
    const doseBtn = screen.getByRole("button", {
      name: /view dose by weight/i,
    });
    const suppBtn = screen.getByRole("button", {
      name: /view supplement facts/i,
    });
    const photoBtn = screen.getByRole("button", { name: /view dog photo/i });
    const labBtn = screen.getByRole("button", { name: /view lab report/i });
    const videoBtn = screen.getByRole("button", { name: /view ▶ video/i });

    expect(jarBtn).toBeTruthy();
    expect(chewBtn).toBeTruthy();
    expect(labelBtn).toBeTruthy();
    expect(doseBtn).toBeTruthy();
    expect(suppBtn).toBeTruthy();
    expect(photoBtn).toBeTruthy();
    expect(labBtn).toBeTruthy();
    expect(videoBtn).toBeTruthy();

    // Click on video
    fireEvent.click(videoBtn);
    expect(screen.getByText("8 / 8")).toBeTruthy();

    // Click on label
    fireEvent.click(labelBtn);
    expect(screen.getByText("3 / 8")).toBeTruthy();
  });

  it("renders pet purchase card with weight selector, plans, and Add to cart button", async () => {
    const addLinesSpy = vi.spyOn(cartProvider, "addLines").mockResolvedValue({
      id: "cart_mock",
      lines: [],
      discountCodes: [],
      subtotalPrice: { amount: 74.8, currencyCode: "USD" },
      totalDiscount: { amount: 13.2, currencyCode: "USD" },
      totalPrice: { amount: 74.8, currencyCode: "USD" },
      totalQuantity: 1,
      checkoutUrl: "https://mock.checkout",
    });

    // Card rendered on its own: the full page is covered by the other tests
    const product = await catalogProvider.getProduct("more-good-years");
    const reviewSummary = await reviewsProvider.summary("more-good-years");
    render(
      <PetPurchaseCard
        product={product!}
        reviewSummary={reviewSummary}
        market={DEFAULT_MARKET}
      />
    );

    // Title and badges
    expect(
      screen.getByRole("heading", { level: 1, name: /more good years/i })
    ).toBeTruthy();
    expect(screen.getAllByText(/soft chews/i).length).toBeGreaterThanOrEqual(1);

    // Weight selector radio options
    const weightGroup = screen.getByRole("radiogroup", {
      name: /your dog weighs/i,
    });
    const weightUnder20 = within(weightGroup).getByRole("radio", {
      name: /up to 20 lbs/i,
    });
    const weight21to50 = within(weightGroup).getByRole("radio", {
      name: /21 to 50 lbs/i,
    });
    const weight51to90 = within(weightGroup).getByRole("radio", {
      name: /51 to 90 lbs/i,
    });
    const weightOver90 = within(weightGroup).getByRole("radio", {
      name: /over 90 lbs/i,
    });

    expect(weightUnder20).toBeTruthy();
    expect(weight21to50).toBeTruthy();
    expect(weight51to90).toBeTruthy();
    expect(weightOver90).toBeTruthy();

    // Default weight is 21 to 50 lbs -> dose is 2 chews a day -> recommended plan is 2 jars every 60 days
    expect(
      screen.getByText(/2 chews daily · we picked the plan that matches/i)
    ).toBeTruthy();

    // Switching weight updates helper text
    fireEvent.click(weightUnder20);
    expect(
      screen.getByText(/1 chew daily · we picked the plan that matches/i)
    ).toBeTruthy();

    fireEvent.click(weight51to90);
    expect(
      screen.getByText(/3 chews daily · we picked the plan that matches/i)
    ).toBeTruthy();

    // Purchase mode radios
    const subRadio = screen.getByRole("radio", {
      name: /subscribe & save 15%/i,
    });
    const oneTimeRadio = screen.getByRole("radio", {
      name: /one-time purchase/i,
    });

    expect(subRadio).toBeTruthy();
    expect(oneTimeRadio).toBeTruthy();
    expect((subRadio as HTMLInputElement).checked).toBe(true);

    // Delivery plan radios
    const plan30Radio = screen.getByRole("radio", {
      name: /1 jar every 30 days/i,
    });
    const plan60Radio = screen.getByRole("radio", {
      name: /2 jars every 60 days/i,
    });
    const plan90Radio = screen.getByRole("radio", {
      name: /3 jars every 90 days/i,
    });

    expect(plan30Radio).toBeTruthy();
    expect(plan60Radio).toBeTruthy();
    expect(plan90Radio).toBeTruthy();

    // Primary action button Add to cart
    const addToCartBtn = screen.getByRole("button", {
      name: /add to cart · \$/i,
    });
    expect(addToCartBtn).toBeTruthy();

    fireEvent.click(addToCartBtn);
    await waitFor(() => {
      expect(addLinesSpy).toHaveBeenCalledWith([
        expect.objectContaining({
          variantId: "var_more_good_years_3",
          quantity: 1,
          sellingPlanId: "plan_more_good_years_90d",
        }),
      ]);
    });

    // Switch to One-time purchase
    fireEvent.click(oneTimeRadio);
    expect((oneTimeRadio as HTMLInputElement).checked).toBe(true);

    // Jar options
    const jar1Radio = screen.getByRole("radio", { name: /1 jar/i });
    const jar2Radio = screen.getByRole("radio", { name: /2 jars/i });
    const jar3Radio = screen.getByRole("radio", { name: /3 jars/i });

    expect(jar1Radio).toBeTruthy();
    expect(jar2Radio).toBeTruthy();
    expect(jar3Radio).toBeTruthy();

    fireEvent.click(jar1Radio);
    const updatedAddToCartBtn = screen.getByRole("button", {
      name: /add to cart · \$44\.00/i,
    });
    fireEvent.click(updatedAddToCartBtn);

    await waitFor(() => {
      expect(addLinesSpy).toHaveBeenCalledWith([
        expect.objectContaining({
          variantId: "var_more_good_years_1",
          quantity: 1,
          sellingPlanId: null,
        }),
      ]);
    });
  }, 15000);

  it("renders inside section, science, audience, comparison, and vet sections", async () => {
    const pageJsx = await PetProductDetailPage({
      params: Promise.resolve({ slug: "more-good-years" }),
    });
    render(pageJsx);

    // Inside / Supplement facts section
    expect(
      screen.getByRole("heading", { name: /dose, actives, analysis/i })
    ).toBeTruthy();
    expect(screen.getByText(/active ingredients per chew/i)).toBeTruthy();
    expect(
      screen.getAllByText(/for animal use only/i).length
    ).toBeGreaterThanOrEqual(1);

    // Science section
    expect(
      screen.getByRole("heading", {
        name: /the science behind more good years/i,
      })
    ).toBeTruthy();
    // Science cards come from product.actives (name and amount)
    expect(screen.getAllByText("NMN").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("75 mg").length).toBeGreaterThanOrEqual(1);

    // What to expect section
    expect(
      screen.getByRole("heading", { name: /what to expect/i })
    ).toBeTruthy();
    const readScienceLink = screen.getByRole("link", {
      name: /read the science/i,
    });
    expect(readScienceLink).toBeTruthy();

    // Compare section is left out: no real competitor data (see DONE)
    expect(
      screen.queryByRole("heading", { name: /similar formulas/i })
    ).toBeNull();

    // Vet section
    expect(
      screen.getByRole("heading", { name: /formulated with a veterinarian/i })
    ).toBeTruthy();
  });

  it("renders Featured kits with Add the kit buttons", async () => {
    const addKitSpy = vi.spyOn(cartProvider, "addKit").mockResolvedValue({
      id: "cart_mock",
      lines: [],
      discountCodes: [],
      subtotalPrice: { amount: 75, currencyCode: "USD" },
      totalDiscount: { amount: 13, currencyCode: "USD" },
      totalPrice: { amount: 75, currencyCode: "USD" },
      totalQuantity: 2,
      checkoutUrl: "https://mock.checkout",
    });

    const pageJsx = await PetProductDetailPage({
      params: Promise.resolve({ slug: "more-good-years" }),
    });
    render(pageJsx);

    expect(
      screen.getByRole("heading", { name: /better together/i })
    ).toBeTruthy();

    const addKitBtns = screen.getAllByRole("button", { name: /add the kit/i });
    expect(addKitBtns.length).toBeGreaterThanOrEqual(1);

    fireEvent.click(addKitBtns[0]);
    await waitFor(() => {
      expect(addKitSpy).toHaveBeenCalled();
    });
  });

  it("renders reviews empty state without a write button at launch", async () => {
    const pageJsx = await PetProductDetailPage({
      params: Promise.resolve({ slug: "more-good-years" }),
    });
    render(pageJsx);

    expect(
      screen.getByRole("heading", { name: /pet parent reviews/i })
    ).toBeTruthy();
    expect(
      screen.getAllByText(/no reviews yet/i).length
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/verified reviews go here/i)).toBeTruthy();
    expect(
      screen.queryByRole("button", { name: /write a review/i })
    ).toBeNull();
  });

  it("renders lab report search with disabled input, disabled button, and first lots publishing soon note", async () => {
    const pageJsx = await PetProductDetailPage({
      params: Promise.resolve({ slug: "more-good-years" }),
    });
    render(pageJsx);

    expect(screen.getByRole("heading", { name: "Lab report" })).toBeTruthy();

    const searchInput = screen.getByLabelText(/lot number/i);
    expect(searchInput).toBeTruthy();
    expect((searchInput as HTMLInputElement).disabled).toBe(true);

    const searchBtn = screen.getByRole("button", { name: /^search$/i });
    expect(searchBtn).toBeTruthy();
    expect((searchBtn as HTMLButtonElement).disabled).toBe(true);

    expect(
      screen.getAllByText(/first lots publishing soon/i).length
    ).toBeGreaterThanOrEqual(1);
  });

  it("renders FAQ accordion and links", async () => {
    const pageJsx = await PetProductDetailPage({
      params: Promise.resolve({ slug: "more-good-years" }),
    });
    render(pageJsx);

    expect(
      screen.getByRole("heading", { name: /more good years faq/i })
    ).toBeTruthy();
    expect(screen.getByRole("link", { name: /all faqs/i })).toBeTruthy();
    expect(
      screen.getByText(/how many chews a day for my dog's weight\?/i)
    ).toBeTruthy();
    expect(screen.getByText(/can i combine chews and oils\?/i)).toBeTruthy();
  });
});
