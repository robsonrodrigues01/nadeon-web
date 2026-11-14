import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { act } from "@testing-library/react";
import {
  Footer,
  NewsletterForm,
  CrossLineCard,
  FooterNav,
  HUMAN_FOOTER_COLUMNS,
  PET_FOOTER_COLUMNS,
  REGULATORY_STATEMENTS,
  PAYMENT_METHODS,
  SOCIAL_LINKS,
  LEGAL_LINKS,
} from "@/components/layout/footer";
import W104Section from "@/app/(shared)/dev/kit/sections/W1-04";
import { formsProvider } from "@/lib/providers";

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;");
}

describe("W1-04 Footer Component Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Semantic HTML Structure", () => {
    it("renders with semantic <footer> and role='contentinfo'", () => {
      const html = renderToString(<Footer line="human" />);
      expect(html).toContain("<footer");
      expect(html).toContain('role="contentinfo"');
      expect(html).toContain("</footer>");
    });

    it("renders navigation within semantic <nav> with accessible aria-label", () => {
      const html = renderToString(<FooterNav line="human" />);
      expect(html).toContain("<nav");
      expect(html).toContain('aria-label="Footer navigation"');
      expect(html).toContain("</nav>");
    });

    it("renders columns and links inside semantic <ul> and <li> elements", () => {
      const html = renderToString(<FooterNav line="human" />);
      expect(html).toContain("<ul");
      expect(html).toContain("<li");
      expect(html).toContain("Capsules");
      expect(html).toContain('href="/human/shop/capsules"');
    });

    it("renders newsletter form with semantic <form>, <label>, <input> and <button>", () => {
      const html = renderToString(<NewsletterForm line="human" />);
      expect(html).toContain("<form");
      expect(html).toContain("<label");
      expect(html).toContain('for="footer-newsletter-email-human"');
      expect(html).toContain("Email address");
      expect(html).toContain("<input");
      expect(html).toContain('id="footer-newsletter-email-human"');
      expect(html).toContain('type="email"');
      expect(html).toContain('placeholder="Email address"');
      expect(html).toContain("<button");
      expect(html).toContain('type="submit"');
      expect(html).toContain("Get 10% off");
    });
  });

  describe("Human Line Variant", () => {
    it("renders Human newsletter title and cross-promo card to Pet", () => {
      const html = renderToString(<Footer line="human" />);

      // Newsletter title for Human
      expect(html).toContain("Join the Nadeon list");

      // Cross promo card points to Pet
      expect(html).toContain("Nadeon Pet");
      expect(html).toContain("NMN for dogs, cats &amp; horses");
      expect(html).toContain('href="/pet"');
    });

    it("renders all four Human navigation columns with expected links", () => {
      const html = renderToString(<Footer line="human" />);

      // Column titles
      expect(html).toContain("Shop");
      expect(html).toContain("Learn");
      expect(html).toContain("Help");
      expect(html).toContain("Company");

      // Human Shop links
      for (const col of HUMAN_FOOTER_COLUMNS) {
        for (const link of col.links) {
          expect(html).toContain(escapeHtml(link.label));
          expect(html).toContain(`href="${link.href}"`);
        }
      }
    });

    it("renders standard FDA compliance notice without animal/equine warning", () => {
      const html = renderToString(<Footer line="human" />);
      expect(html).toContain(REGULATORY_STATEMENTS.human);
      expect(html).not.toContain("For animal use only");
      expect(html).not.toContain(
        "Equine products: not for horses intended for food"
      );
    });
  });

  describe("Pet Line Variant", () => {
    it("renders Pet newsletter title and cross-promo card to Human", () => {
      const html = renderToString(<Footer line="pet" />);

      // Newsletter title for Pet
      expect(html).toContain("Join the pack");

      // Cross promo card points to Human
      expect(html).toContain("Nadeon Human");
      expect(html).toContain("Capsules, powders &amp; tinctures");
      expect(html).toContain('href="/human"');
    });

    it("renders all four Pet navigation columns with expected links", () => {
      const html = renderToString(<Footer line="pet" />);

      for (const col of PET_FOOTER_COLUMNS) {
        for (const link of col.links) {
          expect(html).toContain(escapeHtml(link.label));
          expect(html).toContain(`href="${link.href}"`);
        }
      }
    });

    it("renders FDA compliance notice with mandatory animal and equine warnings", () => {
      const html = renderToString(<Footer line="pet" />);
      expect(html).toContain("For animal use only");
      expect(html).toContain(
        "Equine products: not for horses intended for food"
      );
    });
  });

  describe("Cross-Line Promo Card Component", () => {
    it("renders accessible link and iconography for Human line targeting Pet", () => {
      const html = renderToString(<CrossLineCard line="human" />);
      expect(html).toContain('href="/pet"');
      expect(html).toContain("Nadeon Pet");
      expect(html).toContain("NMN for dogs, cats &amp; horses");
      expect(html).toContain(
        'aria-label="Switch to Nadeon Pet: NMN for dogs, cats and horses"'
      );
    });

    it("renders accessible link and gradient title for Pet line targeting Human", () => {
      const html = renderToString(<CrossLineCard line="pet" />);
      expect(html).toContain('href="/human"');
      expect(html).toContain("Nadeon Human");
      expect(html).toContain("Capsules, powders &amp; tinctures");
      expect(html).toContain(
        'aria-label="Switch to Nadeon Human: Capsules, powders and tinctures"'
      );
    });
  });

  describe("Social Media Links & Payment Badges", () => {
    it("renders all social links with accessible aria-labels and targets", () => {
      const html = renderToString(<Footer line="human" />);

      for (const social of SOCIAL_LINKS) {
        expect(html).toContain(social.label);
        expect(html).toContain(`href="${social.href}"`);
        expect(html).toContain(`aria-label="Follow Nadeon on ${social.name}"`);
        expect(html).toContain('target="_blank"');
        expect(html).toContain('rel="noopener noreferrer"');
      }
    });

    it("renders accepted payment badges", () => {
      const html = renderToString(<Footer line="human" />);
      expect(html).toContain('aria-label="Accepted payment methods"');

      for (const badge of PAYMENT_METHODS) {
        expect(html).toContain(badge);
      }
    });

    it("renders legal links (Terms, Privacy, Do Not Sell My Info, Accessibility)", () => {
      const html = renderToString(<Footer line="human" />);

      for (const legal of LEGAL_LINKS) {
        expect(html).toContain(legal.label);
        expect(html).toContain(`href="${legal.href}"`);
      }
    });

    it("renders big brand display wordmark for desktop and mobile", () => {
      const html = renderToString(<Footer line="human" />);
      expect(html).toContain("Nadeon Labs");
      expect(html).toContain("Nadeon");
    });
  });

  describe("Forms Provider Integration", () => {
    it("subscribes human email via formsProvider contract", async () => {
      const subscribeSpy = vi.spyOn(formsProvider, "subscribe");

      let result;
      await act(async () => {
        result = await formsProvider.subscribe(
          "newsletter-human",
          "human.fan@example.com",
          true
        );
      });

      expect(subscribeSpy).toHaveBeenCalledWith(
        "newsletter-human",
        "human.fan@example.com",
        true
      );
      expect(result).toHaveProperty("success", true);
    });

    it("subscribes pet email via formsProvider contract", async () => {
      const subscribeSpy = vi.spyOn(formsProvider, "subscribe");

      let result;
      await act(async () => {
        result = await formsProvider.subscribe(
          "newsletter-pet",
          "pet.lover@example.com",
          true
        );
      });

      expect(subscribeSpy).toHaveBeenCalledWith(
        "newsletter-pet",
        "pet.lover@example.com",
        true
      );
      expect(result).toHaveProperty("success", true);
    });
  });

  describe("Dev Kit Showcase Section W1-04", () => {
    it("renders as a semantic <section> with both Human and Pet variants", () => {
      const html = renderToString(<W104Section />);
      expect(html).toContain("<section");
      expect(html).toContain('id="section-w1-04"');
      expect(html).toContain("Footer · Human &amp; Pet Variants");
      expect(html).toContain("Human Line Footer Variant");
      expect(html).toContain("Pet Line Footer Variant");
      expect(html).toContain("Join the Nadeon list");
      expect(html).toContain("Join the pack");
    });
  });
});
