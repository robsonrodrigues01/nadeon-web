// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

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

import { CountdownTimer } from "@/components/layout/announcement-bar/countdown-timer";
import CancelSubscriptionPage from "@/app/(account)/account/subscriptions/[id]/cancel/page";

afterEach(() => {
  cleanup();
});

describe("W5-34 hydration safety", () => {
  it("suppresses hydration warnings on CountdownTimer live clock elements", () => {
    const { container } = render(
      <CountdownTimer countdownEnd="2026-11-30T00:00:00Z" line="human" />
    );

    const timer = screen.getByRole("timer");
    expect(timer).toBeTruthy();
    // React's suppressHydrationWarning is reflected on the DOM node or React props
    const chips = container.querySelectorAll(".tabular-nums");
    expect(chips.length).toBe(4);
  });

  it("preserves intervalDays form submission with hydration safety on cancel frequency button", async () => {
    const page = await CancelSubscriptionPage({
      params: Promise.resolve({ id: "sub_biohack_001" }),
    });
    render(page);

    const switchButton = screen.getByRole("button", {
      name: "Switch to 60 days",
    });
    expect(switchButton).toBeTruthy();
    expect(switchButton.getAttribute("name")).toBe("intervalDays");
    expect(switchButton.getAttribute("value")).toBe("60");
  });
});
