"use server";

import { z } from "zod";
import { accountProvider, reviewsProvider } from "@/lib/providers";

export type ReviewActionState = {
  status: "idle" | "success" | "invalid" | "error";
  message?: string;
};

const ReviewFormSchema = z
  .object({
    orderId: z.string().min(1),
    productSlug: z.string().min(1),
    rating: z.coerce.number().int().min(1).max(5),
    title: z.string().trim().min(1),
    body: z.string().trim().min(1),
    authorName: z.string().trim().min(1),
    ownExperience: z.literal("yes"),
    termsAccepted: z.literal("yes"),
  })
  .strict();

export async function submitReviewAction(
  _previous: ReviewActionState,
  formData: FormData
): Promise<ReviewActionState> {
  const parsed = ReviewFormSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  if (!parsed.success)
    return {
      status: "invalid",
      message: "Check the required fields and try again.",
    };

  try {
    const session = await accountProvider.getSession();
    if (!session)
      return { status: "error", message: "Sign in to submit a review." };
    const owner = await accountProvider.getCustomer();
    if (!owner || owner.id !== session.customerId) {
      return { status: "error", message: "We could not verify this order." };
    }
    const orders = await accountProvider.getOrders();
    const order = orders.find(
      (candidate) => candidate.id === parsed.data.orderId
    );
    if (
      !order ||
      order.email?.toLowerCase() !== owner.email.toLowerCase() ||
      order.financialStatus !== "paid" ||
      order.fulfillmentStatus !== "delivered" ||
      !order.items.some((item) => item.productSlug === parsed.data.productSlug)
    ) {
      return { status: "error", message: "We could not verify this order." };
    }

    await reviewsProvider.submit({
      orderId: order.id,
      productSlug: parsed.data.productSlug,
      rating: parsed.data.rating,
      title: parsed.data.title,
      body: parsed.data.body,
      authorName: parsed.data.authorName,
      authorEmail: owner.email,
      termsAccepted: true,
    });
    return { status: "success", message: "Thanks for your review" };
  } catch {
    return {
      status: "error",
      message: "Your review could not be submitted. Try again.",
    };
  }
}
