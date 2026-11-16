/**
 * @vitest-environment jsdom
 */
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import { DeferredNewsletter } from "@/components/brand/newsletter/deferred-newsletter";

const observers: MockIntersectionObserver[] = [];

class MockIntersectionObserver {
  constructor(private readonly callback: IntersectionObserverCallback) {
    observers.push(this);
  }
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
  trigger() {
    this.callback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver
    );
  }
}

vi.mock("next/dynamic", async () => {
  const ReactModule = await import("react");
  return {
    default: (
      loader: () => Promise<
        | React.ComponentType
        | { default?: React.ComponentType; Newsletter?: React.ComponentType }
      >,
      options?: { loading?: () => React.ReactNode }
    ) => {
      const LazyComponent = ReactModule.lazy(async () => {
        const loaded = await loader();
        const Component =
          typeof loaded === "function"
            ? loaded
            : (loaded.default ?? loaded.Newsletter);
        return { default: Component as React.ComponentType };
      });
      return function DynamicComponent(props: Record<string, unknown>) {
        return ReactModule.createElement(
          ReactModule.Suspense,
          { fallback: options?.loading?.() ?? null },
          ReactModule.createElement(LazyComponent, props as never)
        );
      };
    },
  };
});

afterEach(() => {
  cleanup();
  observers.length = 0;
  vi.unstubAllGlobals();
});

describe("W3-42 deferred newsletter", () => {
  it("loads the newsletter only when its below-fold placeholder approaches the viewport", async () => {
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    render(<DeferredNewsletter variant="human" />);

    expect(
      screen.queryByRole("heading", { name: /Join the Nadeon list/i })
    ).toBeNull();
    expect(screen.getByRole("status", { name: /newsletter/i })).toBeDefined();

    await act(async () => observers[0].trigger());

    expect(
      await screen.findByRole("heading", { name: /Join the Nadeon list/i })
    ).toBeDefined();
    expect(
      screen.getByRole("textbox", { name: /email address/i })
    ).toBeDefined();
  });
});
