import {
  type MailyteCheckoutStartedInput,
  type MailyteContactStatusInput,
  type MailyteEvent,
  type MailyteOrderCompletedInput,
  type MailyteProvider,
  type MailyteTrackingResult,
  MailyteCheckoutStartedInputSchema,
  MailyteContactStatusInputSchema,
  MailyteEventSchema,
  MailyteOrderCompletedInputSchema,
  MailyteTrackingResultSchema,
} from "@/lib/contracts/mailyte";

export interface RecordedMockEvent {
  eventName: string;
  uniqueId: string;
  eventId: string;
  timestamp: string;
}

export class MockMailyteProvider implements MailyteProvider {
  private recordedEvents: RecordedMockEvent[] = [];

  async updateContactStatus(input: MailyteContactStatusInput): Promise<void> {
    MailyteContactStatusInputSchema.parse(input);
  }

  async trackEvent(event: MailyteEvent): Promise<MailyteTrackingResult> {
    const parsed = MailyteEventSchema.safeParse(event);
    if (!parsed.success) {
      throw new Error("Invalid Mailyte event payload");
    }

    // shortcut: só dentro do processo; trocar por KV ou idempotência do provider na onda 4 real
    const duplicate = this.recordedEvents.find(
      (recorded) =>
        recorded.eventName === parsed.data.eventName &&
        recorded.uniqueId === parsed.data.uniqueId
    );
    if (duplicate) {
      return MailyteTrackingResultSchema.parse({
        success: true,
        eventId: duplicate.eventId,
        uniqueId: duplicate.uniqueId,
      });
    }

    const eventId = `m_evt_${Math.random().toString(36).substring(2, 9)}`;
    const timestamp = parsed.data.timestamp || new Date().toISOString();

    // Store only non-PII metadata for test verification
    this.recordedEvents.push({
      eventName: parsed.data.eventName,
      uniqueId: parsed.data.uniqueId,
      eventId,
      timestamp,
    });

    return MailyteTrackingResultSchema.parse({
      success: true,
      eventId,
      uniqueId: parsed.data.uniqueId,
    });
  }

  async sendCheckoutStarted(
    input: MailyteCheckoutStartedInput
  ): Promise<MailyteTrackingResult> {
    const parsed = MailyteCheckoutStartedInputSchema.safeParse(input);
    if (!parsed.success) {
      throw new Error("Invalid checkout_started payload");
    }

    return this.trackEvent({
      eventName: "checkout_started",
      email: parsed.data.email,
      uniqueId: parsed.data.idempotencyKey ?? parsed.data.checkoutId,
      properties: {
        totalPrice: parsed.data.totalPrice,
        currency: parsed.data.currency,
        lineItemsCount: parsed.data.lineItemsCount,
        ...parsed.data.properties,
      },
    });
  }

  async sendOrderCompleted(
    input: MailyteOrderCompletedInput
  ): Promise<MailyteTrackingResult> {
    const parsed = MailyteOrderCompletedInputSchema.safeParse(input);
    if (!parsed.success) {
      throw new Error("Invalid order_completed payload");
    }

    return this.trackEvent({
      eventName: "order_completed",
      email: parsed.data.email,
      uniqueId: parsed.data.idempotencyKey ?? parsed.data.orderId,
      properties: {
        orderNumber: parsed.data.orderNumber,
        totalPrice: parsed.data.totalPrice,
        currency: parsed.data.currency,
        lineItemsCount: parsed.data.lineItemsCount,
        ...parsed.data.properties,
      },
    });
  }

  getRecordedEvents(): readonly RecordedMockEvent[] {
    return [...this.recordedEvents];
  }

  getLastEvent(): RecordedMockEvent | undefined {
    return this.recordedEvents[this.recordedEvents.length - 1];
  }

  clearRecordedEvents(): void {
    this.recordedEvents = [];
  }
}

export const mockMailyteProvider = new MockMailyteProvider();
