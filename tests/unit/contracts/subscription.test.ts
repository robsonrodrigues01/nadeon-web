import { describe, it, expect } from "vitest";
import { mockSubscriptionProvider } from "@/lib/providers/mock/subscription";
import {
  SubscriptionSchema,
  SubscriptionCapabilitiesSchema,
} from "@/lib/contracts/subscription";

describe("SubscriptionProvider Contract", () => {
  it("list returns subscriptions satisfying SubscriptionSchema", async () => {
    const subs = await mockSubscriptionProvider.list();
    expect(subs.length).toBeGreaterThan(0);

    for (const sub of subs) {
      expect(() => SubscriptionSchema.parse(sub)).not.toThrow();
      expect(sub.lines.length).toBeGreaterThan(0);
      expect(sub.estimatedTotal).toHaveProperty("amount");
      expect(sub.estimatedTotal).toHaveProperty("currencyCode");
    }

    const hasBiohack = subs.some((s) => s.id === "sub_biohack_001");
    const hasMgy = subs.some((s) => s.id === "sub_mgy_002");
    expect(hasBiohack).toBe(true);
    expect(hasMgy).toBe(true);
  });

  it("capabilities returns schema-valid capabilities", async () => {
    const cap = await mockSubscriptionProvider.capabilities();
    expect(() => SubscriptionCapabilitiesSchema.parse(cap)).not.toThrow();
    expect(cap.canSkip).toBe(true);
    expect(cap.canCancel).toBe(true);
    expect(cap.allowedIntervalDays).toContain(30);
    expect(cap.allowedIntervalDays).toContain(60);
    expect(cap.cancelReasons.length).toBeGreaterThan(0);
  });

  it("skip advances nextBillingDate for active subscription", async () => {
    const initial = await mockSubscriptionProvider.get("sub_biohack_001");
    expect(initial).not.toBeNull();
    const prevDate = new Date(initial!.nextBillingDate).getTime();

    const skipped = await mockSubscriptionProvider.skip("sub_biohack_001");
    expect(() => SubscriptionSchema.parse(skipped)).not.toThrow();
    const newDate = new Date(skipped.nextBillingDate).getTime();
    expect(newDate).toBeGreaterThan(prevDate);
  });

  it("reschedule updates nextBillingDate", async () => {
    const futureDate = "2027-01-15T00:00:00.000Z";
    const updated = await mockSubscriptionProvider.reschedule(
      "sub_biohack_001",
      futureDate
    );
    expect(updated.nextBillingDate).toBe(new Date(futureDate).toISOString());
  });

  it("changeFrequency validates interval against capabilities", async () => {
    const updated = await mockSubscriptionProvider.changeFrequency(
      "sub_biohack_001",
      60
    );
    expect(updated.intervalDays).toBe(60);

    // Disallowed interval throws error
    await expect(
      mockSubscriptionProvider.changeFrequency("sub_biohack_001", 45)
    ).rejects.toThrow(/Disallowed interval/);
  });

  it("swapProduct and changeQuantity update line items and totals", async () => {
    const swapped = await mockSubscriptionProvider.swapProduct(
      "sub_biohack_001",
      "sub_line_biohack",
      "var_renew_1"
    );
    expect(swapped.lines[0].variantId).toBe("var_renew_1");

    const changedQty = await mockSubscriptionProvider.changeQuantity(
      "sub_biohack_001",
      "sub_line_biohack",
      2
    );
    expect(changedQty.lines[0].quantity).toBe(2);
    expect(changedQty.estimatedTotal.amount).toBe(
      Number((changedQty.lines[0].price.amount * 2).toFixed(2))
    );
  });

  it("pause and resume transitions subscription status", async () => {
    const paused = await mockSubscriptionProvider.pause("sub_mgy_002");
    expect(paused.status).toBe("paused");
    expect(paused.pausedAt).toBeDefined();

    // Edge case: double pause throws
    await expect(mockSubscriptionProvider.pause("sub_mgy_002")).rejects.toThrow(
      /already paused/
    );

    const resumed = await mockSubscriptionProvider.resume("sub_mgy_002");
    expect(resumed.status).toBe("active");
    expect(resumed.pausedAt).toBeUndefined();

    // Edge case: resuming already active throws
    await expect(
      mockSubscriptionProvider.resume("sub_mgy_002")
    ).rejects.toThrow(/already active/);
  });

  it("cancel marks subscription as cancelled with reason", async () => {
    const cancelled = await mockSubscriptionProvider.cancel(
      "sub_biohack_001",
      "Temporarily pausing my health routine",
      "Taking a 2 month break"
    );

    expect(() => SubscriptionSchema.parse(cancelled)).not.toThrow();
    expect(cancelled.status).toBe("cancelled");
    expect(cancelled.cancellationReason).toBe(
      "Temporarily pausing my health routine"
    );
  });

  it("rejects modifications on cancelled subscription (edge case: assinatura sem ação permitida)", async () => {
    // sub_cancelled_003 is already cancelled
    await expect(
      mockSubscriptionProvider.skip("sub_cancelled_003")
    ).rejects.toThrow(/cannot skip on a cancelled subscription/);

    await expect(
      mockSubscriptionProvider.pause("sub_cancelled_003")
    ).rejects.toThrow(/cannot pause on a cancelled subscription/);

    await expect(
      mockSubscriptionProvider.resume("sub_cancelled_003")
    ).rejects.toThrow(/cannot resume a cancelled subscription/);

    await expect(
      mockSubscriptionProvider.changeFrequency("sub_cancelled_003", 60)
    ).rejects.toThrow(/cannot change frequency on a cancelled subscription/);

    await expect(
      mockSubscriptionProvider.changeQuantity(
        "sub_cancelled_003",
        "sub_line_powerhouse",
        2
      )
    ).rejects.toThrow(/cannot change quantity on a cancelled subscription/);

    await expect(
      mockSubscriptionProvider.swapProduct(
        "sub_cancelled_003",
        "sub_line_powerhouse",
        "var_biohack_1"
      )
    ).rejects.toThrow(/cannot swap product on a cancelled subscription/);
  });
});
