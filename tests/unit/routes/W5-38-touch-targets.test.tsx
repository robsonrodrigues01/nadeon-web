// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { FooterNav } from "@/components/layout/footer/footer-nav";
import OfferPage from "@/app/(shared)/offers/[oferta]/page";
import ProfessionalsPage from "@/app/(shared)/professionals/page";
import WholesalePage from "@/app/(shared)/wholesale/page";
import AffiliatesPage from "@/app/(shared)/affiliates/page";
import { DEFAULT_MARKET } from "@/lib/market";
import * as visitorMarket from "@/lib/market/visitor";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("W5-38 Minimum 44px touch targets", () => {
  describe("Footer navigation links", () => {
    it("preserves footer link spacing and extends the clickable area", () => {
      render(<FooterNav line="human" />);

      const links = screen.getAllByRole("link");
      expect(links.length).toBeGreaterThan(10);

      // Specific links mentioned in task requirements
      const expectedLabels = [
        "Capsules",
        "Powders",
        "Tinctures",
        "Bundles",
        "Best sellers",
        "Gift cards",
      ];

      for (const label of expectedLabels) {
        const link = screen.getByRole("link", { name: label });
        expect(link.className).toContain("py-1");
        expect(link.className).toContain("relative");
        expect(link.className).toContain("before:inset-x-0");
        expect(link.className).toContain("before:-inset-y-2");
        expect(link.className).toContain("focus-visible:ring-2");
      }

      // Every footer link gets the same enlarged pseudo-element hit area.
      for (const link of links) {
        expect(link.className).toContain("py-1");
        expect(link.className).toContain("before:-inset-y-2");
        expect(link.closest("ul")?.className).toContain("space-y-2");
      }
    });

    it("extends the clickable area on all pet footer navigation links", () => {
      render(<FooterNav line="pet" />);

      const links = screen.getAllByRole("link");
      expect(links.length).toBeGreaterThan(10);

      for (const link of links) {
        expect(link.className).toContain("py-1");
        expect(link.className).toContain("relative");
        expect(link.className).toContain("before:inset-x-0");
        expect(link.className).toContain("before:-inset-y-2");
        expect(link.className).toContain("focus-visible:ring-2");
        expect(link.closest("ul")?.className).toContain("space-y-2");
      }
    });
  });

  describe("<summary> elements", () => {
    it("ensures /offers/[oferta] Full terms summary has min-h-11 and vertical alignment", async () => {
      const page = await OfferPage({
        params: Promise.resolve({ oferta: "model" }),
      });
      const { container } = render(page);

      const summary = container.querySelector("summary");
      expect(summary).toBeTruthy();
      expect(summary?.textContent).toContain("Full terms");
      expect(summary?.className).toContain("min-h-11");
      expect(summary?.className).toContain("items-center");
    });

    it("ensures /professionals FAQ summaries have min-h-11 and vertical alignment", async () => {
      const page = await ProfessionalsPage();
      const { container } = render(page);

      const summaries = container.querySelectorAll("summary");
      expect(summaries.length).toBeGreaterThan(0);
      summaries.forEach((summary) => {
        expect(summary.className).toContain("min-h-11");
        expect(summary.className).toContain("items-center");
      });
    });

    it("ensures /wholesale and /affiliates summaries have min-h-11 and vertical alignment", async () => {
      vi.spyOn(visitorMarket, "getVisitorMarket").mockResolvedValue(
        DEFAULT_MARKET
      );
      const wholesalePage = await WholesalePage();
      const { container: wholesaleContainer } = render(wholesalePage);
      const wholesaleSummaries = wholesaleContainer.querySelectorAll("summary");
      expect(wholesaleSummaries.length).toBeGreaterThan(0);
      wholesaleSummaries.forEach((summary) => {
        expect(summary.className).toContain("min-h-11");
        expect(summary.className).toContain("items-center");
      });

      cleanup();

      const affiliatesPage = await AffiliatesPage();
      const { container: affiliatesContainer } = render(affiliatesPage);
      const affiliatesSummaries =
        affiliatesContainer.querySelectorAll("summary");
      expect(affiliatesSummaries.length).toBeGreaterThan(0);
      affiliatesSummaries.forEach((summary) => {
        expect(summary.className).toContain("min-h-11");
        expect(summary.className).toContain("items-center");
      });
    });
  });
});
