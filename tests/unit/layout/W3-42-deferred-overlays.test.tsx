/**
 * @vitest-environment jsdom
 */
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { DeferredCartDrawer } from "@/components/commerce/cart-drawer/deferred-cart-drawer";
import { CookieBanner } from "@/components/layout/cookie-banner/cookie-banner";
import { DeferredFirstVisitPopup } from "@/components/layout/popup/deferred-first-visit-popup";
import { ConsentProvider, useConsent } from "@/lib/consent";
import {
  openCartDrawer,
  useCartDrawerStore,
} from "@/components/commerce/cart-drawer";

vi.mock("next/dynamic", async () => {
  const ReactModule = await import("react");
  return {
    default: (
      loader: () => Promise<
        React.ComponentType | Record<string, React.ComponentType>
      >,
      options?: { loading?: () => React.ReactNode }
    ) => {
      const LazyComponent = ReactModule.lazy(async () => {
        const loaded = await loader();
        const Component =
          typeof loaded === "function"
            ? loaded
            : (loaded.default ?? Object.values(loaded)[0]);
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
  useCartDrawerStore.getState().close();
  document.cookie = "nadeon_first_visit_popup=; path=/; max-age=0";
  document.cookie = "nadeon_consent=; path=/; max-age=0";
});

describe("W3-42 deferred overlays", () => {
  it("loads the cart drawer on first open and restores focus after Escape", async () => {
    function Harness() {
      return (
        <>
          <button type="button" onClick={() => openCartDrawer("human")}>
            Open cart
          </button>
          <DeferredCartDrawer theme="human" />
        </>
      );
    }

    render(<Harness />);
    const trigger = screen.getByRole("button", { name: "Open cart" });
    expect(screen.queryByRole("dialog")).toBeNull();

    trigger.focus();
    fireEvent.click(trigger);
    const dialog = await screen.findByRole("dialog");
    fireEvent.keyDown(dialog, { key: "Escape" });

    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });

  it("loads cookie settings only after Settings and keeps Escape focus restoration", async () => {
    render(
      <ConsentProvider forceBannerOpen={false}>
        <CookieBanner forceVisible />
      </ConsentProvider>
    );
    const trigger = screen.getByRole("button", { name: "Settings" });
    expect(screen.queryByRole("dialog")).toBeNull();

    trigger.focus();
    fireEvent.click(trigger);
    expect(await screen.findByRole("dialog")).toBeDefined();
    fireEvent.keyDown(window, { key: "Escape" });

    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });

  it("loads the welcome popup only after consent is resolved", async () => {
    function Harness() {
      const consent = useConsent();
      return (
        <>
          <button type="button" onClick={consent.acceptAll}>
            Accept all
          </button>
          <DeferredFirstVisitPopup variant="human" />
        </>
      );
    }

    render(
      <ConsentProvider forceBannerOpen={false}>
        <Harness />
      </ConsentProvider>
    );
    const trigger = screen.getByRole("button", { name: "Accept all" });
    expect(screen.queryByRole("dialog")).toBeNull();

    trigger.focus();
    fireEvent.click(trigger);
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeDefined();
    fireEvent.keyDown(window, { key: "Escape" });

    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });
});
