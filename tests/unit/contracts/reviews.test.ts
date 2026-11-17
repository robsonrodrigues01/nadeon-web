import { describe, it, expect } from "vitest";
import { mockReviewsProvider } from "@/lib/providers/mock/reviews";
import { ReviewSchema, ReviewSummarySchema } from "@/lib/contracts/reviews";

describe("ReviewsProvider Contract", () => {
  it("list returns empty array by default for launch state", async () => {
    const result = await mockReviewsProvider.list({ productSlug: "glow" });
    expect(result.reviews).toEqual([]);
    expect(result.total).toBe(0);
  });

  it("list with includeDevSamples returns mock samples for /dev/kit", async () => {
    const result = await mockReviewsProvider.list({
      productSlug: "biohack",
      includeDevSamples: true,
    });
    expect(result.reviews.length).toBeGreaterThan(0);
    for (const rev of result.reviews) {
      expect(() => ReviewSchema.parse(rev)).not.toThrow();
      expect(rev.productSlug).toBe("biohack");
      expect(rev.rating).toBeGreaterThanOrEqual(1);
      expect(rev.rating).toBeLessThanOrEqual(5);
    }
  });

  it("summary returns valid ReviewSummary schema even with zero reviews", async () => {
    const summary = await mockReviewsProvider.summary("unreviewed-product");
    expect(() => ReviewSummarySchema.parse(summary)).not.toThrow();
    expect(summary.totalReviews).toBe(0);
    expect(summary.averageRating).toBe(0);
    expect(summary.ratingBreakdown[5]).toBe(0);
  });

  it("submit creates and validates review", async () => {
    const review = await mockReviewsProvider.submit({
      productSlug: "glow",
      rating: 5,
      title: "Noticeable improvement in skin hydration",
      body: "Love the subtle citrus flavor and how quickly it dissolves.",
      authorName: "Jessica T.",
      authorEmail: "jessica@example.com",
      termsAccepted: true,
    });

    expect(() => ReviewSchema.parse(review)).not.toThrow();
    expect(review.productSlug).toBe("glow");
    expect(review.rating).toBe(5);
    expect(review.authorName).toBe("Jessica T.");

    // Verify summary is updated
    const summaryAfter = await mockReviewsProvider.summary("glow");
    expect(summaryAfter.totalReviews).toBe(1);
    expect(summaryAfter.averageRating).toBe(5);
    expect(summaryAfter.ratingBreakdown[5]).toBe(1);
  });

  it("submit rejects when terms are not accepted", async () => {
    await expect(
      mockReviewsProvider.submit({
        productSlug: "glow",
        rating: 4,
        title: "Good product",
        body: "Works nicely.",
        authorName: "John D.",
        authorEmail: "john@example.com",
        termsAccepted: false as unknown as true,
      })
    ).rejects.toThrow();
  });
});
