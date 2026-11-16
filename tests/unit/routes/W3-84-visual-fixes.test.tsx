// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: () => undefined,
  }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: vi.fn(),
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
  redirect: vi.fn(),
}));

import { HeroCarousel } from "@/app/(pet)/pet/_components/hero-carousel";
import TrackOrderPage from "@/app/(shared)/track/page";
import CartPage from "@/app/(shared)/cart/page";
import AccountSettingsPage from "@/app/(account)/account/settings/page";
import { PaymentMethod } from "@/app/(account)/account/settings/_components/payment-method";
import { DailyRoutine } from "@/app/(human)/human/_components/daily-routine";
import type { ProductCardData } from "@/components/commerce/product-card/product-card-data";

describe("W3-84 Visual Fixes (Headings hierarchy, Unique Newsletter, Settings Panels, Routine Renders)", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  describe("Hierarquia de títulos (Pet hero e Track H1)", () => {
    it("renders Pet Hero title with uppercase display scale matching the board (92px desktop / 44px mobile)", () => {
      render(<HeroCarousel />);

      const heading = screen.getByRole("heading", {
        level: 1,
        name: /more good years together/i,
      });
      expect(heading).toBeDefined();
      expect(heading.className).toContain("font-archivo");
      expect(heading.className).toContain("uppercase");
      expect(heading.className).toContain("text-[44px]");
      expect(heading.className).toContain("lg:text-[92px]");
      expect(heading.className).toContain("font-extrabold");
      expect(heading.className).toContain("leading-[0.95]");
    });

    it("renders Track Order H1 with uppercase display scale matching the board (72px desktop / 38px mobile)", async () => {
      const pageJsx = await TrackOrderPage();
      render(pageJsx);

      const heading = screen.getByRole("heading", {
        level: 1,
        name: /track your order/i,
      });
      expect(heading).toBeDefined();
      expect(heading.className).toContain("font-archivo");
      expect(heading.className).toContain("uppercase");
      expect(heading.className).toContain("text-4xl");
      expect(heading.className).toContain("lg:text-7xl");
      expect(heading.className).toContain("font-extrabold");
      expect(heading.className).toContain("leading-none");
    });
  });

  describe("Newsletter única por rota (/cart e /track)", () => {
    it("renders exactly one newsletter section in /cart (inside Footer, without duplicate)", async () => {
      const pageJsx = await CartPage();
      render(pageJsx);

      const newsletterHeadings = screen.getAllByRole("heading", {
        name: /join the nadeon list/i,
      });
      expect(newsletterHeadings).toHaveLength(1);

      // Verify newsletter email input appears only once on the page
      const emailInputs = screen.getAllByRole("textbox", {
        name: /email address/i,
      });
      expect(emailInputs).toHaveLength(1);
    });

    it("renders exactly one newsletter section in /track (inside Footer, without duplicate)", async () => {
      const pageJsx = await TrackOrderPage();
      render(pageJsx);

      const newsletterHeadings = screen.getAllByRole("heading", {
        name: /join the nadeon list/i,
      });
      expect(newsletterHeadings).toHaveLength(1);

      // Verify newsletter email input appears only once on the page
      const emailInputs = screen.getAllByRole("textbox", {
        name: /email address/i,
      });
      expect(emailInputs).toHaveLength(1);
    });
  });

  describe("Painéis em /account/settings conforme o board", () => {
    it("renders Communication preferences panel with notification toggles", async () => {
      const pageJsx = await AccountSettingsPage();
      render(pageJsx);

      expect(screen.getByText("Communication preferences")).toBeDefined();
      expect(
        screen.getByRole("heading", { name: /notifications/i })
      ).toBeDefined();
      expect(screen.getByText("Email: subscription reminders")).toBeDefined();
      expect(screen.getByText("SMS: order and shipping updates")).toBeDefined();
      expect(screen.getByText("SMS: marketing texts")).toBeDefined();

      // Switches for the 3 notification preferences
      const switches = screen.getAllByRole("switch");
      expect(switches.length).toBeGreaterThanOrEqual(3);
    });

    it("renders Payment method panel with mock data and update button", async () => {
      const pageJsx = await AccountSettingsPage();
      render(pageJsx);

      expect(
        screen.getByRole("heading", { name: /payment method/i })
      ).toBeDefined();
      expect(screen.getByText("•••• 4242")).toBeDefined();
      expect(
        screen.getByText(/expires 08\/28 · used for 2 subscriptions/i)
      ).toBeDefined();
      expect(screen.getByRole("button", { name: /update/i })).toBeDefined();
      expect(
        screen.getByText(
          /card details are stored and processed by shopify payments/i
        )
      ).toBeDefined();
    });

    it("renders empty state without inventing card details when paymentMethod is null", () => {
      render(<PaymentMethod paymentMethod={null} />);

      expect(
        screen.getByRole("heading", { name: /payment method/i })
      ).toBeDefined();
      expect(screen.getByText(/no saved payment method/i)).toBeDefined();
      expect(
        screen.getByRole("button", { name: /add payment method/i })
      ).toBeDefined();
      expect(screen.queryByText(/••••/)).toBeNull();
      expect(screen.queryByText(/visa/i)).toBeNull();
    });
  });

  describe("Daily Routine Glow e Prime neutral placeholders", () => {
    it("uses existing neutral placeholder.svg for Glow and Prime without using another product's artwork", () => {
      const mockProducts: ProductCardData[] = [
        {
          slug: "glow",
          name: "Glow",
          technicalName: "Collagen + NMN",
          line: "human",
          species: null,
          format: "Powders",
          images: ["/renders/placeholder.svg"],
          variants: [
            { id: "var_glow_1", price: { amount: 59, currencyCode: "USD" } },
          ],
          sellingPlans: [{ discountPercentage: 15 }],
          benefits: ["Collagen peptides and NMN"],
          claims: [],
        },
        {
          slug: "prime",
          name: "Prime",
          technicalName: "Pure NAD+ powder",
          line: "human",
          species: null,
          format: "Powders",
          images: [],
          variants: [
            { id: "var_prime_1", price: { amount: 49, currencyCode: "USD" } },
          ],
          sellingPlans: [{ discountPercentage: 15 }],
          benefits: ["Pure NAD+ powder"],
          claims: [],
        },
      ];

      render(<DailyRoutine products={mockProducts} />);

      const images = screen.getAllByRole("img");
      for (const img of images) {
        const src = img.getAttribute("src");
        expect(src).toContain("placeholder.svg");
        expect(src).not.toContain("renew.png");
        expect(src).not.toContain("biohack.png");
      }
    });
  });
});
