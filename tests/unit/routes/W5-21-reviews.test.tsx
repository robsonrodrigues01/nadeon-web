// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import ReviewsPage from "@/app/(shared)/reviews/page";
import { catalogProvider, reviewsProvider } from "@/lib/providers";
import type { Review } from "@/lib/contracts/reviews";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("W5-21 reviews route", () => {
  it("renders the no-review state and semantic review filters without sample reviews", async () => {
    render(await ReviewsPage({ searchParams: Promise.resolve({}) }));

    expect(
      screen.getByRole("heading", { level: 1, name: "From the pack" })
    ).toBeTruthy();
    expect(
      screen.getByText(
        "No reviews yet. Reviews open after the first orders ship."
      )
    ).toBeTruthy();
    expect(screen.getByLabelText("Filter by product")).toBeTruthy();
    expect(screen.getByLabelText("Rating")).toBeTruthy();
    expect(screen.getByLabelText("Pet")).toBeTruthy();
    expect(screen.getByRole("checkbox", { name: "With photos" })).toBeTruthy();
    expect(screen.getByLabelText("Sort")).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Load more reviews" })
    ).toHaveProperty("disabled", true);
    expect(screen.queryByText(/Remarkable sustained energy/)).toBeNull();

    const requestSubmit = vi
      .spyOn(HTMLFormElement.prototype, "requestSubmit")
      .mockImplementation(() => {});
    fireEvent.change(screen.getByLabelText("Rating"), {
      target: { value: "4" },
    });
    expect(requestSubmit).toHaveBeenCalled();
  });

  it("passes selected catalog filters to the registry and renders only provider reviews", async () => {
    const products = await catalogProvider.getProducts({ line: "pet" });
    const product = products[0];
    if (!product) throw new Error("Expected at least one catalog Pet product.");

    const providerReview: Review = {
      id: "rev_TEST_01",
      productSlug: product.slug,
      rating: 4,
      title: "TEST review title",
      body: "TEST review body",
      authorName: "TEST Reviewer",
      petSpecies: "cat",
      verifiedBuyer: true,
      helpfulVotes: 0,
      createdAt: "2026-10-15T14:30:00.000Z",
      images: ["/renders/placeholder.svg"],
    };
    const unverifiedReview: Review = {
      ...providerReview,
      id: "rev_TEST_unverified",
      title: "TEST unverified title",
      verifiedBuyer: false,
    };
    vi.spyOn(reviewsProvider, "list").mockResolvedValue({
      reviews: [providerReview, unverifiedReview],
      total: 2,
    });
    vi.spyOn(reviewsProvider, "summary").mockImplementation(async (slug) => ({
      productSlug: slug,
      averageRating: slug === product.slug ? 4 : 0,
      totalReviews: slug === product.slug ? 1 : 0,
      ratingBreakdown: {
        1: 0,
        2: 0,
        3: 0,
        4: slug === product.slug ? 1 : 0,
        5: 0,
      },
    }));

    render(
      await ReviewsPage({
        searchParams: Promise.resolve({
          product: product.slug,
          rating: "4",
          pet: "cat",
          photos: "true",
          offset: "0",
        }),
      })
    );

    expect(reviewsProvider.list).toHaveBeenCalledWith({
      productSlug: product.slug,
      rating: 4,
      petSpecies: "cat",
      hasImages: true,
      sort: "most_recent",
      limit: 6,
      offset: 0,
    });
    expect(screen.getByText("TEST review title")).toBeTruthy();
    expect(screen.getByText("TEST review body")).toBeTruthy();
    expect(screen.getByText("TEST R.")).toBeTruthy();
    expect(screen.queryByText("TEST Reviewer")).toBeNull();
    expect(screen.queryByText("TEST unverified title")).toBeNull();
    expect(screen.getByRole("img", { name: "Review photo" })).toBeTruthy();
    expect(screen.getByRole("link", { name: product.name })).toHaveProperty(
      "href",
      expect.stringContaining(`/pet/products/${product.slug}`)
    );
  });

  it("enables Load more reviews only when another provider page exists", async () => {
    const product = (await catalogProvider.getProducts({ line: "pet" }))[0];
    if (!product) throw new Error("Expected at least one catalog Pet product.");
    vi.spyOn(reviewsProvider, "list").mockResolvedValue({
      reviews: Array.from({ length: 6 }, (_, index) => ({
        id: `rev_TEST_${index}`,
        productSlug: product.slug,
        rating: 5,
        title: `TEST review ${index}`,
        body: "TEST review body",
        authorName: "TEST Reviewer",
        petSpecies: "dog" as const,
        verifiedBuyer: true,
        helpfulVotes: 0,
        createdAt: "2026-10-15T14:30:00.000Z",
        images: [],
      })),
      total: 7,
    });
    vi.spyOn(reviewsProvider, "summary").mockImplementation(async (slug) => ({
      productSlug: slug,
      averageRating: slug === product.slug ? 5 : 0,
      totalReviews: slug === product.slug ? 7 : 0,
      ratingBreakdown: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: slug === product.slug ? 7 : 0,
      },
    }));

    render(await ReviewsPage({ searchParams: Promise.resolve({}) }));

    const button = screen.getByRole("button", { name: "Load more reviews" });
    expect(button).toHaveProperty("disabled", false);
    expect(within(button.closest("form")!).getByDisplayValue("6")).toBeTruthy();
  });
});
