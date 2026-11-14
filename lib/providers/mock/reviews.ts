import {
  type Review,
  type ReviewSummary,
  type ReviewsFilter,
  type ReviewsProvider,
  type SubmitReviewInput,
  ReviewSchema,
  ReviewSummarySchema,
  SubmitReviewInputSchema,
} from "@/lib/contracts/reviews";

const DEV_KIT_SAMPLE_REVIEWS: Review[] = [
  ReviewSchema.parse({
    id: "rev_dev_01",
    productSlug: "biohack",
    rating: 5,
    title: "Remarkable sustained energy and clarity",
    body: "After three weeks on BioHack, my afternoon brain fog is completely gone. Laboratory purity is evident.",
    authorName: "Sarah M.",
    authorEmail: "sarah.m@example.com",
    verifiedBuyer: true,
    helpfulVotes: 14,
    createdAt: "2026-10-15T14:30:00.000Z",
    images: ["/images/reviews/biohack-review-1.webp"],
  }),
  ReviewSchema.parse({
    id: "rev_dev_02",
    productSlug: "biohack",
    rating: 5,
    title: "Best NAD+ formula on the market",
    body: "Clean formulation, no flush, and easy on the stomach. The 60-day subscription is great value.",
    authorName: "David K.",
    authorEmail: "david.k@example.com",
    verifiedBuyer: true,
    helpfulVotes: 8,
    createdAt: "2026-10-22T09:15:00.000Z",
    images: [],
  }),
  ReviewSchema.parse({
    id: "rev_dev_03",
    productSlug: "more-good-years",
    rating: 5,
    title: "My 11-year-old lab is acting like a puppy again",
    body: "Within two weeks Cooper was climbing stairs with ease and eager for our morning walks.",
    authorName: "Alex M.",
    authorEmail: "alex.morgan@example.com",
    verifiedBuyer: true,
    helpfulVotes: 23,
    createdAt: "2026-10-28T16:45:00.000Z",
    images: ["/images/reviews/mgy-review-1.webp"],
  }),
];

const submittedReviews: Review[] = [];

export class MockReviewsProvider implements ReviewsProvider {
  async list(
    filter?: ReviewsFilter
  ): Promise<{ reviews: Review[]; total: number }> {
    // Launch state default is empty list, unless includeDevSamples is requested
    let pool: Review[] = [...submittedReviews];
    if (filter?.includeDevSamples) {
      pool = [...pool, ...DEV_KIT_SAMPLE_REVIEWS];
    }

    if (filter?.productSlug) {
      pool = pool.filter((r) => r.productSlug === filter.productSlug);
    }
    if (filter?.rating) {
      pool = pool.filter((r) => r.rating === filter.rating);
    }
    if (filter?.hasImages) {
      pool = pool.filter((r) => r.images && r.images.length > 0);
    }

    const total = pool.length;
    const offset = filter?.offset ?? 0;
    const limit = filter?.limit ?? 50;
    const paginated = pool.slice(offset, offset + limit);

    return {
      reviews: paginated.map((r) => ({ ...r })),
      total,
    };
  }

  async summary(productSlug: string): Promise<ReviewSummary> {
    const list = submittedReviews.filter((r) => r.productSlug === productSlug);

    const breakdown: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    if (list.length === 0) {
      return ReviewSummarySchema.parse({
        productSlug,
        averageRating: 0,
        totalReviews: 0,
        ratingBreakdown: breakdown,
      });
    }

    let sum = 0;
    for (const r of list) {
      sum += r.rating;
      breakdown[r.rating] = (breakdown[r.rating] || 0) + 1;
    }

    const avg = Number((sum / list.length).toFixed(1));

    return ReviewSummarySchema.parse({
      productSlug,
      averageRating: avg,
      totalReviews: list.length,
      ratingBreakdown: breakdown,
    });
  }

  async submit(payload: SubmitReviewInput): Promise<Review> {
    const validatedInput = SubmitReviewInputSchema.parse(payload);

    const newReview = ReviewSchema.parse({
      id: `rev_${Math.random().toString(36).substring(2, 9)}`,
      productSlug: validatedInput.productSlug,
      rating: validatedInput.rating,
      title: validatedInput.title,
      body: validatedInput.body,
      authorName: validatedInput.authorName,
      authorEmail: validatedInput.authorEmail,
      verifiedBuyer: false,
      helpfulVotes: 0,
      createdAt: new Date().toISOString(),
      images: validatedInput.images || [],
    });

    submittedReviews.unshift(newReview);
    return { ...newReview };
  }
}

export const mockReviewsProvider = new MockReviewsProvider();
