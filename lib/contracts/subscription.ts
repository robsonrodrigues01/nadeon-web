import { z } from "zod";
import { MoneySchema } from "./catalog";
import { AddressSchema } from "./account";

export const SubscriptionStatusSchema = z.enum([
  "active",
  "paused",
  "cancelled",
]);
export type SubscriptionStatus = z.infer<typeof SubscriptionStatusSchema>;

export const SubscriptionLineItemSchema = z.object({
  id: z.string(),
  variantId: z.string(),
  productTitle: z.string(),
  quantity: z.number().int().positive(),
  price: MoneySchema,
  image: z.string().optional(),
});
export type SubscriptionLineItem = z.infer<typeof SubscriptionLineItemSchema>;

export const SubscriptionSchema = z.object({
  id: z.string(),
  status: SubscriptionStatusSchema,
  nextBillingDate: z.string(),
  intervalDays: z.number().int().positive(),
  lines: z.array(SubscriptionLineItemSchema),
  estimatedTotal: MoneySchema,
  deliveryAddress: AddressSchema.optional(),
  cancellationReason: z.string().optional(),
  cancellationFeedback: z.string().optional(),
  pausedAt: z.string().optional(),
  createdAt: z.string(),
});
export type Subscription = z.infer<typeof SubscriptionSchema>;

export const SubscriptionCapabilitiesSchema = z.object({
  canSkip: z.boolean(),
  canReschedule: z.boolean(),
  canChangeFrequency: z.boolean(),
  canSwapProduct: z.boolean(),
  canChangeQuantity: z.boolean(),
  canPause: z.boolean(),
  canResume: z.boolean(),
  canCancel: z.boolean(),
  allowedIntervalDays: z.array(z.number().int().positive()),
  cancelReasons: z.array(z.string()),
});
export type SubscriptionCapabilities = z.infer<
  typeof SubscriptionCapabilitiesSchema
>;

export interface SubscriptionProvider {
  list(): Promise<Subscription[]>;
  get(id: string): Promise<Subscription | null>;
  capabilities(): Promise<SubscriptionCapabilities>;
  skip(id: string): Promise<Subscription>;
  reschedule(id: string, nextBillingDate: string): Promise<Subscription>;
  changeFrequency(id: string, intervalDays: number): Promise<Subscription>;
  swapProduct(
    id: string,
    lineId: string,
    newVariantId: string
  ): Promise<Subscription>;
  changeQuantity(
    id: string,
    lineId: string,
    quantity: number
  ): Promise<Subscription>;
  pause(id: string): Promise<Subscription>;
  resume(id: string): Promise<Subscription>;
  cancel(id: string, reason: string, feedback?: string): Promise<Subscription>;
}
