import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import React from "react";
import FaqPage, { generateMetadata } from "@/app/(shared)/faq/page";
import {
  FAQ_CATEGORIES,
  FAQ_ENTRIES,
  DESIGN_FAQ_ENTRIES,
  PENDING_FAQ_ANSWER,
  type FaqCategory,
} from "@/app/(shared)/faq/_components/faq-content";
import { FaqBrowser } from "@/app/(shared)/faq/_components/faq-browser";
import {
  StillStuck,
  NotFoundBanner,
} from "@/app/(shared)/faq/_components/faq-help";
import { buildFaqJsonLd } from "@/lib/seo";

describe("W2-26 /faq metadata & SEO", () => {
  it("builds title and canonical path from lib/seo", async () => {
    const meta = await generateMetadata();
    expect(meta.title).toContain("FAQ");
    expect(meta.title).toContain("Nadeon");
    expect(String(meta.alternates?.canonical)).toMatch(/\/faq$/);
  });

  it("builds valid FAQPage JSON-LD schema with only design-approved answers", () => {
    const jsonLd = buildFaqJsonLd(DESIGN_FAQ_ENTRIES);
    expect(jsonLd["@context"]).toBe("https://schema.org");
    expect(jsonLd["@type"]).toBe("FAQPage");
    expect(Array.isArray(jsonLd.mainEntity)).toBe(true);
    expect(jsonLd.mainEntity.length).toBe(DESIGN_FAQ_ENTRIES.length);
    for (const item of jsonLd.mainEntity) {
      expect(item["@type"]).toBe("Question");
      expect(item.acceptedAnswer["@type"]).toBe("Answer");
      expect(item.acceptedAnswer.text).not.toBe(PENDING_FAQ_ANSWER);
    }
    // Verify first design item
    expect(jsonLd.mainEntity[0].name).toBe(
      "What is NMN and how is it different from NAD+?"
    );
    expect(jsonLd.mainEntity[0].acceptedAnswer.text).toContain("NMN");
  });
});

describe("W2-26 /faq categories and entries integrity", () => {
  it("has exactly the 5 design categories", () => {
    const expectedCategories: FaqCategory[] = [
      "products",
      "orders",
      "subscriptions",
      "pets",
      "quality",
    ];
    expect(FAQ_CATEGORIES.map((c) => c.id)).toEqual(expectedCategories);
  });

  it("has 7 questions under products matching the design board", () => {
    const productsEntries = FAQ_ENTRIES.filter(
      (e) => e.category === "products"
    );
    expect(productsEntries.length).toBe(7);
    expect(productsEntries[0].question).toBe(
      "What is NMN and how is it different from NAD+?"
    );
    expect(productsEntries[1].question).toBe(
      "Which formula should I start with?"
    );
    expect(productsEntries[2].question).toBe("How do I take it, and when?");
    expect(productsEntries[3].question).toBe(
      "Can I take BioHack and Renew together?"
    );
    expect(productsEntries[4].question).toBe(
      "Are your products vegan and gluten-free?"
    );
    expect(productsEntries[5].question).toBe(
      "How long until I notice a difference?"
    );
    expect(productsEntries[6].question).toBe("Where are your products made?");
  });

  it("has the expected counts for all categories from design sidebar", () => {
    const counts = FAQ_CATEGORIES.map((cat) => ({
      category: cat.id,
      count: FAQ_ENTRIES.filter((e) => e.category === cat.id).length,
    }));

    expect(counts).toEqual([
      { category: "products", count: 7 },
      { category: "orders", count: 6 },
      { category: "subscriptions", count: 5 },
      { category: "pets", count: 6 },
      { category: "quality", count: 4 },
    ]);
  });

  it("sets pending answer for items without design answers", () => {
    const pendingEntries = FAQ_ENTRIES.filter((e) => !e.hasDesignAnswer);
    expect(pendingEntries.length).toBeGreaterThan(0);
    for (const entry of pendingEntries) {
      expect(entry.answer).toBe(PENDING_FAQ_ANSWER);
    }
  });

  it("keeps design answers for items backed by design boards", () => {
    const designEntries = FAQ_ENTRIES.filter((e) => e.hasDesignAnswer);
    expect(designEntries.length).toBe(DESIGN_FAQ_ENTRIES.length);
    for (const entry of designEntries) {
      expect(entry.answer).not.toBe(PENDING_FAQ_ANSWER);
    }
  });
});

describe("W2-26 /faq server render structure", () => {
  it("renders page with hero, search, accordions, help cards, trust strip, and footer", () => {
    const html = renderToString(React.createElement(FaqPage));

    // Hero content
    expect(html).toContain("Help center");
    expect(html).toContain("Frequently asked questions");
    expect(html).toContain(
      "Quick answers about our formulas, orders, subscriptions, pets and quality."
    );

    // Search bar
    expect(html).toContain('role="search"');
    expect(html).toContain(
      'placeholder="Search questions, e.g. &quot;dose&quot;"'
    );
    expect(html).toContain(">Search<");

    // Categories tabs
    expect(html).toContain('role="tablist"');
    for (const cat of FAQ_CATEGORIES) {
      expect(html).toContain(cat.label.replace("&", "&amp;"));
    }

    // Default active panel (Products)
    expect(html).toContain('role="tabpanel"');
    expect(html).toContain(">Products<");
    expect(html).toContain("7 questions");

    // All 7 products questions rendered in accordion
    for (const entry of FAQ_ENTRIES.filter((e) => e.category === "products")) {
      expect(html).toContain(entry.question);
    }

    // FDA disclaimer below accordion
    expect(html).toContain(
      "*These statements have not been evaluated by the FDA."
    );

    // Desktop sidebar categories box
    expect(html).toContain(">Categories<");

    // Support section cards
    expect(html).toContain("Still stuck?");
    expect(html).toContain("Our team answers within one business day.");
    expect(html).toContain("Didn&#x27;t find your answer?");

    // Action links
    expect(html).toContain('href="/help#contact"');
    expect(html).toContain('href="/track"');

    // JSON-LD output only has design answers
    const scriptMatch = html.match(
      /<script id="ld-faq"[^>]*>([\s\S]*?)<\/script>/
    );
    expect(scriptMatch).not.toBeNull();
    const ldJson = JSON.parse(scriptMatch![1]);
    expect(ldJson["@type"]).toBe("FAQPage");
    expect(JSON.stringify(ldJson)).not.toContain(PENDING_FAQ_ANSWER);
    expect(ldJson.mainEntity.length).toBe(DESIGN_FAQ_ENTRIES.length);
  });

  it("renders FaqBrowser with custom props and children", () => {
    const customHtml = renderToString(
      React.createElement(
        FaqBrowser,
        {
          entries: FAQ_ENTRIES,
          categories: FAQ_CATEGORIES,
          aside: React.createElement(StillStuck),
        },
        React.createElement("h1", null, "Custom Heading")
      )
    );
    expect(customHtml).toContain("Custom Heading");
    expect(customHtml).toContain("Still stuck?");
  });

  it("renders StillStuck component with accessible heading and links", () => {
    const html = renderToString(React.createElement(StillStuck));
    expect(html).toContain('id="faq-still-stuck"');
    expect(html).toContain("Still stuck?");
    expect(html).toContain("Contact us");
    expect(html).toContain("Track an order");
  });

  it("renders NotFoundBanner component with accessible heading and links", () => {
    const html = renderToString(React.createElement(NotFoundBanner));
    expect(html).toContain('id="faq-not-found"');
    expect(html).toContain("Didn&#x27;t find your answer?");
    expect(html).toContain("Contact us");
    expect(html).toContain("Track my order");
  });
});

describe("W2-26 /faq compliance and rules", () => {
  it("does not render design placeholders like [X], $XX, or (example)", () => {
    const html = renderToString(React.createElement(FaqPage));
    expect(html).not.toContain("[X]");
    expect(html).not.toContain("$XX");
    expect(html).not.toContain("(example)");
  });

  it("does not hardcode a dollar price in the page markup", () => {
    const html = renderToString(React.createElement(FaqPage));
    // Extracts main content
    const mainMatch = html.match(/<main[\s\S]*?<\/main>/);
    const mainHtml = mainMatch ? mainMatch[0] : html;
    expect(mainHtml).not.toMatch(/\$\d/);
  });
});
