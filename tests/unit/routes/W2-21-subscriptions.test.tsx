// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, within, cleanup } from "@testing-library/react";

vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => undefined }),
}));
vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
  notFound: vi.fn(() => {
    throw new Error("NOT_FOUND");
  }),
}));

import SubscriptionsPage, {
  metadata,
} from "@/app/(account)/account/subscriptions/page";
import CancelSubscriptionPage, {
  metadata as cancelMetadata,
} from "@/app/(account)/account/subscriptions/[id]/cancel/page";
import { SubscriptionCard } from "@/app/(account)/account/subscriptions/_components/subscription-card";
import { formatMoneyWithMarket } from "@/lib/market/formatter";
import { DEFAULT_MARKET } from "@/lib/market/markets";
import { subscriptionProvider } from "@/lib/providers";

const PLACEHOLDERS = /\[X\]|\$XX|\(example\)|15%|20%/i;

// Header and footer are shared layout copy; the route's own copy is inside <main>.
function mainText(container: HTMLElement): string {
  return container.querySelector("main")?.textContent ?? "";
}

async function renderSubscriptions() {
  render(await SubscriptionsPage());
}

afterEach(() => {
  cleanup();
});

describe("W2-21 /account/subscriptions", () => {
  it("sets noindex metadata for the account area", () => {
    expect(metadata.title).toBe("Subscriptions | Nadeon Labs");
    expect(metadata.robots).toMatchObject({ index: false });
  });

  it("renders the heading, breadcrumb and the account navigation", async () => {
    await renderSubscriptions();

    expect(
      screen.getByRole("heading", { level: 1, name: "Subscriptions" })
    ).toBeTruthy();

    const breadcrumb = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(
      within(breadcrumb)
        .getByRole("link", { name: "Account" })
        .getAttribute("href")
    ).toBe("/account");

    const nav = screen.getByRole("navigation", { name: "Account" });
    expect(
      within(nav)
        .getByRole("link", { name: "Subscriptions" })
        .getAttribute("aria-current")
    ).toBe("page");
    expect(within(nav).getByRole("link", { name: "Orders" })).toBeTruthy();
    expect(within(nav).getByRole("link", { name: "Rewards" })).toBeTruthy();
    expect(within(nav).getByRole("button", { name: "Sign out" })).toBeTruthy();
  });

  it("lists only the subscriptions that are not cancelled, one article each", async () => {
    await renderSubscriptions();

    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(2);
    expect(
      screen.getByRole("heading", { level: 2, name: "BioHack - 1 Jar" })
    ).toBeTruthy();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "More Good Years - 2 Jars",
      })
    ).toBeTruthy();
    expect(screen.queryByText("Powerhouse - 1 Bottle")).toBeNull();
  });

  it("renders every card button of the design as a semantic element", async () => {
    await renderSubscriptions();

    for (const card of screen.getAllByRole("article")) {
      const scope = within(card);
      expect(scope.getByRole("button", { name: "Skip next" })).toBeTruthy();
      expect(scope.getByRole("button", { name: "Pause" })).toBeTruthy();
      for (const label of [
        "Change date",
        "Change frequency",
        "Swap product",
        "Edit quantity",
      ]) {
        const button = scope.getByRole("button", { name: label });
        expect(button.getAttribute("type")).toBe("button");
        expect((button as HTMLButtonElement).disabled).toBe(true);
      }
      const cancel = scope.getByRole("link", { name: "Cancel subscription" });
      expect(cancel.getAttribute("href")).toMatch(
        /^\/account\/subscriptions\/sub_[a-z0-9_]+\/cancel$/
      );
    }
  });

  it("links the add-a-product block to the formulas shop", async () => {
    await renderSubscriptions();

    expect(
      screen.getByRole("link", { name: "Browse formulas" }).getAttribute("href")
    ).toBe("/human/shop");
  });

  it("shows the price in the market currency via the shared formatter", async () => {
    await renderSubscriptions();

    const expected = formatMoneyWithMarket(
      { amount: 55.25, currencyCode: "USD" },
      DEFAULT_MARKET
    );
    expect(screen.getAllByText(expected).length).toBeGreaterThan(0);
  });

  it("keeps placeholder copy and invented discounts out of the page", async () => {
    const { container } = render(await SubscriptionsPage());
    expect(mainText(container)).not.toMatch(PLACEHOLDERS);
    cleanup();
  });

  it("hides the Pause and Skip actions when the provider does not allow them", async () => {
    const spy = vi
      .spyOn(subscriptionProvider, "capabilities")
      .mockResolvedValue({
        canSkip: false,
        canReschedule: false,
        canChangeFrequency: false,
        canSwapProduct: false,
        canChangeQuantity: false,
        canPause: false,
        canResume: false,
        canCancel: false,
        allowedIntervalDays: [30, 60],
        cancelReasons: [],
      });
    try {
      await renderSubscriptions();
      expect(screen.queryByRole("button", { name: "Skip next" })).toBeNull();
      expect(screen.queryByRole("button", { name: "Pause" })).toBeNull();
      expect(
        screen.queryByRole("link", { name: "Cancel subscription" })
      ).toBeNull();
    } finally {
      spy.mockRestore();
    }
  });

  it("renders the mounted Pause button with form and subscription id when canPause is true", async () => {
    const subs = await subscriptionProvider.list();
    const activeSub = subs.find((s) => s.status === "active")!;
    const caps = await subscriptionProvider.capabilities();

    render(
      <SubscriptionCard
        subscription={activeSub}
        capabilities={caps}
        market={DEFAULT_MARKET}
      />
    );

    const pauseBtn = screen.getByRole("button", { name: "Pause" });
    expect(pauseBtn.getAttribute("type")).toBe("submit");
    const pauseForm = pauseBtn.closest("form");
    expect(pauseForm).not.toBeNull();
    const idInput = pauseForm?.querySelector(
      'input[name="id"]'
    ) as HTMLInputElement;
    expect(idInput?.value).toBe(activeSub.id);
  });
});

describe("W2-21 /account/subscriptions/[id]/cancel", () => {
  it("sets noindex metadata for cancellation", async () => {
    expect(cancelMetadata.title).toBe("Cancel subscription | Nadeon Labs");
    expect(cancelMetadata.description).toBe(
      "Manage your subscription cancellation."
    );
    expect(cancelMetadata.robots).toMatchObject({
      index: false,
      follow: false,
    });
  });

  async function renderCancel(id: string) {
    const page = await CancelSubscriptionPage({
      params: Promise.resolve({ id }),
    });
    return render(page);
  }

  it("asks for a reason with the six design options as a required fieldset", async () => {
    await renderCancel("sub_biohack_001");

    const group = screen.getByRole("group", { name: "Why are you canceling?" });
    const radios = within(group).getAllByRole("radio");
    expect(radios.map((radio) => radio.getAttribute("value"))).toEqual([
      "I have too much product",
      "It is too expensive",
      "I am not seeing the results I want",
      "I want a different formula",
      "I need to change my delivery schedule",
      "Other",
    ]);
    for (const radio of radios) {
      expect((radio as HTMLInputElement).required).toBe(true);
      expect(radio.getAttribute("name")).toBe("reason");
    }
  });

  it("labels the optional feedback textarea", async () => {
    await renderCancel("sub_biohack_001");

    const feedback = screen.getByRole("textbox", {
      name: "Anything else? (optional)",
    });
    expect(feedback.tagName).toBe("TEXTAREA");
    expect(feedback.getAttribute("placeholder")).toBe("Tell us more…");
  });

  it("renders the offer and confirm buttons of the design as semantic elements", async () => {
    const { container } = await renderCancel("sub_biohack_001");

    expect(
      screen.getByRole("button", { name: "Skip next delivery" })
    ).toBeTruthy();
    const switchButton = screen.getByRole("button", {
      name: "Switch to 60 days",
    });
    expect(switchButton).toBeTruthy();
    const intervalInput = container.querySelector('input[name="intervalDays"]');
    expect(intervalInput?.getAttribute("value")).toBe("60");
    expect(
      screen
        .getByRole("link", { name: "Keep my subscription" })
        .getAttribute("href")
    ).toBe("/account/subscriptions");
    expect(
      screen
        .getByRole("button", { name: "Cancel subscription" })
        .getAttribute("type")
    ).toBe("submit");
  });

  it("shows the product, interval and next charge from the subscription data", async () => {
    await renderCancel("sub_biohack_001");

    expect(
      screen.getByText("BioHack - 1 Jar · every 30 days", { exact: false })
    ).toBeTruthy();
    expect(
      screen.getByRole("heading", { level: 1, name: "Cancel subscription" })
    ).toBeTruthy();
    expect(
      screen
        .getByRole("link", { name: "← Back to subscriptions" })
        .getAttribute("href")
    ).toBe("/account/subscriptions");
  });

  it("keeps placeholder copy and invented discounts out of the flow", async () => {
    const { container } = await renderCancel("sub_biohack_001");
    expect(mainText(container)).not.toMatch(PLACEHOLDERS);
  });

  it("returns not found for an unknown or already cancelled subscription", async () => {
    await expect(renderCancel("sub_missing")).rejects.toThrow("NOT_FOUND");
    await expect(renderCancel("sub_cancelled_003")).rejects.toThrow(
      "NOT_FOUND"
    );
  });
});
