import { afterEach, describe, expect, it, vi } from "vitest";

const revalidatePathMock = vi.hoisted(() => vi.fn());
const redirectMock = vi.hoisted(() =>
  vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  })
);

vi.mock("next/cache", () => ({ revalidatePath: revalidatePathMock }));
vi.mock("next/navigation", () => ({ redirect: redirectMock }));

import {
  cancelSubscription,
  cancelSubscriptionWithFeedback,
  changeSubscriptionFrequency,
  pauseSubscription,
  pauseSubscriptionWithFeedback,
  skipSubscription,
  skipSubscriptionWithFeedback,
} from "@/app/(account)/account/subscriptions/_components/subscription-actions";
import { skipNextDeliveryAction } from "@/app/(account)/account/_components/actions";
import {
  savePetAction,
  saveProfileWithFeedback,
} from "@/app/(account)/account/settings/_components/actions";
import { accountProvider, subscriptionProvider } from "@/lib/providers";

function form(values: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) {
    data.set(key, value);
  }
  return data;
}

const VALID_SUB_ID = "sub_biohack_001";
const FOREIGN_SUB_ID = "sub_foreign_attacker_999";
const VALID_PET_ID = "pet_rover_001";
const FOREIGN_PET_ID = "pet_foreign_attacker_999";

const MOCK_CUSTOMER = {
  id: "cust_alex_example",
  firstName: "Alex",
  lastName: "Morgan",
  email: "alex.morgan@example.com",
};

const MOCK_OWNED_SUBSCRIPTIONS = [
  {
    id: VALID_SUB_ID,
    status: "active",
    nextBillingDate: "2026-12-01T00:00:00.000Z",
    intervalDays: 30,
    lines: [],
    estimatedTotal: { amount: 55.25, currencyCode: "USD" },
    createdAt: "2026-10-01T00:00:00.000Z",
  },
] as never[];

const MOCK_OWNED_PETS = [
  {
    id: VALID_PET_ID,
    name: "Rover",
    species: "dog",
    breed: "Golden Retriever",
  },
] as never[];

afterEach(() => {
  vi.restoreAllMocks();
  revalidatePathMock.mockClear();
  redirectMock.mockClear();
});

describe("W4-20: Security - Missing Session (Unauthenticated)", () => {
  it("rejects subscription mutations when session/customer is missing", async () => {
    vi.spyOn(accountProvider, "getSession").mockResolvedValue(null);
    vi.spyOn(accountProvider, "getCustomer").mockResolvedValue(null);
    const skipSpy = vi.spyOn(subscriptionProvider, "skip");
    const pauseSpy = vi.spyOn(subscriptionProvider, "pause");
    const changeFreqSpy = vi.spyOn(subscriptionProvider, "changeFrequency");
    const cancelSpy = vi.spyOn(subscriptionProvider, "cancel");

    // skipSubscription redirects to login without mutating
    await expect(skipSubscription(form({ id: VALID_SUB_ID }))).rejects.toThrow(
      /REDIRECT:\/account\/login/
    );
    expect(skipSpy).not.toHaveBeenCalled();

    // pauseSubscription redirects to login without mutating
    await expect(pauseSubscription(form({ id: VALID_SUB_ID }))).rejects.toThrow(
      /REDIRECT:\/account\/login/
    );
    expect(pauseSpy).not.toHaveBeenCalled();

    // changeSubscriptionFrequency redirects to login without mutating
    await expect(
      changeSubscriptionFrequency(
        form({ id: VALID_SUB_ID, intervalDays: "60" })
      )
    ).rejects.toThrow(/REDIRECT:\/account\/login/);
    expect(changeFreqSpy).not.toHaveBeenCalled();

    // cancelSubscription redirects to login without mutating
    await expect(
      cancelSubscription(
        form({ id: VALID_SUB_ID, reason: "It is too expensive" })
      )
    ).rejects.toThrow(/REDIRECT:\/account\/login/);
    expect(cancelSpy).not.toHaveBeenCalled();
  });

  it("returns generic error state for feedback actions when session is missing", async () => {
    vi.spyOn(accountProvider, "getSession").mockResolvedValue(null);
    vi.spyOn(accountProvider, "getCustomer").mockResolvedValue(null);
    const skipSpy = vi.spyOn(subscriptionProvider, "skip");
    const pauseSpy = vi.spyOn(subscriptionProvider, "pause");
    const cancelSpy = vi.spyOn(subscriptionProvider, "cancel");

    const skipResult = await skipSubscriptionWithFeedback(
      { status: "idle" },
      form({ id: VALID_SUB_ID })
    );
    expect(skipResult).toEqual({
      status: "error",
      message: "You must be signed in to manage subscriptions.",
    });
    expect(skipSpy).not.toHaveBeenCalled();

    const pauseResult = await pauseSubscriptionWithFeedback(
      { status: "idle" },
      form({ id: VALID_SUB_ID })
    );
    expect(pauseResult).toEqual({
      status: "error",
      message: "You must be signed in to manage subscriptions.",
    });
    expect(pauseSpy).not.toHaveBeenCalled();

    const cancelResult = await cancelSubscriptionWithFeedback(
      { status: "idle" },
      form({
        id: VALID_SUB_ID,
        reason: "It is too expensive",
      })
    );
    expect(cancelResult).toEqual({
      status: "error",
      message: "You must be signed in to manage subscriptions.",
    });
    expect(cancelSpy).not.toHaveBeenCalled();
  });

  it("rejects skipNextDeliveryAction in dashboard when unauthenticated", async () => {
    vi.spyOn(accountProvider, "getSession").mockResolvedValue(null);
    vi.spyOn(accountProvider, "getCustomer").mockResolvedValue(null);
    const skipSpy = vi.spyOn(subscriptionProvider, "skip");

    await expect(
      skipNextDeliveryAction(form({ subscriptionId: VALID_SUB_ID }))
    ).rejects.toThrow("Authentication required");
    expect(skipSpy).not.toHaveBeenCalled();
  });

  it("rejects profile and pet mutations when unauthenticated", async () => {
    vi.spyOn(accountProvider, "getSession").mockResolvedValue(null);
    vi.spyOn(accountProvider, "getCustomer").mockResolvedValue(null);
    const updateProfileSpy = vi.spyOn(accountProvider, "updateProfile");
    const savePetSpy = vi.spyOn(accountProvider, "savePet");

    const profileResult = await saveProfileWithFeedback(
      { status: "idle" },
      form({
        firstName: "Attacker",
        lastName: "User",
        email: "attacker@example.com",
      })
    );
    expect(profileResult).toEqual({
      status: "error",
      message: "You must be signed in to update your profile.",
    });
    expect(updateProfileSpy).not.toHaveBeenCalled();

    const petResult = await savePetAction(
      form({
        name: "Shadow",
        species: "cat",
      })
    );
    expect(petResult).toBeNull();
    expect(savePetSpy).not.toHaveBeenCalled();
  });
});

describe("W4-20: Security - Foreign ID (ID of Another Customer)", () => {
  it("rejects subscription mutations when subscription ID belongs to another customer", async () => {
    vi.spyOn(accountProvider, "getSession").mockResolvedValue({
      accessToken: "tok",
      expiresAt: "2099-01-01",
      customerId: MOCK_CUSTOMER.id,
    });
    vi.spyOn(accountProvider, "getCustomer").mockResolvedValue(
      MOCK_CUSTOMER as never
    );
    vi.spyOn(subscriptionProvider, "list").mockResolvedValue(
      MOCK_OWNED_SUBSCRIPTIONS
    );

    const skipSpy = vi.spyOn(subscriptionProvider, "skip");
    const pauseSpy = vi.spyOn(subscriptionProvider, "pause");
    const changeFreqSpy = vi.spyOn(subscriptionProvider, "changeFrequency");
    const cancelSpy = vi.spyOn(subscriptionProvider, "cancel");

    // Redirects without mutating
    await expect(
      skipSubscription(form({ id: FOREIGN_SUB_ID }))
    ).rejects.toThrow("REDIRECT:/account/subscriptions");
    expect(skipSpy).not.toHaveBeenCalled();

    await expect(
      pauseSubscription(form({ id: FOREIGN_SUB_ID }))
    ).rejects.toThrow("REDIRECT:/account/subscriptions");
    expect(pauseSpy).not.toHaveBeenCalled();

    await expect(
      changeSubscriptionFrequency(
        form({ id: FOREIGN_SUB_ID, intervalDays: "60" })
      )
    ).rejects.toThrow("REDIRECT:/account/subscriptions");
    expect(changeFreqSpy).not.toHaveBeenCalled();

    await expect(
      cancelSubscription(
        form({ id: FOREIGN_SUB_ID, reason: "It is too expensive" })
      )
    ).rejects.toThrow("REDIRECT:/account/subscriptions");
    expect(cancelSpy).not.toHaveBeenCalled();
  });

  it("returns generic error state for feedback actions when subscription ID is foreign", async () => {
    vi.spyOn(accountProvider, "getSession").mockResolvedValue({
      accessToken: "tok",
      expiresAt: "2099-01-01",
      customerId: MOCK_CUSTOMER.id,
    });
    vi.spyOn(accountProvider, "getCustomer").mockResolvedValue(
      MOCK_CUSTOMER as never
    );
    vi.spyOn(subscriptionProvider, "list").mockResolvedValue(
      MOCK_OWNED_SUBSCRIPTIONS
    );

    const skipSpy = vi.spyOn(subscriptionProvider, "skip");
    const pauseSpy = vi.spyOn(subscriptionProvider, "pause");
    const cancelSpy = vi.spyOn(subscriptionProvider, "cancel");

    const skipResult = await skipSubscriptionWithFeedback(
      { status: "idle" },
      form({ id: FOREIGN_SUB_ID })
    );
    expect(skipResult).toEqual({
      status: "error",
      message: "We couldn't update your subscription. Please try again.",
    });
    expect(skipSpy).not.toHaveBeenCalled();

    const pauseResult = await pauseSubscriptionWithFeedback(
      { status: "idle" },
      form({ id: FOREIGN_SUB_ID })
    );
    expect(pauseResult).toEqual({
      status: "error",
      message: "We couldn't update your subscription. Please try again.",
    });
    expect(pauseSpy).not.toHaveBeenCalled();

    const cancelResult = await cancelSubscriptionWithFeedback(
      { status: "idle" },
      form({
        id: FOREIGN_SUB_ID,
        reason: "It is too expensive",
      })
    );
    expect(cancelResult).toEqual({
      status: "error",
      message: "We couldn't update your subscription. Please try again.",
    });
    expect(cancelSpy).not.toHaveBeenCalled();
  });

  it("rejects skipNextDeliveryAction when subscription ID does not belong to logged-in customer", async () => {
    vi.spyOn(accountProvider, "getSession").mockResolvedValue({
      accessToken: "tok",
      expiresAt: "2099-01-01",
      customerId: MOCK_CUSTOMER.id,
    });
    vi.spyOn(accountProvider, "getCustomer").mockResolvedValue(
      MOCK_CUSTOMER as never
    );
    vi.spyOn(subscriptionProvider, "list").mockResolvedValue(
      MOCK_OWNED_SUBSCRIPTIONS
    );

    const skipSpy = vi.spyOn(subscriptionProvider, "skip");

    await expect(
      skipNextDeliveryAction(form({ subscriptionId: FOREIGN_SUB_ID }))
    ).rejects.toThrow("Subscription not found");
    expect(skipSpy).not.toHaveBeenCalled();
  });

  it("rejects savePetAction when pet ID does not belong to logged-in customer", async () => {
    vi.spyOn(accountProvider, "getSession").mockResolvedValue({
      accessToken: "tok",
      expiresAt: "2099-01-01",
      customerId: MOCK_CUSTOMER.id,
    });
    vi.spyOn(accountProvider, "getCustomer").mockResolvedValue(
      MOCK_CUSTOMER as never
    );
    vi.spyOn(accountProvider, "getPets").mockResolvedValue(MOCK_OWNED_PETS);

    const savePetSpy = vi.spyOn(accountProvider, "savePet");

    const result = await savePetAction(
      form({
        id: FOREIGN_PET_ID,
        name: "Hacked Pet",
        species: "dog",
      })
    );
    expect(result).toBeNull();
    expect(savePetSpy).not.toHaveBeenCalled();
  });
});

describe("W4-20: Security - Valid Case (Authorized Owner)", () => {
  it("allows subscription mutations when customer owns the subscription", async () => {
    vi.spyOn(accountProvider, "getSession").mockResolvedValue({
      accessToken: "tok",
      expiresAt: "2099-01-01",
      customerId: MOCK_CUSTOMER.id,
    });
    vi.spyOn(accountProvider, "getCustomer").mockResolvedValue(
      MOCK_CUSTOMER as never
    );
    vi.spyOn(subscriptionProvider, "list").mockResolvedValue(
      MOCK_OWNED_SUBSCRIPTIONS
    );

    const skipSpy = vi
      .spyOn(subscriptionProvider, "skip")
      .mockResolvedValue({} as never);
    const pauseSpy = vi
      .spyOn(subscriptionProvider, "pause")
      .mockResolvedValue({} as never);
    const changeFreqSpy = vi
      .spyOn(subscriptionProvider, "changeFrequency")
      .mockResolvedValue({} as never);
    const cancelSpy = vi
      .spyOn(subscriptionProvider, "cancel")
      .mockResolvedValue({} as never);

    await expect(skipSubscription(form({ id: VALID_SUB_ID }))).rejects.toThrow(
      "REDIRECT:/account/subscriptions"
    );
    expect(skipSpy).toHaveBeenCalledWith(VALID_SUB_ID);

    await expect(pauseSubscription(form({ id: VALID_SUB_ID }))).rejects.toThrow(
      "REDIRECT:/account/subscriptions"
    );
    expect(pauseSpy).toHaveBeenCalledWith(VALID_SUB_ID);

    await expect(
      changeSubscriptionFrequency(
        form({ id: VALID_SUB_ID, intervalDays: "60" })
      )
    ).rejects.toThrow("REDIRECT:/account/subscriptions");
    expect(changeFreqSpy).toHaveBeenCalledWith(VALID_SUB_ID, 60);

    await expect(
      cancelSubscription(
        form({
          id: VALID_SUB_ID,
          reason: "It is too expensive",
          feedback: "note",
        })
      )
    ).rejects.toThrow("REDIRECT:/account/subscriptions");
    expect(cancelSpy).toHaveBeenCalledWith(
      VALID_SUB_ID,
      "It is too expensive",
      "note"
    );
  });

  it("allows skipNextDeliveryAction when customer owns the subscription", async () => {
    vi.spyOn(accountProvider, "getSession").mockResolvedValue({
      accessToken: "tok",
      expiresAt: "2099-01-01",
      customerId: MOCK_CUSTOMER.id,
    });
    vi.spyOn(accountProvider, "getCustomer").mockResolvedValue(
      MOCK_CUSTOMER as never
    );
    vi.spyOn(subscriptionProvider, "list").mockResolvedValue(
      MOCK_OWNED_SUBSCRIPTIONS
    );

    const skipSpy = vi
      .spyOn(subscriptionProvider, "skip")
      .mockResolvedValue({} as never);

    await skipNextDeliveryAction(form({ subscriptionId: VALID_SUB_ID }));
    expect(skipSpy).toHaveBeenCalledWith(VALID_SUB_ID);
    expect(revalidatePathMock).toHaveBeenCalledWith("/account");
  });

  it("does not log personal data during rejection or processing", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    vi.spyOn(accountProvider, "getSession").mockResolvedValue(null);
    vi.spyOn(accountProvider, "getCustomer").mockResolvedValue(null);

    await skipSubscriptionWithFeedback(
      { status: "idle" },
      form({ id: "secret_123_private" })
    );

    const allLogs = [
      ...errorSpy.mock.calls,
      ...warnSpy.mock.calls,
      ...logSpy.mock.calls,
    ]
      .flat()
      .map(String)
      .join(" ");

    expect(allLogs).not.toContain("secret_123_private");
    expect(allLogs).not.toContain("alex.morgan@example.com");
  });
});
