import { dom } from "./W1-02-dom-setup";
import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import type { Campaign, CampaignConfig } from "@/lib/contracts/campaign";

describe("AnnouncementBar (W1-02)", () => {
  beforeEach(() => {
    vi.useRealTimers();
    dom.window.document.body.innerHTML = "";
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Human standard mode", () => {
    it("renders default Human announcement bar with semantic container and navigation", () => {
      render(<AnnouncementBar line="human" />);

      // Verify semantic <aside> banner container
      const banner = screen.getByRole("complementary", {
        name: /Store Announcement/i,
      });
      expect(banner).toBeDefined();

      // Verify semantic <nav> element
      const nav = screen.getByRole("navigation", {
        name: /Announcement notices/i,
      });
      expect(nav).toBeDefined();

      // Verify the three distinct messages
      expect(screen.getByText(/FREE SHIPPING OVER \$75/i)).toBeDefined();
      expect(screen.getByText(/SUBSCRIBE & SAVE 15%/i)).toBeDefined();
      expect(screen.getByText(/SAVE 15% ON SUBSCRIPTIONS/i)).toBeDefined();
      expect(screen.getByText(/TAKE THE QUIZ/i)).toBeDefined();

      // Verify links exist as semantic <a> elements
      const links = screen.getAllByRole("link");
      expect(links.length).toBeGreaterThanOrEqual(3);

      const quizLink = screen.getByRole("link", { name: /TAKE THE QUIZ/i });
      expect(quizLink.getAttribute("href")).toBe("/human/quiz");

      const shippingLink = screen.getByRole("link", {
        name: /FREE SHIPPING OVER \$75/i,
      });
      expect(shippingLink.getAttribute("href")).toBe("/faq");

      const subscribeLink = screen.getByRole("link", {
        name: /SUBSCRIBE & SAVE 15%/i,
      });
      expect(subscribeLink.getAttribute("href")).toBe("/account/subscriptions");
    });

    it("supports custom href overrides", () => {
      render(
        <AnnouncementBar
          line="human"
          shippingHref="/custom-shipping"
          subscribeHref="/custom-subscribe"
          quizHref="/custom-quiz"
        />
      );

      const quizLink = screen.getByRole("link", { name: /TAKE THE QUIZ/i });
      expect(quizLink.getAttribute("href")).toBe("/custom-quiz");

      const shippingLink = screen.getByRole("link", {
        name: /FREE SHIPPING OVER \$75/i,
      });
      expect(shippingLink.getAttribute("href")).toBe("/custom-shipping");

      const subscribeLink = screen.getByRole("link", {
        name: /SUBSCRIBE & SAVE 15%/i,
      });
      expect(subscribeLink.getAttribute("href")).toBe("/custom-subscribe");
    });
  });

  describe("Pet standard mode", () => {
    it("renders default Pet announcement bar with correct copy and links", () => {
      render(<AnnouncementBar line="pet" />);

      expect(screen.getByText(/FREE SHIPPING OVER \$49/i)).toBeDefined();
      expect(screen.getByText(/SUBSCRIBE & SAVE 15%/i)).toBeDefined();
      expect(screen.getByText(/SAVE 15% ON SUBSCRIPTIONS/i)).toBeDefined();
      expect(screen.getByText(/FIND THE RIGHT FORMULA/i)).toBeDefined();

      const formulaLink = screen.getByRole("link", {
        name: /FIND THE RIGHT FORMULA/i,
      });
      expect(formulaLink.getAttribute("href")).toBe("/pet/quiz");

      const shippingLink = screen.getByRole("link", {
        name: /FREE SHIPPING OVER \$49/i,
      });
      expect(shippingLink.getAttribute("href")).toBe("/faq");
    });
  });

  describe("Black Friday mode via CampaignConfig", () => {
    const activeBlackFridayCampaign: Campaign = {
      id: "black-friday",
      name: "Black Friday Sale",
      isActive: true,
      bannerText: "BLACK FRIDAY · UP TO 25% OFF",
      countdownEnd: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(), // 48 hours ahead
    };

    it("renders Black Friday announcement bar when campaign is active", async () => {
      const mockCampaignConfig: CampaignConfig = {
        getActiveCampaign: vi.fn().mockResolvedValue(activeBlackFridayCampaign),
      };

      await act(async () => {
        render(
          <AnnouncementBar line="human" campaignConfig={mockCampaignConfig} />
        );
      });

      // Semantic container
      const banner = screen.getByRole("complementary", {
        name: /Black Friday Announcement/i,
      });
      expect(banner).toBeDefined();

      expect(screen.getByText(/BLACK FRIDAY · UP TO 25% OFF/i)).toBeDefined();
      expect(screen.getByText(/ENDS IN/i)).toBeDefined();
      expect(screen.getByText(/Shop the sale/i)).toBeDefined();

      const saleLink = screen.getByRole("link", {
        name: /Shop the sale/i,
      });
      expect(saleLink.getAttribute("href")).toBe("/human");
    });

    it("renders Black Friday Pet variant with Pet sale link", async () => {
      const mockCampaignConfig: CampaignConfig = {
        getActiveCampaign: vi.fn().mockResolvedValue(activeBlackFridayCampaign),
      };

      await act(async () => {
        render(
          <AnnouncementBar line="pet" campaignConfig={mockCampaignConfig} />
        );
      });

      expect(screen.getByText(/BLACK FRIDAY · UP TO 25% OFF/i)).toBeDefined();

      const saleLink = screen.getByRole("link", {
        name: /Shop the sale/i,
      });
      expect(saleLink.getAttribute("href")).toBe("/pet");
    });

    it("allows forcing Black Friday mode via forceBlackFriday prop", () => {
      render(
        <AnnouncementBar
          line="human"
          forceBlackFriday={true}
          saleHref="/special-sale"
        />
      );

      expect(screen.getByText(/BLACK FRIDAY · UP TO 25% OFF/i)).toBeDefined();
      const saleLink = screen.getByRole("link", {
        name: /Shop the sale/i,
      });
      expect(saleLink.getAttribute("href")).toBe("/special-sale");
    });

    it("falls back to standard announcement bar when campaign is null or inactive", async () => {
      const inactiveConfig: CampaignConfig = {
        getActiveCampaign: vi.fn().mockResolvedValue(null),
      };

      await act(async () => {
        render(
          <AnnouncementBar line="human" campaignConfig={inactiveConfig} />
        );
      });

      expect(screen.queryByText(/BLACK FRIDAY · UP TO 25% OFF/i)).toBeNull();
      expect(screen.getByText(/FREE SHIPPING OVER \$75/i)).toBeDefined();
    });
  });

  describe("Countdown Timer Behavior", () => {
    it("updates countdown chips correctly over time", () => {
      vi.useFakeTimers();
      const fixedBaseTime = new Date("2026-11-20T12:00:00Z").getTime();
      vi.setSystemTime(fixedBaseTime);

      // Target is 3 days, 14 hours, 22 minutes, 5 seconds ahead
      const targetTime =
        fixedBaseTime + (3 * 24 * 3600 + 14 * 3600 + 22 * 60 + 5) * 1000;

      const campaign: Campaign = {
        id: "black-friday",
        name: "Black Friday",
        isActive: true,
        countdownEnd: new Date(targetTime).toISOString(),
      };

      render(<AnnouncementBar line="human" campaign={campaign} />);

      // Semantic timer role
      const timer = screen.getByRole("timer");
      expect(timer).toBeDefined();

      // Initial chip values
      expect(screen.getByText("03")).toBeDefined();
      expect(screen.getByText("14")).toBeDefined();
      expect(screen.getByText("22")).toBeDefined();
      expect(screen.getByText("05")).toBeDefined();

      // Advance by 1 second
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      // 05 should now be 04
      expect(screen.getByText("04")).toBeDefined();

      vi.useRealTimers();
    });
  });
});
