// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import {
  FirstVisitPopup,
  FIRST_VISIT_POPUP_COOKIE_NAME,
} from "@/components/layout/popup";
import { ConsentProvider } from "@/lib/consent";
import * as newsletterActions from "@/components/brand/newsletter/actions";
import W109Section from "@/app/(shared)/dev/kit/sections/W1-09";

describe("W1-09 First Visit 10% Popup Component", () => {
  let subscribeSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Reset cookies
    let cookieStore = "";
    Object.defineProperty(document, "cookie", {
      configurable: true,
      get: () => cookieStore,
      set: (val: string) => {
        const [pair] = val.split(";");
        const [k] = pair.split("=");
        if (
          val.includes("max-age=0") ||
          val.includes("expires=Thu, 01 Jan 1970")
        ) {
          cookieStore = cookieStore
            .split("; ")
            .filter((c) => !c.startsWith(`${k}=`))
            .join("; ");
        } else {
          const parts = cookieStore
            ? cookieStore.split("; ").filter((c) => !c.startsWith(`${k}=`))
            : [];
          parts.push(pair);
          cookieStore = parts.join("; ");
        }
      },
    });

    subscribeSpy = vi
      .spyOn(newsletterActions, "subscribeNewsletter")
      .mockResolvedValue({
        success: true,
        id: "sub_popup_123",
        message: "Subscribed successfully",
      });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  describe("Semantic HTML & Dialog Structure", () => {
    it("renders as an accessible modal dialog with heading, description, form, input, button, and close actions", () => {
      render(
        <ConsentProvider forceBannerOpen={false}>
          <FirstVisitPopup forceOpen variant="human" />
        </ConsentProvider>
      );

      // Dialog container semantics
      const dialog = screen.getByRole("dialog");
      expect(dialog).toBeDefined();
      expect(dialog.getAttribute("aria-modal")).toBe("true");

      // Accessible heading
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toBeDefined();
      expect(heading.textContent).toMatch(/10% off/i);
      expect(heading.textContent).toMatch(/your first order/i);

      // Accessible kicker
      expect(screen.getByText(/welcome to nadeon/i)).toBeDefined();

      // Semantic input and associated label
      const input = screen.getByLabelText(/email address/i);
      expect(input).toBeDefined();
      expect(input.tagName).toBe("INPUT");
      expect(input.getAttribute("type")).toBe("email");
      expect(input.getAttribute("placeholder")).toBe("Email address");

      // Semantic submit button
      const submitBtn = screen.getByRole("button", { name: /get 10% off/i });
      expect(submitBtn).toBeDefined();
      expect(submitBtn.getAttribute("type")).toBe("submit");

      // Semantic dismiss action
      const dismissBtn = screen.getByRole("button", { name: /no thanks/i });
      expect(dismissBtn).toBeDefined();
      expect(dismissBtn.getAttribute("type")).toBe("button");

      // Semantic close button
      const closeBtn = screen.getByRole("button", { name: /close dialog/i });
      expect(closeBtn).toBeDefined();

      // Semantic legal navigation links
      const termsLink = screen.getByRole("link", { name: /terms/i });
      expect(termsLink.getAttribute("href")).toBe("/legal/terms");

      const privacyLink = screen.getByRole("link", { name: /privacy policy/i });
      expect(privacyLink.getAttribute("href")).toBe("/legal/privacy");
    });

    it("renders Pet variant with appropriate branding and list target", () => {
      render(
        <ConsentProvider forceBannerOpen={false}>
          <FirstVisitPopup forceOpen variant="pet" />
        </ConsentProvider>
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).toBeDefined();
      expect(dialog.getAttribute("data-theme")).toBe("pet");
      expect(screen.getByText(/welcome to nadeon pet/i)).toBeDefined();
    });
  });

  describe("Keyboard Navigation & Focus Trapping", () => {
    it("dismisses the dialog when Escape key is pressed", () => {
      const onDismiss = vi.fn();
      render(
        <ConsentProvider forceBannerOpen={false}>
          <FirstVisitPopup forceOpen variant="human" onDismiss={onDismiss} />
        </ConsentProvider>
      );

      expect(screen.getByRole("dialog")).toBeDefined();
      fireEvent.keyDown(window, { key: "Escape" });
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it("dismisses the dialog when close button is clicked", () => {
      const onDismiss = vi.fn();
      render(
        <ConsentProvider forceBannerOpen={false}>
          <FirstVisitPopup forceOpen variant="human" onDismiss={onDismiss} />
        </ConsentProvider>
      );

      const closeBtn = screen.getByRole("button", { name: /close dialog/i });
      fireEvent.click(closeBtn);
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it("dismisses the dialog when 'No thanks' is clicked", () => {
      const onDismiss = vi.fn();
      render(
        <ConsentProvider forceBannerOpen={false}>
          <FirstVisitPopup forceOpen variant="human" onDismiss={onDismiss} />
        </ConsentProvider>
      );

      const noThanksBtn = screen.getByRole("button", { name: /no thanks/i });
      fireEvent.click(noThanksBtn);
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it("traps focus between first and last interactive elements when Tab is pressed", () => {
      render(
        <ConsentProvider forceBannerOpen={false}>
          <FirstVisitPopup forceOpen variant="human" />
        </ConsentProvider>
      );

      const dialog = screen.getByRole("dialog");
      const focusable = dialog.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      expect(focusable.length).toBeGreaterThan(1);

      const firstEl = focusable[0];
      const lastEl = focusable[focusable.length - 1];

      // Tab on last element cycles back to first
      lastEl.focus();
      expect(document.activeElement).toBe(lastEl);
      fireEvent.keyDown(dialog, { key: "Tab", shiftKey: false });
      expect(document.activeElement).toBe(firstEl);

      // Shift+Tab on first element cycles back to last
      firstEl.focus();
      expect(document.activeElement).toBe(firstEl);
      fireEvent.keyDown(dialog, { key: "Tab", shiftKey: true });
      expect(document.activeElement).toBe(lastEl);
    });
  });

  describe("Server Action & Submission", () => {
    it("submits Human email to subscribeNewsletter action with 'newsletter-human' and consent=true", async () => {
      render(
        <ConsentProvider forceBannerOpen={false}>
          <FirstVisitPopup forceOpen variant="human" />
        </ConsentProvider>
      );

      const input = screen.getByLabelText(/email address/i);
      fireEvent.change(input, { target: { value: "human.guest@example.com" } });

      const submitBtn = screen.getByRole("button", { name: /get 10% off/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(subscribeSpy).toHaveBeenCalledWith(
          "newsletter-human",
          "human.guest@example.com",
          true
        );
      });

      // Shows confirmation message
      await waitFor(() => {
        expect(screen.getByText(/thank you for subscribing/i)).toBeDefined();
      });
    });

    it("submits Pet email to subscribeNewsletter action with 'newsletter-pet'", async () => {
      render(
        <ConsentProvider forceBannerOpen={false}>
          <FirstVisitPopup forceOpen variant="pet" />
        </ConsentProvider>
      );

      const input = screen.getByLabelText(/email address/i);
      fireEvent.change(input, { target: { value: "pet.guest@example.com" } });

      const submitBtn = screen.getByRole("button", { name: /get 10% off/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(subscribeSpy).toHaveBeenCalledWith(
          "newsletter-pet",
          "pet.guest@example.com",
          true
        );
      });
    });

    it("validates invalid email before submission", async () => {
      render(
        <ConsentProvider forceBannerOpen={false}>
          <FirstVisitPopup forceOpen variant="human" />
        </ConsentProvider>
      );

      const input = screen.getByLabelText(/email address/i);
      fireEvent.change(input, { target: { value: "invalid-email" } });

      const submitBtn = screen.getByRole("button", { name: /get 10% off/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeDefined();
        expect(subscribeSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe("Consent and Cookie Gating", () => {
    it("does NOT display popup if consent banner is still open", () => {
      render(
        <ConsentProvider forceBannerOpen={true}>
          <FirstVisitPopup variant="human" />
        </ConsentProvider>
      );

      expect(screen.queryByRole("dialog")).toBeNull();
    });

    it("does NOT display popup if visitor already has the popup cookie", () => {
      document.cookie = `${FIRST_VISIT_POPUP_COOKIE_NAME}=dismissed; path=/`;

      render(
        <ConsentProvider
          forceBannerOpen={false}
          initialRecord={{
            version: "1.0",
            timestamp: new Date().toISOString(),
            country: "US",
            explicit: true,
            preferences: { necessary: true, analytics: true, marketing: true },
          }}
        >
          <FirstVisitPopup variant="human" />
        </ConsentProvider>
      );

      expect(screen.queryByRole("dialog")).toBeNull();
    });

    it("displays popup when consent is resolved and no cookie is present", async () => {
      render(
        <ConsentProvider
          forceBannerOpen={false}
          initialRecord={{
            version: "1.0",
            timestamp: new Date().toISOString(),
            country: "US",
            explicit: true,
            preferences: { necessary: true, analytics: true, marketing: true },
          }}
        >
          <FirstVisitPopup variant="human" />
        </ConsentProvider>
      );

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeDefined();
      });
    });

    it("writes dismissal cookie when dismissed via 'No thanks'", async () => {
      render(
        <ConsentProvider
          forceBannerOpen={false}
          initialRecord={{
            version: "1.0",
            timestamp: new Date().toISOString(),
            country: "US",
            explicit: true,
            preferences: { necessary: true, analytics: true, marketing: true },
          }}
        >
          <FirstVisitPopup variant="human" />
        </ConsentProvider>
      );

      const noThanksBtn = await screen.findByRole("button", {
        name: /no thanks/i,
      });
      fireEvent.click(noThanksBtn);

      expect(document.cookie).toContain(
        `${FIRST_VISIT_POPUP_COOKIE_NAME}=dismissed`
      );
    });
  });

  describe("Dev Kit Showcase Section (W1-09.tsx)", () => {
    it("renders section with title, interactive triggers and both Human and Pet previews", () => {
      render(
        <ConsentProvider forceBannerOpen={false}>
          <W109Section />
        </ConsentProvider>
      );

      // Section title
      expect(
        screen.getByRole("heading", { name: /first visit 10% discount popup/i })
      ).toBeDefined();

      // Interactive controls
      expect(
        screen.getByRole("button", { name: /launch human modal/i })
      ).toBeDefined();
      expect(
        screen.getByRole("button", { name: /launch pet modal/i })
      ).toBeDefined();
      expect(
        screen.getByRole("button", { name: /clear visitor cookie/i })
      ).toBeDefined();

      // Check presence of both inline dialog previews
      const dialogs = screen.getAllByRole("dialog");
      expect(dialogs.length).toBe(2);

      // Verify theme attributes
      expect(dialogs[0].getAttribute("data-theme")).toBe("human");
      expect(dialogs[1].getAttribute("data-theme")).toBe("pet");
    });

    it("launches live Human overlay when trigger button is clicked", () => {
      render(
        <ConsentProvider forceBannerOpen={false}>
          <W109Section />
        </ConsentProvider>
      );

      const launchBtn = screen.getByRole("button", {
        name: /launch human modal/i,
      });
      fireEvent.click(launchBtn);

      // Now 3 dialogs exist: 2 inline and 1 modal overlay
      const dialogs = screen.getAllByRole("dialog");
      expect(dialogs.length).toBe(3);
    });
  });
});
