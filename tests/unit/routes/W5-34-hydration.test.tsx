// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act } from "react";
import { renderToString } from "react-dom/server";
import { hydrateRoot, type Root } from "react-dom/client";

// Configure React act environment
(
  globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

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

describe("W5-34 SSR and hydration verification", () => {
  let container: HTMLDivElement;
  let root: Root | null = null;
  let loggedErrors: string[] = [];
  const originalError = console.error;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    loggedErrors = [];
    console.error = (...args: unknown[]) => {
      const message = args.map(String).join(" ");
      loggedErrors.push(message);
      originalError.apply(console, args);
    };
  });

  afterEach(() => {
    if (root) {
      act(() => {
        root?.unmount();
      });
      root = null;
    }
    document.body.removeChild(container);
    console.error = originalError;
    vi.useRealTimers();
  });

  it("renders CountdownTimer with stable fallback in SSR and hydrates without errors", async () => {
    vi.useFakeTimers();
    const fixedNow = new Date("2026-11-20T12:00:00Z").getTime();
    vi.setSystemTime(fixedNow);

    const target = new Date("2026-11-23T15:30:45Z").toISOString();
    const element = <CountdownTimer countdownEnd={target} line="human" />;

    // 1. SSR renderToString must produce stable fallback
    const ssrHtml = renderToString(element);
    expect(ssrHtml).toContain("00");
    expect(ssrHtml).toContain(
      'aria-label="Time remaining: 00 days, 00 hours, 00 minutes, 00 seconds"'
    );

    // 2. Set container HTML to match server output
    container.innerHTML = ssrHtml;

    // 3. Hydrate with hydrateRoot
    await act(async () => {
      root = hydrateRoot(container, element);
    });

    // 4. Confirm zero hydration errors or warnings
    const hydrationErrors = loggedErrors.filter(
      (err) =>
        err.includes("Hydration failed") ||
        err.includes("did not match") ||
        err.includes("suppressHydrationWarning")
    );
    expect(hydrationErrors).toEqual([]);

    // 5. Confirm timer updates after mount to real values
    const timer = container.querySelector('[role="timer"]');
    expect(timer).toBeTruthy();
    expect(timer?.getAttribute("aria-label")).toBe(
      "Time remaining: 03 days, 03 hours, 30 minutes, 45 seconds"
    );

    // 6. Confirm clock advances with time
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(timer?.getAttribute("aria-label")).toBe(
      "Time remaining: 03 days, 03 hours, 30 minutes, 44 seconds"
    );
  });

  it("hydrates CancelSubscriptionPage cleanly without button attribute mismatch or suppression", async () => {
    const page = await CancelSubscriptionPage({
      params: Promise.resolve({ id: "sub_biohack_001" }),
    });

    // 1. SSR renderToString
    const ssrHtml = renderToString(page);
    container.innerHTML = ssrHtml;

    // 2. Client hydrateRoot
    await act(async () => {
      root = hydrateRoot(container, page);
    });

    // 3. Confirm zero hydration errors or server-action name collisions
    const hydrationErrors = loggedErrors.filter(
      (err) =>
        err.includes("Hydration failed") ||
        err.includes("did not match") ||
        err.includes('Cannot specify a "name" prop')
    );
    expect(hydrationErrors).toEqual([]);

    // 4. Verify frequency interval input exists in hydrated DOM
    const intervalInput = container.querySelector('input[name="intervalDays"]');
    expect(intervalInput).toBeTruthy();
    expect(intervalInput?.getAttribute("value")).toBe("60");

    // 5. Verify switch button is semantic submit button
    const buttons = Array.from(container.querySelectorAll("button"));
    const switchButton = buttons.find((b) =>
      b.textContent?.includes("Switch to 60 days")
    );
    expect(switchButton).toBeTruthy();
    expect(switchButton?.getAttribute("type")).toBe("submit");
  });
});
