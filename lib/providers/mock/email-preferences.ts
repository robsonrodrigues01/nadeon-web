import {
  type EmailPreferences,
  type EmailPreferencesProvider,
  type EmailUnsubscribeReason,
  type SaveEmailPreferencesInput,
  EmailPreferencesSchema,
  EmailUnsubscribeReasonSchema,
  SaveEmailPreferencesInputSchema,
} from "@/lib/contracts/email-preferences";

export class MockEmailPreferencesProvider implements EmailPreferencesProvider {
  private preferences: EmailPreferences = EmailPreferencesSchema.parse({
    ordersAndShipping: true,
    topics: {
      subscriptionReminders: false,
      humanNews: false,
      petNews: false,
      journal: false,
      offers: false,
    },
    frequency: null,
    unsubscribedAll: false,
  });

  async getPreferences(): Promise<EmailPreferences> {
    return structuredClone(this.preferences);
  }

  async savePreferences(
    input: SaveEmailPreferencesInput
  ): Promise<EmailPreferences> {
    const parsed = SaveEmailPreferencesInputSchema.parse(input);
    this.preferences = EmailPreferencesSchema.parse({
      ...parsed,
      ordersAndShipping: true,
      unsubscribedAll: false,
    });
    return this.getPreferences();
  }

  async unsubscribe(
    reason?: EmailUnsubscribeReason
  ): Promise<EmailPreferences> {
    if (reason !== undefined) EmailUnsubscribeReasonSchema.parse(reason);
    this.preferences = EmailPreferencesSchema.parse({
      ...this.preferences,
      unsubscribedAll: true,
    });
    return this.getPreferences();
  }

  async resubscribe(): Promise<EmailPreferences> {
    this.preferences = EmailPreferencesSchema.parse({
      ...this.preferences,
      unsubscribedAll: false,
    });
    return this.getPreferences();
  }
}

export const mockEmailPreferencesProvider = new MockEmailPreferencesProvider();
