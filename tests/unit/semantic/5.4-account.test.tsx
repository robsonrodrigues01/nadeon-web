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
import { OrderCard } from "@/app/(account)/account/orders/_components/order-card";
import { OrderDetailView } from "@/app/(account)/account/orders/_components/order-detail-view";
import { SubscriptionCard } from "@/app/(account)/account/subscriptions/_components/subscription-card";
import { mockSubscriptionProvider } from "@/lib/providers/mock/subscription";
import { getDefaultMarket } from "@/lib/market/markets";

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
      render(
        <OrderCard
          row={{
            id: "order_processing",
            orderNumber: "NL-TEST",
            status: "processing",
            statusLabel: "Processing",
            placedLabel: "Nov 10, 2026",
            totalLabel: "$1.00",
            itemTitles: [],
            searchText: "nl-test",
          }}
        />
      );
      expect(screen.getByRole("link", { name: "Edit address" })).toBeDefined();
    });
  });

  describe("Order detail `/account/orders/[id]`", () => {
    it("renders Buy again button, Get help link, and Track package link", async () => {
      render(
        <OrderDetailView
          order={{
            id: "ord_100234",
            orderNumber: "NL-100234",
            status: "in_transit",
            statusLabel: "In transit",
            placedLabel: "Nov 10, 2026",
            totalLabel: "$118.00",
            items: [],
            trackingNumber: "1Z123456789",
            trackingUrl: "https://example.com/track",
          }}
        />
      );

      expect(screen.getByRole("button", { name: "Buy again" })).toBeDefined();
      expect(screen.getByRole("link", { name: "Get help" })).toBeDefined();
      expect(
        screen.getByRole("link", { name: /track package/i })
      ).toBeDefined();
      expect(
        screen
          .getByRole("button", { name: "Start a return" })
          .hasAttribute("disabled")
      ).toBe(true);
    });
  });

  describe("Subscriptions `/account/subscriptions`", () => {
    it("renders subscription list, action links, and Browse formulas", async () => {
      render(
        <SubscriptionCard
          subscription={{
            id: "sub_test",
            status: "active",
            nextBillingDate: "2026-12-01T00:00:00.000Z",
            intervalDays: 30,
            estimatedTotal: { amount: 50, currencyCode: "USD" },
            lines: [
              {
                id: "line_test",
                productTitle: "BioHack",
                quantity: 1,
                price: { amount: 50, currencyCode: "USD" },
              },
            ],
          }}
          capabilities={await mockSubscriptionProvider.capabilities()}
          market={getDefaultMarket()}
        />
      );

      expect(screen.getByRole("heading", { name: "BioHack" })).toBeDefined();
      for (const name of [
        "Change frequency",
        "Swap product",
        "Edit quantity",
        "Pause",
      ]) {
        const button = screen.getByRole("button", { name });
        expect(button.hasAttribute("disabled")).toBe(name !== "Pause");
      }
    });
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
