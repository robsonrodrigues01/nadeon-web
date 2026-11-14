import {
  type Subscription,
  type SubscriptionCapabilities,
  type SubscriptionProvider,
  SubscriptionSchema,
  SubscriptionCapabilitiesSchema,
} from "@/lib/contracts/subscription";

const DEFAULT_CAPABILITIES: SubscriptionCapabilities =
  SubscriptionCapabilitiesSchema.parse({
    canSkip: true,
    canReschedule: true,
    canChangeFrequency: true,
    canSwapProduct: true,
    canChangeQuantity: true,
    canPause: true,
    canResume: true,
    canCancel: true,
    allowedIntervalDays: [30, 60, 90, 120, 180],
    cancelReasons: [
      "Too expensive / looking to save money",
      "Have too much surplus product",
      "Experiencing adverse reactions / pet did not like it",
      "Want to switch to a different formula",
      "Temporarily pausing my health routine",
      "Other reason",
    ],
  });

const mockSubscriptions: Subscription[] = [
  SubscriptionSchema.parse({
    id: "sub_biohack_001",
    status: "active",
    nextBillingDate: new Date(Date.now() + 86400 * 1000 * 18).toISOString(),
    intervalDays: 30,
    lines: [
      {
        id: "sub_line_biohack",
        variantId: "var_biohack_1",
        productTitle: "BioHack - 1 Jar",
        quantity: 1,
        price: { amount: 55.25, currencyCode: "USD" },
        image: "/images/products/biohack-front.webp",
      },
    ],
    estimatedTotal: { amount: 55.25, currencyCode: "USD" },
    deliveryAddress: {
      id: "addr_alex_primary",
      firstName: "Alex",
      lastName: "Morgan",
      address1: "742 Evergreen Terrace",
      city: "Austin",
      province: "TX",
      zip: "78701",
      country: "US",
      isDefault: true,
    },
    createdAt: new Date(Date.now() - 86400 * 1000 * 42).toISOString(),
  }),
  SubscriptionSchema.parse({
    id: "sub_mgy_002",
    status: "active",
    nextBillingDate: new Date(Date.now() + 86400 * 1000 * 25).toISOString(),
    intervalDays: 60,
    lines: [
      {
        id: "sub_line_mgy",
        variantId: "var_mgy_2",
        productTitle: "More Good Years - 2 Jars",
        quantity: 1,
        price: { amount: 68, currencyCode: "USD" },
        image: "/images/products/more-good-years-front.webp",
      },
    ],
    estimatedTotal: { amount: 68, currencyCode: "USD" },
    deliveryAddress: {
      id: "addr_alex_primary",
      firstName: "Alex",
      lastName: "Morgan",
      address1: "742 Evergreen Terrace",
      city: "Austin",
      province: "TX",
      zip: "78701",
      country: "US",
      isDefault: true,
    },
    createdAt: new Date(Date.now() - 86400 * 1000 * 35).toISOString(),
  }),
  // A cancelled subscription to test edge cases
  SubscriptionSchema.parse({
    id: "sub_cancelled_003",
    status: "cancelled",
    nextBillingDate: new Date(Date.now() - 86400 * 1000 * 10).toISOString(),
    intervalDays: 30,
    lines: [
      {
        id: "sub_line_powerhouse",
        variantId: "var_powerhouse_1",
        productTitle: "Powerhouse - 1 Bottle",
        quantity: 1,
        price: { amount: 38.25, currencyCode: "USD" },
        image: "/images/products/powerhouse-front.webp",
      },
    ],
    estimatedTotal: { amount: 38.25, currencyCode: "USD" },
    cancellationReason: "Have too much surplus product",
    createdAt: new Date(Date.now() - 86400 * 1000 * 90).toISOString(),
  }),
];

export class MockSubscriptionProvider implements SubscriptionProvider {
  async list(): Promise<Subscription[]> {
    return mockSubscriptions.map((s) => ({ ...s }));
  }

  async get(id: string): Promise<Subscription | null> {
    const found = mockSubscriptions.find((s) => s.id === id);
    return found ? { ...found } : null;
  }

  async capabilities(): Promise<SubscriptionCapabilities> {
    return { ...DEFAULT_CAPABILITIES };
  }

  private findAndAssertActive(id: string, actionName: string): Subscription {
    const sub = mockSubscriptions.find((s) => s.id === id);
    if (!sub) {
      throw new Error(`Subscription not found: ${id}`);
    }
    if (sub.status === "cancelled") {
      throw new Error(
        `Disallowed action: cannot ${actionName} on a cancelled subscription (${id})`
      );
    }
    return sub;
  }

  async skip(id: string): Promise<Subscription> {
    const sub = this.findAndAssertActive(id, "skip");
    if (sub.status === "paused") {
      throw new Error(
        `Disallowed action: cannot skip a paused subscription (${id})`
      );
    }

    const currentNext = new Date(sub.nextBillingDate);
    const newNext = new Date(
      currentNext.getTime() + sub.intervalDays * 24 * 60 * 60 * 1000
    );
    sub.nextBillingDate = newNext.toISOString();
    return SubscriptionSchema.parse({ ...sub });
  }

  async reschedule(id: string, nextBillingDate: string): Promise<Subscription> {
    const sub = this.findAndAssertActive(id, "reschedule");
    const parsedDate = new Date(nextBillingDate);
    if (isNaN(parsedDate.getTime())) {
      throw new Error(`Invalid date format for reschedule: ${nextBillingDate}`);
    }
    sub.nextBillingDate = parsedDate.toISOString();
    return SubscriptionSchema.parse({ ...sub });
  }

  async changeFrequency(
    id: string,
    intervalDays: number
  ): Promise<Subscription> {
    const sub = this.findAndAssertActive(id, "change frequency");
    if (!DEFAULT_CAPABILITIES.allowedIntervalDays.includes(intervalDays)) {
      throw new Error(
        `Disallowed interval: ${intervalDays} days is not permitted. Allowed: ${DEFAULT_CAPABILITIES.allowedIntervalDays.join(", ")}`
      );
    }
    sub.intervalDays = intervalDays;
    return SubscriptionSchema.parse({ ...sub });
  }

  async swapProduct(
    id: string,
    lineId: string,
    newVariantId: string
  ): Promise<Subscription> {
    const sub = this.findAndAssertActive(id, "swap product");
    const line = sub.lines.find((l) => l.id === lineId);
    if (!line) {
      throw new Error(`Line item not found: ${lineId}`);
    }
    line.variantId = newVariantId;
    line.productTitle = `Updated Product (${newVariantId})`;
    return SubscriptionSchema.parse({ ...sub });
  }

  async changeQuantity(
    id: string,
    lineId: string,
    quantity: number
  ): Promise<Subscription> {
    const sub = this.findAndAssertActive(id, "change quantity");
    if (quantity <= 0) {
      throw new Error(`Quantity must be greater than zero`);
    }
    const line = sub.lines.find((l) => l.id === lineId);
    if (!line) {
      throw new Error(`Line item not found: ${lineId}`);
    }
    line.quantity = quantity;
    const unitPrice = line.price.amount;
    sub.estimatedTotal = {
      amount: Number((unitPrice * quantity).toFixed(2)),
      currencyCode: line.price.currencyCode,
    };
    return SubscriptionSchema.parse({ ...sub });
  }

  async pause(id: string): Promise<Subscription> {
    const sub = this.findAndAssertActive(id, "pause");
    if (sub.status === "paused") {
      throw new Error(`Subscription ${id} is already paused`);
    }
    sub.status = "paused";
    sub.pausedAt = new Date().toISOString();
    return SubscriptionSchema.parse({ ...sub });
  }

  async resume(id: string): Promise<Subscription> {
    const sub = mockSubscriptions.find((s) => s.id === id);
    if (!sub) {
      throw new Error(`Subscription not found: ${id}`);
    }
    if (sub.status === "cancelled") {
      throw new Error(
        `Disallowed action: cannot resume a cancelled subscription (${id})`
      );
    }
    if (sub.status === "active") {
      throw new Error(`Subscription ${id} is already active`);
    }
    sub.status = "active";
    sub.pausedAt = undefined;
    return SubscriptionSchema.parse({ ...sub });
  }

  async cancel(
    id: string,
    reason: string,
    feedback?: string
  ): Promise<Subscription> {
    const sub = mockSubscriptions.find((s) => s.id === id);
    if (!sub) {
      throw new Error(`Subscription not found: ${id}`);
    }
    if (sub.status === "cancelled") {
      throw new Error(`Subscription ${id} is already cancelled`);
    }
    sub.status = "cancelled";
    sub.cancellationReason = reason;
    sub.cancellationFeedback = feedback;
    return SubscriptionSchema.parse({ ...sub });
  }
}

export const mockSubscriptionProvider = new MockSubscriptionProvider();
