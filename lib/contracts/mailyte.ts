import { z } from "zod";

export const MailyteEventSchema = z.object({
  eventName: z.string(),
  email: z.string().email().nullable().optional(),
  uniqueId: z.string(),
  properties: z.record(z.string(), z.unknown()).optional(),
  timestamp: z.string().optional(),
});
export type MailyteEvent = z.infer<typeof MailyteEventSchema>;

export const MailyteCheckoutStartedInputSchema = z.object({
  checkoutId: z.string(),
  idempotencyKey: z.string().optional(),
  email: z.string().email().nullable().optional(),
  totalPrice: z.string().optional(),
  currency: z.string().optional(),
  lineItemsCount: z.number().optional(),
  abandonedCheckoutUrl: z.string().optional(),
  properties: z.record(z.string(), z.unknown()).optional(),
});
export type MailyteCheckoutStartedInput = z.infer<
  typeof MailyteCheckoutStartedInputSchema
>;
export type CheckoutStartedInput = MailyteCheckoutStartedInput;

export const MailyteOrderCompletedInputSchema = z.object({
  orderId: z.string(),
  idempotencyKey: z.string().optional(),
  orderNumber: z.string().optional(),
  email: z.string().email().nullable().optional(),
  totalPrice: z.string().optional(),
  currency: z.string().optional(),
  lineItemsCount: z.number().optional(),
  properties: z.record(z.string(), z.unknown()).optional(),
});
export type MailyteOrderCompletedInput = z.infer<
  typeof MailyteOrderCompletedInputSchema
>;
export type OrderCompletedInput = MailyteOrderCompletedInput;

export const MailyteContactStatusInputSchema = z.discriminatedUnion("status", [
  z
    .object({
      email: z.string().trim().email(),
      status: z.literal("unsubscribed"),
    })
    .strict(),
  z
    .object({
      email: z.string().trim().email(),
      status: z.literal("subscribed"),
      consentedAt: z.string().datetime({ offset: true }),
      consentSource: z.string().trim().min(1).max(50),
    })
    .strict(),
]);
export type MailyteContactStatusInput = z.infer<
  typeof MailyteContactStatusInputSchema
>;

export const MailyteTrackingResultSchema = z.object({
  success: z.boolean(),
  eventId: z.string(),
  uniqueId: z.string(),
});
export type MailyteTrackingResult = z.infer<typeof MailyteTrackingResultSchema>;

export interface MailyteProvider {
  updateContactStatus(input: MailyteContactStatusInput): Promise<void>;
  trackEvent(event: MailyteEvent): Promise<MailyteTrackingResult>;
  sendCheckoutStarted(
    input: MailyteCheckoutStartedInput
  ): Promise<MailyteTrackingResult>;
  sendOrderCompleted(
    input: MailyteOrderCompletedInput
  ): Promise<MailyteTrackingResult>;
}
