import { z } from "zod";

export const EmailFrequencySchema = z.enum([
  "every_email",
  "weekly_digest",
  "monthly_digest",
]);
export type EmailFrequency = z.infer<typeof EmailFrequencySchema>;

export const EmailTopicsSchema = z.object({
  subscriptionReminders: z.boolean(),
  humanNews: z.boolean(),
  petNews: z.boolean(),
  journal: z.boolean(),
  offers: z.boolean(),
});

export const EmailPreferencesSchema = z.object({
  ordersAndShipping: z.literal(true),
  topics: EmailTopicsSchema,
  frequency: EmailFrequencySchema.nullable(),
  unsubscribedAll: z.boolean(),
});
export type EmailPreferences = z.infer<typeof EmailPreferencesSchema>;

export const SaveEmailPreferencesInputSchema = z.object({
  topics: EmailTopicsSchema,
  frequency: EmailFrequencySchema.nullable(),
});
export type SaveEmailPreferencesInput = z.infer<
  typeof SaveEmailPreferencesInputSchema
>;

export const EmailUnsubscribeReasonSchema = z.enum([
  "too_many_emails",
  "not_relevant",
  "other",
]);
export type EmailUnsubscribeReason = z.infer<
  typeof EmailUnsubscribeReasonSchema
>;

export interface EmailPreferencesProvider {
  getPreferences(): Promise<EmailPreferences>;
  savePreferences(input: SaveEmailPreferencesInput): Promise<EmailPreferences>;
  unsubscribe(reason?: EmailUnsubscribeReason): Promise<EmailPreferences>;
  resubscribe(): Promise<EmailPreferences>;
}
