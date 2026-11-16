import { describe, it, expect, afterEach, vi } from "vitest";

const revalidatePathMock = vi.hoisted(() => vi.fn());
vi.mock("next/cache", () => ({ revalidatePath: revalidatePathMock }));
vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
}));

import {
  cancelSubscription,
  changeSubscriptionFrequency,
  pauseSubscription,
  pauseSubscriptionWithFeedback,
  skipSubscription,
} from "@/app/(account)/account/subscriptions/_components/subscription-actions";
import {
  addDays,
  customerInitial,
  listedSubscriptions,
  nextLongerInterval,
  shipsTo,
  totalQuantity,
} from "@/app/(account)/account/subscriptions/_components/format";
import { CANCEL_REASONS } from "@/app/(account)/account/subscriptions/_components/cancel-reasons";
import { subscriptionProvider } from "@/lib/providers";

function form(values: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) {
    data.set(key, value);
  }
  return data;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("W2-21 subscription server actions", () => {
  it("cancels with the chosen reason and feedback, then returns to the list", async () => {
    const cancel = vi
      .spyOn(subscriptionProvider, "cancel")
      .mockResolvedValue({} as never);

    await expect(
      cancelSubscription(
        form({
          id: "sub_biohack_001",
          reason: "It is too expensive",
          feedback: "  too pricey  ",
        })
      )
    ).rejects.toThrow("REDIRECT:/account/subscriptions");

    expect(cancel).toHaveBeenCalledWith(
      "sub_biohack_001",
      "It is too expensive",
      "too pricey"
    );
  });

  it("sends the customer back to step 1 when the reason is missing or unknown", async () => {
    const cancel = vi.spyOn(subscriptionProvider, "cancel");

    await expect(
      cancelSubscription(form({ id: "sub_biohack_001" }))
    ).rejects.toThrow("REDIRECT:/account/subscriptions/sub_biohack_001/cancel");
    await expect(
      cancelSubscription(form({ id: "sub_biohack_001", reason: "Bogus" }))
    ).rejects.toThrow("REDIRECT:/account/subscriptions/sub_biohack_001/cancel");

    expect(cancel).not.toHaveBeenCalled();
  });

  it("accepts every reason option from the design", async () => {
    const cancel = vi
      .spyOn(subscriptionProvider, "cancel")
      .mockResolvedValue({} as never);

    for (const reason of CANCEL_REASONS) {
      await expect(
        cancelSubscription(form({ id: "sub_biohack_001", reason }))
      ).rejects.toThrow("REDIRECT:/account/subscriptions");
    }
    expect(cancel).toHaveBeenCalledTimes(CANCEL_REASONS.length);
  });

  it("skips the next delivery for the posted subscription", async () => {
    const skip = vi
      .spyOn(subscriptionProvider, "skip")
      .mockResolvedValue({} as never);

    await expect(skipSubscription(form({ id: "sub_mgy_002" }))).rejects.toThrow(
      "REDIRECT:/account/subscriptions"
    );
    expect(skip).toHaveBeenCalledWith("sub_mgy_002");
  });

  it("pauses the subscription, revalidates the list, and redirects to subscriptions", async () => {
    const pause = vi
      .spyOn(subscriptionProvider, "pause")
      .mockResolvedValue({} as never);

    await expect(
      pauseSubscription(form({ id: "sub_biohack_001" }))
    ).rejects.toThrow("REDIRECT:/account/subscriptions");

    expect(pause).toHaveBeenCalledWith("sub_biohack_001");
    expect(revalidatePathMock).toHaveBeenCalledWith("/account/subscriptions");
  });

  it("redirects without calling pause or revalidatePath when id is missing", async () => {
    const pause = vi.spyOn(subscriptionProvider, "pause");

    await expect(pauseSubscription(form({}))).rejects.toThrow(
      "REDIRECT:/account/subscriptions"
    );

    expect(pause).not.toHaveBeenCalled();
    expect(revalidatePathMock).not.toHaveBeenCalled();
  });

  it("pauses with feedback, revalidates, and returns success state", async () => {
    const fakeSub = { id: "sub_biohack_001", status: "paused" } as never;
    const pause = vi
      .spyOn(subscriptionProvider, "pause")
      .mockResolvedValue(fakeSub);

    const result = await pauseSubscriptionWithFeedback(
      { status: "idle" },
      form({ id: "sub_biohack_001" })
    );

    expect(result).toEqual({
      status: "success",
      message: "Subscription paused.",
      subscription: fakeSub,
    });
    expect(pause).toHaveBeenCalledWith("sub_biohack_001");
    expect(revalidatePathMock).toHaveBeenCalledWith("/account/subscriptions");
  });

  it("returns error state when pause with feedback fails or id is missing", async () => {
    const errorResult = await pauseSubscriptionWithFeedback(
      { status: "idle" },
      form({})
    );
    expect(errorResult).toEqual({
      status: "error",
      message: "We couldn't update your subscription. Please try again.",
    });

    vi.spyOn(subscriptionProvider, "pause").mockRejectedValue(
      new Error("Provider failure")
    );
    const thrownResult = await pauseSubscriptionWithFeedback(
      { status: "idle" },
      form({ id: "sub_biohack_001" })
    );
    expect(thrownResult).toEqual({
      status: "error",
      message: "We couldn't update your subscription. Please try again.",
    });
  });

  it("switches frequency only with a whole, positive number of days", async () => {
    const change = vi
      .spyOn(subscriptionProvider, "changeFrequency")
      .mockResolvedValue({} as never);

    await expect(
      changeSubscriptionFrequency(
        form({ id: "sub_biohack_001", intervalDays: "60" })
      )
    ).rejects.toThrow("REDIRECT:/account/subscriptions");
    expect(change).toHaveBeenCalledWith("sub_biohack_001", 60);

    await expect(
      changeSubscriptionFrequency(
        form({ id: "sub_biohack_001", intervalDays: "-5" })
      )
    ).rejects.toThrow("REDIRECT:/account/subscriptions");
    expect(change).toHaveBeenCalledTimes(1);
  });
});

describe("W2-21 subscription helpers", () => {
  it("picks the lowest allowed interval longer than the current one", () => {
    expect(nextLongerInterval(30, [30, 60, 90, 180])).toBe(60);
    expect(nextLongerInterval(60, [30, 60, 90])).toBe(90);
    expect(nextLongerInterval(90, [30, 60, 90])).toBeUndefined();
  });

  it("adds whole days to an ISO date", () => {
    expect(addDays("2026-11-30T00:00:00.000Z", 30)).toBe(
      "2026-12-30T00:00:00.000Z"
    );
  });

  it("builds the ships-to label and drops it when the address is missing", () => {
    expect(
      shipsTo({
        id: "a",
        firstName: "A",
        lastName: "B",
        address1: "x",
        city: "Austin",
        province: "TX",
        zip: "78701",
        country: "US",
        isDefault: true,
      })
    ).toBe("Austin, TX");
    expect(shipsTo(undefined)).toBeUndefined();
  });

  it("sums quantities across the lines of one subscription", () => {
    expect(
      totalQuantity([
        {
          id: "1",
          variantId: "v",
          productTitle: "A",
          quantity: 2,
          price: { amount: 1, currencyCode: "USD" },
        },
        {
          id: "2",
          variantId: "v",
          productTitle: "B",
          quantity: 1,
          price: { amount: 1, currencyCode: "USD" },
        },
      ])
    ).toBe(3);
  });

  it("hides cancelled subscriptions and derives the avatar initial", async () => {
    const all = await subscriptionProvider.list();
    expect(all.some((sub) => sub.status === "cancelled")).toBe(true);
    expect(
      listedSubscriptions(all).every((sub) => sub.status !== "cancelled")
    ).toBe(true);
    expect(customerInitial("  alex")).toBe("A");
  });
});
