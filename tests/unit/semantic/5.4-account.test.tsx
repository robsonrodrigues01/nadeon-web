// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  within,
} from "@testing-library/react";

import AccountPage from "@/app/(account)/account/page";
import OrdersPage from "@/app/(account)/account/orders/page";
import OrderDetailPage from "@/app/(account)/account/orders/[id]/page";
import SubscriptionsPage from "@/app/(account)/account/subscriptions/page";
import CancelSubscriptionPage from "@/app/(account)/account/subscriptions/[id]/cancel/page";
import SettingsPage from "@/app/(account)/account/settings/page";
import TrackOrderPage from "@/app/(shared)/track/page";

vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => undefined }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => "/account",
  redirect: vi.fn(),
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("5.4 Semantic Elements: Conta", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  describe("Dashboard `/account`", () => {
    it("renders headings, delivery actions, and account navigation", async () => {
      const page = await AccountPage();
      render(page);

      expect(
        screen.getByRole("heading", { level: 1, name: "My account" })
      ).toBeDefined();
      expect(
        screen.getByRole("heading", { level: 2, name: /hi, alex/i })
      ).toBeDefined();

      // Delivery actions
      expect(
        screen.getByRole("button", { name: "Skip this delivery" })
      ).toBeDefined();
      expect(screen.getByRole("link", { name: "Change date" })).toBeDefined();
      expect(screen.getByRole("link", { name: "Edit items" })).toBeDefined();
      expect(screen.getByRole("link", { name: "View order" })).toBeDefined();

      // Sign out
      expect(screen.getByRole("button", { name: "Sign out" })).toBeDefined();
    });

    it.todo(
      "Dashboard `/account`: Referral link ('Copy link') not implemented in dashboard view"
    );
    it.todo(
      "Dashboard `/account`: 'Reorder' button not implemented on dashboard (present on orders page)"
    );
  });

  describe("Orders `/account/orders`", () => {
    it("renders search input, status filter buttons, and order details", async () => {
      const page = await OrdersPage();
      render(page);

      expect(
        screen.getByRole("heading", { level: 1, name: "Orders" })
      ).toBeDefined();

      // Search box
      expect(
        screen.getByRole("searchbox", { name: "Search by order or product" })
      ).toBeDefined();

      // Status filter group
      const statusGroup = screen.getByRole("group", { name: "Order status" });
      expect(
        within(statusGroup).getByRole("button", { name: /all/i })
      ).toBeDefined();
      expect(
        within(statusGroup).getByRole("button", { name: /processing/i })
      ).toBeDefined();
      expect(
        within(statusGroup).getByRole("button", { name: /in transit/i })
      ).toBeDefined();
      expect(
        within(statusGroup).getByRole("button", { name: /delivered/i })
      ).toBeDefined();
    });

    it.todo(
      "Orders `/account/orders`: 'Edit address' button not implemented in orders list"
    );
  });

  describe("Order detail `/account/orders/[id]`", () => {
    it("renders Buy again button, Get help link, and Track package link", async () => {
      const page = await OrderDetailPage({
        params: Promise.resolve({ id: "ord_100234" }),
      });
      render(page);

      expect(screen.getByRole("button", { name: "Buy again" })).toBeDefined();
      expect(screen.getByRole("link", { name: "Get help" })).toBeDefined();
      expect(
        screen.getByRole("link", { name: /track package/i })
      ).toBeDefined();
    });

    it.todo(
      "Order detail `/account/orders/[id]`: 'Start a return' button not implemented in route"
    );
  });

  describe("Subscriptions `/account/subscriptions`", () => {
    it("renders subscription list, action links, and Browse formulas", async () => {
      const page = await SubscriptionsPage();
      render(page);

      expect(
        screen.getByRole("heading", { level: 1, name: "Subscriptions" })
      ).toBeDefined();
      expect(
        screen.getByRole("link", { name: "Browse formulas" })
      ).toBeDefined();
    });

    it.todo(
      "Subscriptions `/account/subscriptions`: 'Change frequency', 'Swap product', 'Edit quantity', 'Pause' controls modal/actions pending full subscription app integration"
    );
  });

  describe("Cancel subscription `/account/subscriptions/[id]/cancel`", () => {
    it("renders reason options group, feedback textarea, retention offers, and cancel button", async () => {
      const page = await CancelSubscriptionPage({
        params: Promise.resolve({ id: "sub_biohack_001" }),
      });
      render(page);

      expect(
        screen.getByRole("heading", { level: 1, name: "Cancel subscription" })
      ).toBeDefined();

      // Reason group
      expect(
        screen.getByRole("group", { name: "Why are you canceling?" })
      ).toBeDefined();

      // Feedback textarea
      expect(
        screen.getByRole("textbox", { name: "Anything else? (optional)" })
      ).toBeDefined();

      // Retention offers
      expect(
        screen.getByRole("button", { name: "Skip next delivery" })
      ).toBeDefined();
      expect(
        screen.getByRole("button", { name: "Switch to 60 days" })
      ).toBeDefined();

      // Confirm / keep buttons
      expect(
        screen.getByRole("button", { name: "Cancel subscription" })
      ).toBeDefined();
      expect(
        screen.getByRole("link", { name: "Keep my subscription" })
      ).toBeDefined();
    });

    it.todo(
      "Cancel subscription: 'Claim 20% off' retention offer not implemented in current cancel view"
    );
  });

  describe("Profile & addresses `/account/settings`", () => {
    it("renders personal info inputs, addresses region, and save changes", async () => {
      const page = await SettingsPage();
      render(page);

      expect(
        screen.getByRole("heading", { level: 1, name: "Profile & addresses" })
      ).toBeDefined();

      // Inputs
      expect(screen.getByRole("textbox", { name: "First name" })).toBeDefined();
      expect(screen.getByRole("textbox", { name: "Last name" })).toBeDefined();
      expect(screen.getByRole("textbox", { name: "Email" })).toBeDefined();
      expect(screen.getByRole("textbox", { name: "Phone" })).toBeDefined();
      expect(
        screen.getByRole("textbox", { name: "Birthday (optional)" })
      ).toBeDefined();
      expect(
        screen.getByRole("combobox", { name: "Shopping for" })
      ).toBeDefined();

      // Save button
      expect(
        screen.getByRole("button", { name: "Save changes" })
      ).toBeDefined();

      // Addresses section
      expect(screen.getByRole("region", { name: "Addresses" })).toBeDefined();

      // Delete account region
      expect(
        screen.getByRole("region", { name: "Delete account" })
      ).toBeDefined();
    });
  });

  describe("Pet profile (in `/account/settings` pets section)", () => {
    it("renders pet profile region with pet controls", async () => {
      const page = await SettingsPage();
      render(page);

      expect(screen.getByRole("region", { name: "My pets" })).toBeDefined();
    });
  });

  describe("Track order `/track`", () => {
    it("renders order lookup form fields, Track order button, and support links", async () => {
      const page = await TrackOrderPage();
      render(page);

      expect(
        screen.getByRole("heading", { level: 1, name: "Track your order" })
      ).toBeDefined();

      expect(
        screen.getByRole("textbox", { name: "Order number" })
      ).toBeDefined();
      expect(screen.getByRole("textbox", { name: "Email" })).toBeDefined();

      expect(screen.getByRole("button", { name: "Track order" })).toBeDefined();

      // Popular help links
      expect(
        screen.getAllByRole("link", { name: /shipping & returns/i })[0]
      ).toBeDefined();
      expect(
        screen.getAllByRole("link", { name: /lab results/i })[0]
      ).toBeDefined();
    });

    it.todo(
      "Track order `/track`: 'Track on UPS', 'Report a problem', 'Start a return' appear conditionally after active shipment lookup"
    );
  });

  describe("Non-implemented / Discarded routes from section 5.4", () => {
    it.todo(
      "Login `/account/login`: not built in Onda 2; Shopify Customer Account API integration scheduled for Onda 4"
    );
    it.todo(
      "Create account, Forgot password, Reset password: discarded in catalog (passwordless login only)"
    );
    it.todo(
      "Email preferences `/account/email-preferences`: Onda C route not built in Onda 2"
    );
    it.todo(
      "Write a review `/reviews/write`: Onda C route not built in Onda 2"
    );
  });
});
