import { describe, it, expect } from "vitest";
import {
  buildProductJsonLd,
  buildOfferJsonLd,
  buildOrganizationJsonLd,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
} from "@/lib/seo/jsonld";
import { mockCatalogProvider } from "@/lib/providers/mock/catalog";

describe("JSON-LD Helpers", () => {
  it("buildOfferJsonLd converts Money contract into schema.org Offer", () => {
    const offer = buildOfferJsonLd({
      price: { amount: 65, currencyCode: "USD" },
      sku: "NAD-HUM-BIO-1",
      name: "1 Jar (30 days)",
      url: "https://nadeonlabs.com/human/products/biohack",
      priceValidUntil: "2027-12-31",
    });

    expect(offer).toEqual({
      "@type": "Offer",
      name: "1 Jar (30 days)",
      sku: "NAD-HUM-BIO-1",
      price: 65,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: "https://nadeonlabs.com/human/products/biohack",
      priceValidUntil: "2027-12-31",
    });
  });

  it("buildProductJsonLd generates valid schema.org Product with Money offers for BioHack", async () => {
    const biohack = await mockCatalogProvider.getProduct("biohack");
    expect(biohack).not.toBeNull();

    const jsonLd = buildProductJsonLd(biohack!, {
      url: "https://nadeonlabs.com/human/products/biohack",
    });

    expect(jsonLd["@context"]).toBe("https://schema.org");
    expect(jsonLd["@type"]).toBe("Product");
    expect(jsonLd.name).toBe("BioHack");
    expect(jsonLd.sku).toBe("NAD-HUM-BIO-1");
    expect(jsonLd.description).toBe(
      "Replenishes cellular NAD+ levels. Activates sirtuins and mitochondrial biogenesis. Supports mental clarity and sustained daily energy"
    );
    expect(jsonLd.brand).toEqual({
      "@type": "Brand",
      name: "Nadeon",
    });
    expect(jsonLd.image).toEqual([
      "https://nadeonlabs.com/images/products/biohack-front.webp",
      "https://nadeonlabs.com/images/products/biohack-back.webp",
    ]);

    // Offers verification
    expect(Array.isArray(jsonLd.offers)).toBe(true);
    expect(jsonLd.offers).toHaveLength(3);

    const firstOffer = jsonLd.offers[0];
    expect(firstOffer["@type"]).toBe("Offer");
    expect(firstOffer.name).toBe("1 Jar (30 days)");
    expect(firstOffer.price).toBe(65);
    expect(firstOffer.priceCurrency).toBe("USD");
    expect(firstOffer.sku).toBe("NAD-HUM-BIO-1");
    expect(firstOffer.availability).toBe("https://schema.org/InStock");
    expect(firstOffer.url).toBe(
      "https://nadeonlabs.com/human/products/biohack"
    );

    const secondOffer = jsonLd.offers[1];
    expect(secondOffer.price).toBe(118);
    expect(secondOffer.priceCurrency).toBe("USD");
    expect(secondOffer.sku).toBe("NAD-HUM-BIO-2");

    const thirdOffer = jsonLd.offers[2];
    expect(thirdOffer.price).toBe(165);
    expect(thirdOffer.priceCurrency).toBe("USD");
    expect(thirdOffer.sku).toBe("NAD-HUM-BIO-3");

    // Fields without information in mock/design must be null
    expect(jsonLd.aggregateRating).toBeNull();
    expect(jsonLd.review).toBeNull();
  });

  it("buildProductJsonLd handles product without benefits by falling back to technicalName", async () => {
    const biohack = await mockCatalogProvider.getProduct("biohack");
    expect(biohack).not.toBeNull();

    const productWithoutBenefits = {
      ...biohack!,
      benefits: [],
    };

    const jsonLd = buildProductJsonLd(productWithoutBenefits);
    expect(jsonLd.description).toBe("Cellular Longevity & NAD+ Optimizer");
  });

  it("buildOrganizationJsonLd generates Organization schema with null for unspecified fields", () => {
    const org = buildOrganizationJsonLd();

    expect(org["@context"]).toBe("https://schema.org");
    expect(org["@type"]).toBe("Organization");
    expect(org.name).toBe("Nadeon Labs");
    expect(org.url).toBe("https://nadeonlabs.com");
    expect(org.logo).toBeNull(); // No logo file specified in design yet
    expect(org.sameAs).toEqual(["https://instagram.com/nadeonlabs"]);
    expect(org.contactPoint).toBeNull();
  });

  it("buildOrganizationJsonLd supports overriding options", () => {
    const org = buildOrganizationJsonLd({
      name: "Nadeon Pet Care",
      url: "https://nadeonlabs.com/pet",
      logo: "https://nadeonlabs.com/logo.png",
      sameAs: ["https://twitter.com/nadeonlabs"],
    });

    expect(org.name).toBe("Nadeon Pet Care");
    expect(org.url).toBe("https://nadeonlabs.com/pet");
    expect(org.logo).toBe("https://nadeonlabs.com/logo.png");
    expect(org.sameAs).toEqual(["https://twitter.com/nadeonlabs"]);
  });

  it("buildBreadcrumbJsonLd generates BreadcrumbList schema with relative and null urls", () => {
    const breadcrumbs = buildBreadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Human Line", url: "/human" },
      { name: "BioHack", url: "/human/products/biohack" },
      { name: "Current Step", url: null },
    ]);

    expect(breadcrumbs["@context"]).toBe("https://schema.org");
    expect(breadcrumbs["@type"]).toBe("BreadcrumbList");
    expect(breadcrumbs.itemListElement).toHaveLength(4);

    expect(breadcrumbs.itemListElement[0]).toEqual({
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://nadeonlabs.com/",
    });
    expect(breadcrumbs.itemListElement[1]).toEqual({
      "@type": "ListItem",
      position: 2,
      name: "Human Line",
      item: "https://nadeonlabs.com/human",
    });
    expect(breadcrumbs.itemListElement[2]).toEqual({
      "@type": "ListItem",
      position: 3,
      name: "BioHack",
      item: "https://nadeonlabs.com/human/products/biohack",
    });
    expect(breadcrumbs.itemListElement[3]).toEqual({
      "@type": "ListItem",
      position: 4,
      name: "Current Step",
      item: null,
    });
  });

  it("buildFaqJsonLd generates FAQPage schema matching BioHack faqs", async () => {
    const biohack = await mockCatalogProvider.getProduct("biohack");
    expect(biohack).not.toBeNull();

    const faqSchema = buildFaqJsonLd(biohack!.faq);

    expect(faqSchema["@context"]).toBe("https://schema.org");
    expect(faqSchema["@type"]).toBe("FAQPage");
    expect(faqSchema.mainEntity).toHaveLength(2);

    expect(faqSchema.mainEntity[0]).toEqual({
      "@type": "Question",
      name: "When should I take BioHack?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Take 2 capsules each morning with a glass of water for optimal cellular circadian alignment.",
      },
    });

    expect(faqSchema.mainEntity[1]).toEqual({
      "@type": "Question",
      name: "Is BioHack third-party lab tested?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Every lot is independently verified for purity, potency, heavy metals, and microbiological safety.",
      },
    });
  });
});
