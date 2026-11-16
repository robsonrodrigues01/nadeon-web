/**
 * @vitest-environment jsdom
 */
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  act,
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

const dynamicControl = vi.hoisted(() => ({
  defer: false,
  resolvers: [] as Array<() => void>,
}));

async function resolvePendingDynamicImports() {
  await act(async () => {
    dynamicControl.resolvers.splice(0).forEach((resolve) => resolve());
    await Promise.resolve();
  });
}

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
        const loaded = await (dynamicControl.defer
          ? new Promise<
              | React.ComponentType
              | { default?: React.ComponentType }
              | Record<string, React.ComponentType>
            >((resolve) => {
              dynamicControl.resolvers.push(() => {
                void loader().then(resolve);
              });
            })
          : loader());
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
  dynamicControl.defer = false;
  dynamicControl.resolvers.length = 0;
  useCartDrawerStore.getState().close();
  document.cookie = "nadeon_first_visit_popup=; path=/; max-age=0";
  document.cookie = "nadeon_consent=; path=/; max-age=0";
});

describe("W3-42 deferred overlays", () => {
  it.each([["cart drawer", "Loading cart", () => openCartDrawer("human")]])(
    "traps focus and closes the pending %s with Escape",
    async (_, label, open) => {
      dynamicControl.defer = true;

      function Harness() {
        return (
          <>
            <button type="button" onClick={open as () => void}>
              Open overlay
            </button>
            <button type="button">Background action</button>
            <DeferredCartDrawer theme="human" />
          </>
        );
      }

      render(<Harness />);
      const trigger = screen.getByRole("button", { name: "Open overlay" });
      trigger.focus();
      fireEvent.click(trigger);

      const pendingDialog = await screen.findByRole("dialog", { name: label });
      expect(pendingDialog.getAttribute("aria-modal")).toBe("true");
      expect(document.activeElement).toBe(pendingDialog);
      const tabEvent = new KeyboardEvent("keydown", {
        key: "Tab",
        bubbles: true,
        cancelable: true,
      });
      pendingDialog.dispatchEvent(tabEvent);
      expect(tabEvent.defaultPrevented).toBe(true);
      expect(document.activeElement).toBe(pendingDialog);
      fireEvent.keyDown(pendingDialog, { key: "Escape" });

      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
      expect(document.activeElement).toBe(trigger);
      await resolvePendingDynamicImports();
    }
  );

  it("traps focus and closes pending cookie settings with Escape", async () => {
    dynamicControl.defer = true;
    render(
      <ConsentProvider forceBannerOpen={false}>
        <CookieBanner forceVisible />
        <button type="button">Background action</button>
      </ConsentProvider>
    );
    const trigger = screen.getByRole("button", { name: "Settings" });
    trigger.focus();
    fireEvent.click(trigger);

    const pendingDialog = await screen.findByRole("dialog", {
      name: "Loading cookie settings",
    });
    expect(pendingDialog.getAttribute("aria-modal")).toBe("true");
    expect(document.activeElement).toBe(pendingDialog);
    const tabEvent = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      cancelable: true,
    });
    pendingDialog.dispatchEvent(tabEvent);
    expect(tabEvent.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(pendingDialog);
    fireEvent.keyDown(pendingDialog, { key: "Escape" });

    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(document.activeElement).toBe(trigger);
    await resolvePendingDynamicImports();
  });

  it("traps focus and closes the pending welcome popup with Escape", async () => {
    dynamicControl.defer = true;

    function Harness() {
      const consent = useConsent();
      return (
        <>
          <button type="button" onClick={consent.acceptAll}>
            Accept all
          </button>
          <button type="button">Background action</button>
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
    trigger.focus();
    fireEvent.click(trigger);

    const pendingDialog = await screen.findByRole("dialog", {
      name: "Loading welcome offer",
    });
    expect(pendingDialog.getAttribute("aria-modal")).toBe("true");
    expect(document.activeElement).toBe(pendingDialog);
    const tabEvent = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      cancelable: true,
    });
    pendingDialog.dispatchEvent(tabEvent);
    expect(tabEvent.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(pendingDialog);
    fireEvent.keyDown(pendingDialog, { key: "Escape" });

    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(document.activeElement).toBe(trigger);
    await resolvePendingDynamicImports();
  });

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
