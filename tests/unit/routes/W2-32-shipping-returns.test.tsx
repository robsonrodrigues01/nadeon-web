import { describe, it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

// Páginas de servidor leem o cookie de mercado; o teste não tem requisição.
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => undefined }),
}));

import ShippingReturnsPage, {
  metadata,
} from "@/app/(shared)/shipping-returns/page";
import { formatFreeShippingThreshold } from "@/lib/market";
import { DEFAULT_MARKET } from "@/lib/market/markets";

describe("W2-32: /shipping-returns route", () => {
  describe("metadata", () => {
    it("exports SEO metadata with canonical path /shipping-returns", () => {
      expect(metadata.title).toContain("Nadeon");
      expect(metadata.title).toMatch(/shipping/i);
      expect(metadata.alternates?.canonical).toBe(
        "https://nadeonlabs.com/shipping-returns"
      );
    });
  });

  describe("page structure & content", () => {
    async function getHtml(): Promise<string> {
      const element = await ShippingReturnsPage();
      return renderToStaticMarkup(element);
    }

    it("has one h1 with the route heading", async () => {
      const html = await getHtml();
      expect(html).toMatch(
        /<h1[^>]*>[\s\S]*?Shipping &amp; returns[\s\S]*?<\/h1>/i
      );
    });

    it("renders breadcrumb navigation linking to home and help", async () => {
      const html = await getHtml();
      expect(html).toContain('aria-label="Breadcrumb"');
      expect(html).toMatch(/href="\/"[^>]*>Home<\/a>/);
      expect(html).toMatch(/href="\/help"[^>]*>Help<\/a>/);
    });

    it("exposes all jump anchor links with matching section IDs", async () => {
      const html = await getHtml();
      expect(html).toContain('aria-label="Jump to section"');
      const expectedSections = [
        "rates",
        "tracking",
        "subscriptions",
        "returns",
        "damaged",
        "faq",
      ];

      for (const id of expectedSections) {
        expect(html).toContain(`href="#${id}"`);
        expect(html).toContain(`id="${id}"`);
      }
    });

    it("displays dynamic free shipping threshold from lib/market", async () => {
      const html = await getHtml();
      const threshold = formatFreeShippingThreshold(DEFAULT_MARKET, "human");
      expect(threshold).toBeTruthy();
      expect(html).toContain(threshold!);
    });

    it("renders the 60-day money-back guarantee highlight and promise", async () => {
      const html = await getHtml();
      expect(html).toContain("60-day guarantee");
      expect(html).toMatch(/try it for up to 60 days/i);
    });

    it("renders the shipping zones table with contiguous US, express and international", async () => {
      const html = await getHtml();
      expect(html).toContain("Zones and delivery times");
      expect(html).toContain("Contiguous US");
      expect(html).toContain("Express");
      expect(html).toContain("Alaska and Hawaii");
      expect(html).toContain("International");
    });

    it("renders 4 return steps and eligibility cards", async () => {
      const html = await getHtml();
      expect(html).toContain("Returns and refunds");
      expect(html).toContain("Start a return");
      expect(html).toContain("Tell us why");
      expect(html).toContain("Send it back");
      expect(html).toContain("Get your refund");
      expect(html).toContain("Eligible");
      expect(html).toContain("Not eligible");
    });

    it("renders damaged item resolution steps and contact links", async () => {
      const html = await getHtml();
      expect(html).toContain("Damaged, missing or wrong item?");
      expect(html).toContain("Take a photo");
      expect(html).toContain("We make it right");
      expect(html).toContain("Report a problem");
    });

    it("renders FAQ details with 7 shipping questions", async () => {
      const html = await getHtml();
      expect(html).toContain("Shipping questions");
      const questions = [
        "When will my order ship?",
        "Do you ship outside the US?",
        "Can I change my address after ordering?",
        "How do I return a subscription order?",
        "What if my package says delivered but I do not have it?",
        "How long do refunds take to show up?",
        "Do you charge restocking fees?",
      ];

      for (const question of questions) {
        expect(html).toContain(question);
      }
      expect(html).toContain("<details");
      expect(html).toContain("<summary");
    });

    it("does not contain unreplaced design placeholder brackets, XX or (example)", async () => {
      const html = await getHtml();
      expect(html).not.toContain("[X]");
      expect(html).not.toContain("$XX");
      expect(html).not.toContain("(example)");
      expect(html).not.toContain("[date placeholder]");
      expect(html).not.toContain("[confirm]");
      expect(html).not.toContain("[placeholder]");
    });
  });
});
