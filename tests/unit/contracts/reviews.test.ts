import { describe, it, expect } from "vitest";
import { mockReviewsProvider } from "@/lib/providers/mock/reviews";
import {
  ReviewSchema,
  ReviewSummarySchema,
  StoredReviewSchema,
} from "@/lib/contracts/reviews";

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
      expect(rev.verifiedBuyer).toBe(false);
    }
  });

  it("filters pet reviews and orders results by most recent", async () => {
    const result = await mockReviewsProvider.list({
      includeDevSamples: true,
      petSpecies: "dog",
      sort: "most_recent",
    });

    expect(result.reviews).toHaveLength(1);
    expect(result.reviews[0].productSlug).toBe("more-good-years");
    expect(result.reviews[0].petSpecies).toBe("dog");
  });

  it("summary returns valid ReviewSummary schema even with zero reviews", async () => {
    const summary = await mockReviewsProvider.summary("unreviewed-product");
    expect(() => ReviewSummarySchema.parse(summary)).not.toThrow();
    expect(summary.totalReviews).toBe(0);
    expect(summary.averageRating).toBe(0);
    expect(summary.ratingBreakdown[5]).toBe(0);
  });

  it("stores new reviews as pending and excludes them from public lists and summaries", async () => {
    const review = await mockReviewsProvider.submit({
      orderId: "ord_TEST_0001",
      productSlug: "biohack",
      rating: 5,
      title: "TEST review title",
      body: "TEST review body",
      authorName: "TEST Reviewer",
      authorEmail: "test.alex.morgan@example.com",
      termsAccepted: true,
    });

    expect(() => ReviewSchema.parse(review)).not.toThrow();
    expect(review.productSlug).toBe("biohack");
    expect(review.rating).toBe(5);
    expect(review.authorName).toBe("TEST Reviewer");
    expect(review.verifiedBuyer).toBe(true);
    expect(review.moderationStatus).toBe("pending");
    expect(review).not.toHaveProperty("authorEmail");
    expect(review).not.toHaveProperty("orderId");
    expect(() =>
      StoredReviewSchema.parse({ ...review, orderId: "ord_TEST_0001" })
    ).not.toThrow();
    const publicList = await mockReviewsProvider.list({
      productSlug: "biohack",
    });
    expect(publicList.reviews).toEqual([]);
    expect(publicList.total).toBe(0);

    const summaryAfter = await mockReviewsProvider.summary("biohack");
    expect(summaryAfter.totalReviews).toBe(0);
    expect(summaryAfter.averageRating).toBe(0);
    expect(summaryAfter.ratingBreakdown[5]).toBe(0);
  });

  it("rejects reviews that are not linked to the product in the order", async () => {
    await expect(
      mockReviewsProvider.submit({
        orderId: "ord_TEST_0001",
        productSlug: "more-good-years",
        rating: 4,
        title: "TEST review title",
        body: "TEST review body",
        authorName: "TEST Reviewer",
        authorEmail: "test.alex.morgan@example.com",
        termsAccepted: true,
      })
    ).rejects.toThrow(/order/i);
  });

  it("submit rejects when terms are not accepted", async () => {
    await expect(
      mockReviewsProvider.submit({
        orderId: "ord_TEST_0001",
        productSlug: "biohack",
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
