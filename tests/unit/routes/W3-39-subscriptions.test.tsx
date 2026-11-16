// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";

const redirectMock = vi.hoisted(() => vi.fn());
const notFoundMock = vi.hoisted(() =>
  vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  })
);
const revalidatePathMock = vi.hoisted(() => vi.fn());

vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => undefined }),
}));
vi.mock("next/navigation", () => ({
  redirect: redirectMock,
  notFound: notFoundMock,
}));
vi.mock("next/cache", () => ({ revalidatePath: revalidatePathMock }));
vi.mock("@/components/layout/header", () => ({ Header: () => null }));
vi.mock("@/components/layout/footer", () => ({ Footer: () => null }));
vi.mock("@/components/layout/announcement-bar", () => ({
  AnnouncementBar: () => null,
}));

import SubscriptionsPage from "@/app/(account)/account/subscriptions/page";
import CancelSubscriptionPage from "@/app/(account)/account/subscriptions/[id]/cancel/page";
import { subscriptionProvider } from "@/lib/providers";
import type {
  Subscription,
  SubscriptionCapabilities,
} from "@/lib/contracts/subscription";
import { mockSubscriptionProvider } from "@/lib/providers/mock/subscription";

const FULL_CAPABILITIES: SubscriptionCapabilities = {
  canSkip: true,
  canReschedule: true,
  canChangeFrequency: true,
  canSwapProduct: true,
  canChangeQuantity: true,
  canPause: true,
  canResume: true,
  canCancel: true,
  allowedIntervalDays: [30, 60, 90, 120],
  cancelReasons: ["Too expensive", "Other reason"],
};

async function freshSubscription(id: string): Promise<Subscription> {
  const sub = await mockSubscriptionProvider.get(id);
  if (!sub) throw new Error(`Missing fixture: ${id}`);
  return structuredClone(sub);
}

async function renderList(
  subscriptions?: Subscription[],
  capabilities = FULL_CAPABILITIES
) {
  vi.spyOn(subscriptionProvider, "list").mockResolvedValue(
    subscriptions ?? [await freshSubscription("sub_biohack_001")]
  );
  vi.spyOn(subscriptionProvider, "capabilities").mockResolvedValue(
    capabilities
  );
  return render(await SubscriptionsPage());
}

async function renderCancel(subscription: Subscription) {
  vi.spyOn(subscriptionProvider, "get").mockResolvedValue(subscription);
  vi.spyOn(subscriptionProvider, "capabilities").mockResolvedValue(
    FULL_CAPABILITIES
  );
  return render(
    await CancelSubscriptionPage({
      params: Promise.resolve({ id: subscription.id }),
    })
  );
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  redirectMock.mockClear();
  notFoundMock.mockClear();
  revalidatePathMock.mockClear();
});

describe("W3-39 /account/subscriptions mounted behavior", () => {
  it("submits Skip next and calls the provider for the selected subscription", async () => {
    const sub = await freshSubscription("sub_biohack_001");
    const skip = vi.spyOn(subscriptionProvider, "skip").mockResolvedValue(sub);
    await renderList([sub]);

    const card = screen.getByRole("article", { name: "BioHack - 1 Jar" });
    fireEvent.click(within(card).getByRole("button", { name: "Skip next" }));

    await waitFor(() => expect(skip).toHaveBeenCalledWith(sub.id));
    expect(revalidatePathMock).toHaveBeenCalledWith("/account/subscriptions");
  });

  it("submits Pause and calls the provider", async () => {
    const sub = await freshSubscription("sub_biohack_001");
    const pause = vi
      .spyOn(subscriptionProvider, "pause")
      .mockResolvedValue({ ...sub, status: "paused" });
    await renderList([sub]);

    const card = screen.getByRole("article", { name: "BioHack - 1 Jar" });
    fireEvent.click(within(card).getByRole("button", { name: "Pause" }));

    await waitFor(() => expect(pause).toHaveBeenCalledWith(sub.id));
  });

  it("shows or hides actions from the provider capabilities", async () => {
    const sub = await freshSubscription("sub_biohack_001");
    await renderList([sub], {
      ...FULL_CAPABILITIES,
      canSkip: false,
      canPause: false,
      canReschedule: false,
      canChangeFrequency: false,
      canSwapProduct: false,
      canChangeQuantity: false,
      canCancel: false,
    });

    expect(screen.queryByRole("button", { name: "Skip next" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Pause" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Change date" })).toBeNull();
    expect(
      screen.queryByRole("button", { name: "Change frequency" })
    ).toBeNull();
    expect(screen.queryByRole("button", { name: "Swap product" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Edit quantity" })).toBeNull();
    expect(
      screen.queryByRole("link", { name: "Cancel subscription" })
    ).toBeNull();
  });

  it.fails(
    "offers Resume and calls the provider for a paused subscription",
    async () => {
      const sub = {
        ...(await freshSubscription("sub_biohack_001")),
        status: "paused" as const,
      };
      const resume = vi
        .spyOn(subscriptionProvider, "resume")
        .mockResolvedValue({ ...sub, status: "active" });
      await renderList([sub]);

      const card = screen.getByRole("article", { name: "BioHack - 1 Jar" });
      fireEvent.click(within(card).getByRole("button", { name: "Resume" }));
      await waitFor(() => expect(resume).toHaveBeenCalledWith(sub.id));
    }
  );

  it.fails(
    "changes frequency from the subscription card through the provider",
    async () => {
      const sub = await freshSubscription("sub_biohack_001");
      const changeFrequency = vi
        .spyOn(subscriptionProvider, "changeFrequency")
        .mockResolvedValue({ ...sub, intervalDays: 60 });
      await renderList([sub]);
      const card = screen.getByRole("article", { name: "BioHack - 1 Jar" });

      fireEvent.click(
        within(card).getByRole("button", { name: "Change frequency" })
      );
      await waitFor(() =>
        expect(changeFrequency).toHaveBeenCalledWith(sub.id, 60)
      );
    }
  );

  it.fails(
    "swaps the product through the provider when capability is enabled",
    async () => {
      const sub = await freshSubscription("sub_biohack_001");
      const swapProduct = vi
        .spyOn(subscriptionProvider, "swapProduct")
        .mockResolvedValue(sub);
      await renderList([sub]);
      const card = screen.getByRole("article", { name: "BioHack - 1 Jar" });

      fireEvent.click(
        within(card).getByRole("button", { name: "Swap product" })
      );
      await waitFor(() =>
        expect(swapProduct).toHaveBeenCalledWith(
          sub.id,
          sub.lines[0].id,
          expect.any(String)
        )
      );
    }
  );

  it.fails(
    "changes quantity through the provider when capability is enabled",
    async () => {
      const sub = await freshSubscription("sub_biohack_001");
      const changeQuantity = vi
        .spyOn(subscriptionProvider, "changeQuantity")
        .mockResolvedValue(sub);
      await renderList([sub]);
      const card = screen.getByRole("article", { name: "BioHack - 1 Jar" });

      fireEvent.click(
        within(card).getByRole("button", { name: "Edit quantity" })
      );
      await waitFor(() =>
        expect(changeQuantity).toHaveBeenCalledWith(sub.id, sub.lines[0].id, 2)
      );
    }
  );

  it("cancels with the selected reason and feedback through the mounted form", async () => {
    const sub = await freshSubscription("sub_biohack_001");
    const cancel = vi
      .spyOn(subscriptionProvider, "cancel")
      .mockResolvedValue({ ...sub, status: "cancelled" });
    await renderCancel(sub);

    fireEvent.click(screen.getByRole("radio", { name: "It is too expensive" }));
    fireEvent.change(
      screen.getByRole("textbox", { name: "Anything else? (optional)" }),
      {
        target: { value: "I need to reduce expenses" },
      }
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Cancel subscription" })
    );

    await waitFor(() =>
      expect(cancel).toHaveBeenCalledWith(
        sub.id,
        "It is too expensive",
        "I need to reduce expenses"
      )
    );
  });

  it.todo(
    "switches frequency through the cancel flow; JSDOM cannot resolve Next server formAction references, and W2-21 tests the action directly"
  );

  it.fails(
    "updates visible status and shows feedback when a provider action succeeds",
    async () => {
      const sub = await freshSubscription("sub_biohack_001");
      vi.spyOn(subscriptionProvider, "pause").mockResolvedValue({
        ...sub,
        status: "paused",
      });
      await renderList([sub]);

      const card = screen.getByRole("article", { name: "BioHack - 1 Jar" });
      fireEvent.click(within(card).getByRole("button", { name: "Pause" }));

      await waitFor(() =>
        expect(within(card).getByText("Paused")).toBeTruthy()
      );
      expect(screen.getByRole("status").textContent).toMatch(/paused/i);
    }
  );

  it.todo(
    "shows an inline error after provider failure; server action currently propagates it with no rendered error state"
  );

  it.fails(
    "reflects cancellation and displays success feedback after submit",
    async () => {
      const sub = await freshSubscription("sub_biohack_001");
      vi.spyOn(subscriptionProvider, "cancel").mockResolvedValue({
        ...sub,
        status: "cancelled",
      });
      await renderCancel(sub);
      fireEvent.click(
        screen.getByRole("radio", { name: "It is too expensive" })
      );
      fireEvent.click(
        screen.getByRole("button", { name: "Cancel subscription" })
      );

      await waitFor(() =>
        expect(screen.getByRole("heading", { name: "Cancelled" })).toBeTruthy()
      );
      expect(screen.getByRole("status").textContent).toMatch(/cancel/i);
    }
  );
});
