// @vitest-environment jsdom
import React, { useState } from "react";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { CartDrawer } from "@/components/commerce/cart-drawer";
import { CookieSettingsModal } from "@/components/layout/cookie-banner";
import { FirstVisitPopup } from "@/components/layout/popup";
import { ConsentProvider } from "@/lib/consent";
import type { Cart } from "@/lib/providers/client";

afterEach(cleanup);

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory()
      ? sourceFiles(target)
      : target.endsWith(".tsx")
        ? [target]
        : [];
  });
}

describe("W3-21 keyboard accessibility", () => {
  it("places a visible-on-focus skip link first in the root body", () => {
    const source = readFileSync(
      path.join(process.cwd(), "app/layout.tsx"),
      "utf8"
    );
    const skipLink = readFileSync(
      path.join(process.cwd(), "components/layout/skip-link.tsx"),
      "utf8"
    );
    expect(source).toMatch(/<body[^>]*>\s*<SkipLink\s*\/>/);
    expect(skipLink).toContain('href="#main-content"');
    expect(skipLink).toMatch(/focus:not-sr-only/);
  });

  it("gives every main landmark a focusable main-content target", () => {
    const appDirectory = path.join(process.cwd(), "app");
    const missing = sourceFiles(appDirectory).flatMap((file) => {
      const source = readFileSync(file, "utf8");
      return [...source.matchAll(/<main\b([^>]*)>/g)]
        .filter(
          ([, attributes]) =>
            !/\bid=["']main-content["']/.test(attributes ?? "") ||
            !/\btabIndex=\{?-1\}?/.test(attributes ?? "")
        )
        .map(() => path.relative(process.cwd(), file));
    });
    expect(missing).toEqual([]);
  });

  it("traps cookie-settings focus and restores its trigger after Escape", async () => {
    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <ConsentProvider forceBannerOpen={false}>
          <button type="button" onClick={() => setOpen(true)}>
            Open cookie settings
          </button>
          <CookieSettingsModal isOpen={open} onClose={() => setOpen(false)} />
        </ConsentProvider>
      );
    }
    render(<Harness />);
    const trigger = screen.getByRole("button", {
      name: "Open cookie settings",
    });
    trigger.focus();
    fireEvent.click(trigger);

    const dialog = screen.getByRole("dialog");
    const focusable = dialog.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    last.focus();
    fireEvent.keyDown(window, { key: "Tab" });
    expect(document.activeElement).toBe(first);
    first.focus();
    fireEvent.keyDown(window, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(last);

    fireEvent.keyDown(window, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });

  it("returns focus to the cart trigger after Escape", async () => {
    const emptyCart: Cart = {
      id: "empty",
      lines: [],
      discountCodes: [],
      subtotalPrice: { amount: 0, currencyCode: "USD" },
      totalDiscount: { amount: 0, currencyCode: "USD" },
      totalPrice: { amount: 0, currencyCode: "USD" },
      totalQuantity: 0,
      checkoutUrl: "https://checkout.example.test",
    };
    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Open cart
          </button>
          <CartDrawer
            isOpen={open}
            onClose={() => setOpen(false)}
            cart={emptyCart}
          />
        </>
      );
    }
    render(<Harness />);
    const trigger = screen.getByRole("button", { name: "Open cart" });
    trigger.focus();
    fireEvent.click(trigger);
    const dialog = await screen.findByRole("dialog");
    const focusable = dialog.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    last.focus();
    fireEvent.keyDown(dialog, { key: "Tab" });
    expect(document.activeElement).toBe(first);
    first.focus();
    fireEvent.keyDown(dialog, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(last);

    fireEvent.keyDown(dialog, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });

  it("returns focus to the popup trigger after Escape", async () => {
    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Open popup
          </button>
          <ConsentProvider forceBannerOpen={false}>
            <FirstVisitPopup isOpen={open} onDismiss={() => setOpen(false)} />
          </ConsentProvider>
        </>
      );
    }
    render(<Harness />);
    const trigger = screen.getByRole("button", { name: "Open popup" });
    trigger.focus();
    fireEvent.click(trigger);
    await screen.findByRole("dialog");
    fireEvent.keyDown(window, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });

  it("returns focus to main content when the popup trigger was removed", async () => {
    function Harness() {
      const [open, setOpen] = useState(false);
      const [consentAccepted, setConsentAccepted] = useState(false);
      return (
        <>
          {!consentAccepted && (
            <button
              type="button"
              onClick={() => {
                setConsentAccepted(true);
                setOpen(true);
              }}
            >
              Accept all
            </button>
          )}
          <main id="main-content" tabIndex={-1}>
            Page content
          </main>
          <ConsentProvider forceBannerOpen={false}>
            <FirstVisitPopup isOpen={open} onDismiss={() => setOpen(false)} />
          </ConsentProvider>
        </>
      );
    }

    render(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: "Accept all" }));
    await screen.findByRole("dialog");
    fireEvent.keyDown(window, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(document.activeElement).toBe(
      document.getElementById("main-content")
    );
  });
});
