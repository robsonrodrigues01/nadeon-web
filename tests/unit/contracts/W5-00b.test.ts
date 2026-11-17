import { describe, expect, it, vi } from "vitest";
import { MockEmailPreferencesProvider } from "@/lib/providers/mock/email-preferences";
import { MockGiftCardProvider } from "@/lib/providers/mock/gift-card";
import { MockStoreLocatorProvider } from "@/lib/providers/mock/store-locator";
import { MockWholesaleProvider } from "@/lib/providers/mock/wholesale";
import { MockOffersProvider } from "@/lib/providers/mock/offers";

describe("Wave 5 contracts and mocks", () => {
  it("keeps order emails required and supports email preference changes", async () => {
    const provider = new MockEmailPreferencesProvider();
    const saved = await provider.savePreferences({
      topics: {
        subscriptionReminders: true,
        humanNews: false,
        petNews: true,
        journal: false,
        offers: true,
      },
      frequency: "weekly_digest",
    });

    expect(saved.ordersAndShipping).toBe(true);
    expect(saved.topics.petNews).toBe(true);
    expect(saved.frequency).toBe("weekly_digest");

    const unsubscribed = await provider.unsubscribe("too_many_emails");
    expect(unsubscribed.ordersAndShipping).toBe(true);
    expect(unsubscribed.unsubscribedAll).toBe(true);

    const resubscribed = await provider.resubscribe();
    expect(resubscribed.ordersAndShipping).toBe(true);
    expect(resubscribed.unsubscribedAll).toBe(false);
    expect(resubscribed.topics.petNews).toBe(true);
  });

  it("validates gift card details but returns no recipient PII from the mock", async () => {
    const provider = new MockGiftCardProvider();
    expect(await provider.getAvailableAmounts("USD")).toEqual([]);
    expect(await provider.getDesigns()).toEqual([
      "espresso",
      "sunset",
      "cream",
    ]);

    await expect(
      provider.preparePurchase({
        amount: { amount: 50, currencyCode: "USD" },
        design: "sunset",
        recipientName: "TEST Recipient",
        recipientEmail: "gift-recipient@example.com",
        senderName: "TEST Sender",
        deliveryDate: "2026-12-01",
      })
    ).rejects.toThrow(/approved range/i);

    vi.spyOn(provider, "getAvailableAmounts").mockResolvedValue([
      { amount: 50, currencyCode: "USD" },
      { amount: 100, currencyCode: "USD" },
    ]);
    const result = await provider.preparePurchase({
      amount: { amount: 50, currencyCode: "USD" },
      design: "sunset",
      recipientName: "TEST Recipient",
      recipientEmail: "gift-recipient@example.com",
      senderName: "TEST Sender",
      message: "TEST gift message",
      deliveryDate: "2026-12-01",
    });

    expect(result.id).toMatch(/^gift_TEST_/);
    expect(JSON.stringify(result)).not.toContain("gift-recipient@example.com");
    expect(JSON.stringify(result)).not.toContain("TEST gift message");
    await expect(
      provider.preparePurchase({
        amount: { amount: 125, currencyCode: "USD" },
        design: "sunset",
        recipientName: "TEST Recipient",
        recipientEmail: "gift-recipient@example.com",
        senderName: "TEST Sender",
        deliveryDate: "2026-12-01",
      })
    ).rejects.toThrow(/approved range/i);
    await expect(
      provider.preparePurchase({
        amount: { amount: 50, currencyCode: "USD" },
        design: "sunset",
        recipientName: "TEST Recipient",
        recipientEmail: "gift-recipient@example.com",
        senderName: "TEST Sender",
        deliveryDate: "tomorrow",
      })
    ).rejects.toThrow();
  });

  it("returns no locations until approved store data is available", async () => {
    const provider = new MockStoreLocatorProvider();
    const nearby = await provider.search({
      zip: "TEST-ZIP",
      radiusMiles: 4,
      line: "pet",
    });
    expect(nearby).toEqual([]);
    expect(await provider.search({ zip: "00000", radiusMiles: 4 })).toEqual([]);
  });

  it("accepts wholesale applications and returns only a synthetic receipt", async () => {
    const result = await new MockWholesaleProvider().submit({
      businessName: "TEST Business",
      contactName: "TEST Contact",
      email: "wholesale@example.com",
      phone: "TEST-000-0000",
      businessType: "TEST retailer",
      state: "TEST",
      locationCount: "1",
      resellerPermitOrEin: "TEST-ID",
      estimatedMonthlyOrder: "TEST range",
      productLines: ["human"],
      termsAccepted: true,
    });
    expect(result.id).toMatch(/^wholesale_TEST_/);
    expect(JSON.stringify(result)).not.toContain("wholesale@example.com");
  });

  it("does not invent offer terms while board content remains placeholder", async () => {
    const provider = new MockOffersProvider();
    expect(await provider.list()).toEqual([]);
    expect(await provider.get()).toBeNull();
  });
});
