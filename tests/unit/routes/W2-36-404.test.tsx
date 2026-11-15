import React from "react";
import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import NotFound, { metadata } from "@/app/not-found";

describe("W2-36: 404 route (app/not-found.tsx)", () => {
  describe("metadata", () => {
    it("builds 404 metadata with noIndex", () => {
      expect(metadata.title).toContain("404");
      expect(metadata.title).toContain("Nadeon");
      expect(metadata.robots).toEqual(
        expect.objectContaining({
          index: false,
          follow: false,
        })
      );
    });
  });

  describe("page structure and semantics", () => {
    it("renders semantic landmarks: announcement bar, header, main landmark, and footer", () => {
      const html = renderToString(<NotFound />);
      expect(html).toContain('id="main-content"');
      expect(html).toContain("<header");
      expect(html).toContain("<footer");
      expect(html).toContain("<main");
    });

    it("renders the 404 hero with paw print, heading 1, and subtitle", () => {
      const html = renderToString(<NotFound />);
      expect(html).toContain("<h1");
      expect(html).toMatch(/this page wandered off/i);
      expect(html).toMatch(
        /we followed the paw prints but could not find it\. it may have moved, or the link has a typo\./i
      );
      expect(html).toContain('aria-label="404 error"');
    });

    it("renders an accessible search form submitting to /search", () => {
      const html = renderToString(<NotFound />);
      expect(html).toContain('role="search"');
      expect(html).toContain('action="/search"');
      expect(html).toContain('name="q"');
      expect(html).toContain('type="search"');
      expect(html).toContain("Search chews, oils, articles");
      expect(html).toContain("<button");
      expect(html).toContain("Search</button>");
    });

    it("renders primary and secondary call-to-action buttons", () => {
      const html = renderToString(<NotFound />);
      expect(html).toContain('href="/pet"');
      expect(html).toContain("Back to Pet home");
      expect(html).toContain('href="/pet/dogs"');
      expect(html).toContain("Shop dog chews");
    });

    it("renders 'Popular with the pack' section with four category cards and links", () => {
      const html = renderToString(<NotFound />);
      expect(html).toContain("TRY ONE OF THESE");
      expect(html).toContain("<h2");
      expect(html).toContain("Popular with the pack");

      // Card 1: Dogs
      expect(html).toContain('href="/pet/dogs"');
      expect(html).toContain("Soft chews, treats and powder");
      expect(html).toContain("More Good Years");
      expect(html).toContain("Senior · NMN 75 mg");

      // Card 2: Cats
      expect(html).toContain('href="/pet/cats"');
      expect(html).toContain("Joint drops");
      expect(html).toContain("High Jump");

      // Card 3: Horses
      expect(html).toContain('href="/pet/horses"');
      expect(html).toContain("Joint top-dress");
      expect(html).toContain("Long Stride");
      expect(html).toContain("Horse joint");

      // Card 4: Find the right formula
      expect(html).toContain('href="/pet/quiz"');
      expect(html).toContain("Find the right formula");
      expect(html).toContain("Take the 60-second quiz");
      expect(html).toContain("Still Sharp");
      expect(html).toContain("Calm · NMN 50 mg");
    });

    it("renders 'Looking for Nadeon Human?' cross-line banner with navigation pills", () => {
      const html = renderToString(<NotFound />);
      expect(html).toContain("Looking for Nadeon Human?");
      expect(html).toContain(
        "NMN and NAD+ capsules, powders and tinctures for people."
      );

      const humanLinks = [
        { label: "Shop Human →", href: "/human" },
        { label: "BioHack →", href: "/human/products/biohack" },
        { label: "Science →", href: "/science" },
        { label: "Take the quiz →", href: "/human/quiz" },
        { label: "Help center →", href: "/help" },
      ];

      for (const item of humanLinks) {
        expect(html).toContain(`href="${item.href}"`);
        expect(html).toContain(item.label);
      }
      expect(html).not.toContain('href="/journal"');
    });

    it("displays FDA disclaimer and pet/equine regulatory warnings", () => {
      const html = renderToString(<NotFound />);
      expect(html).toContain(
        "These statements have not been evaluated by the Food and Drug Administration"
      );
      expect(html).toContain("For animal use only");
      expect(html).toContain(
        "Equine products: not for horses intended for food"
      );
    });

    it("contains no unreplaced placeholders", () => {
      const html = renderToString(<NotFound />);
      expect(html).not.toContain("[X]");
      expect(html).not.toContain("$XX");
      expect(html).not.toContain("(example)");
    });
  });
});
