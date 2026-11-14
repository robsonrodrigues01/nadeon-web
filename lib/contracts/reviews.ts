import { z } from "zod";

export const ReviewSchema = z.object({
  id: z.string(),
  productSlug: z.string(),
  rating: z.number().int().min(1).max(5),
  title: z.string(),
  body: z.string(),
  authorName: z.string(),
  authorEmail: z.string().email().optional(),
  verifiedBuyer: z.boolean().default(false),
  helpfulVotes: z.number().int().nonnegative().default(0),
  createdAt: z.string(),
  images: z.array(z.string()).default([]),
});
export type Review = z.infer<typeof ReviewSchema>;

export const ReviewsFilterSchema = z.object({
  productSlug: z.string().optional(),
  rating: z.number().int().min(1).max(5).optional(),
  hasImages: z.boolean().optional(),
  limit: z.number().int().positive().optional(),
  offset: z.number().int().nonnegative().optional(),
  includeDevSamples: z.boolean().optional(),
});
export type ReviewsFilter = z.infer<typeof ReviewsFilterSchema>;

export const ReviewSummarySchema = z.object({
  productSlug: z.string(),
  averageRating: z.number().min(0).max(5),
  totalReviews: z.number().int().nonnegative(),
  ratingBreakdown: z.record(z.coerce.number(), z.number().int().nonnegative()),
});
export type ReviewSummary = z.infer<typeof ReviewSummarySchema>;

export const SubmitReviewInputSchema = z.object({
  productSlug: z.string(),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(1),
  body: z.string().min(1),
  authorName: z.string().min(1),
  authorEmail: z.string().email(),
  images: z.array(z.string()).optional(),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "Terms must be accepted",
  }),
});
export type SubmitReviewInput = z.infer<typeof SubmitReviewInputSchema>;

export interface ReviewsProvider {
  list(filter?: ReviewsFilter): Promise<{ reviews: Review[]; total: number }>;
  summary(productSlug: string): Promise<ReviewSummary>;
  submit(payload: SubmitReviewInput): Promise<Review>;
}
