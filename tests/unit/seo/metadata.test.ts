import { describe, it, expect } from "vitest";
import {
  buildMetadata,
  buildMarketAlternates,
  DEFAULT_SITE_URL,
} from "@/lib/seo/metadata";
import { mockCatalogProvider } from "@/lib/providers/mock/catalog";

describe("SEO Metadata Helper", () => {
  it("buildMarketAlternates generates canonical and regional alternate urls", () => {
    const alternates = buildMarketAlternates("/human/products/biohack");

    expect(alternates).toEqual({
      "en-US": `${DEFAULT_SITE_URL}/human/products/biohack`,
      "en-GB": `${DEFAULT_SITE_URL}/en-gb/human/products/biohack`,
      "en-CA": `${DEFAULT_SITE_URL}/en-ca/human/products/biohack`,
      "en-AU": `${DEFAULT_SITE_URL}/en-au/human/products/biohack`,
      "x-default": `${DEFAULT_SITE_URL}/human/products/biohack`,
    });
  });

  it("buildMarketAlternates normalizes leading and trailing slashes correctly", () => {
    const alternatesWithoutSlash = buildMarketAlternates(
      "human/products/biohack"
    );
    const alternatesWithSlash = buildMarketAlternates(
      "/human/products/biohack"
    );

    expect(alternatesWithoutSlash).toEqual(alternatesWithSlash);
  });

  it("buildMarketAlternates supports custom market mappings with absolute and relative URLs", () => {
    const alternates = buildMarketAlternates("/human/products/biohack", {
      "en-US": "https://nadeonlabs.com",
      "en-EU": "https://eu.nadeonlabs.com",
      "en-SG": "/en-sg",
    });

    expect(alternates["en-US"]).toBe(
      "https://nadeonlabs.com/human/products/biohack"
    );
    expect(alternates["en-EU"]).toBe(
      "https://eu.nadeonlabs.com/human/products/biohack"
    );
    expect(alternates["en-SG"]).toBe(
      "https://nadeonlabs.com/en-sg/human/products/biohack"
    );
  });

  it("buildMetadata constructs complete Next.js metadata for BioHack", async () => {
    const biohack = await mockCatalogProvider.getProduct("biohack");
    expect(biohack).not.toBeNull();

    const metadata = buildMetadata({
      title: biohack!.name,
      description: biohack!.technicalName,
      pathname: `/human/products/${biohack!.slug}`,
      openGraph: {
        images: biohack!.images,
      },
    });

    expect(metadata.metadataBase?.toString()).toBe("https://nadeonlabs.com/");
    expect(metadata.title).toBe("BioHack | Nadeon Labs");
    expect(metadata.description).toBe("Cellular Longevity & NAD+ Optimizer");

    // Canonical and market alternates
    expect(metadata.alternates?.canonical).toBe(
      "https://nadeonlabs.com/human/products/biohack"
    );
    expect(metadata.alternates?.languages).toBeDefined();
    expect(metadata.alternates?.languages?.["en-US"]).toBe(
      "https://nadeonlabs.com/human/products/biohack"
    );
    expect(metadata.alternates?.languages?.["x-default"]).toBe(
      "https://nadeonlabs.com/human/products/biohack"
    );

    // OpenGraph
    expect(metadata.openGraph?.title).toBe("BioHack | Nadeon Labs");
    expect(metadata.openGraph?.description).toBe(
      "Cellular Longevity & NAD+ Optimizer"
    );
    expect(metadata.openGraph?.siteName).toBe("Nadeon Labs");
    expect(metadata.openGraph?.url).toBe(
      "https://nadeonlabs.com/human/products/biohack"
    );
    expect(metadata.openGraph?.images).toEqual(biohack!.images);

    // Robots default
    expect(metadata.robots).toEqual({
      index: true,
      follow: true,
    });
  });

  it("buildMetadata handles custom canonical and custom alternates", () => {
    const metadata = buildMetadata({
      title: "Custom Title",
      description: "Custom Description",
      canonical: "https://nadeonlabs.com/custom-canonical",
      alternates: {
        canonical: "https://nadeonlabs.com/override-canonical",
        languages: {
          "en-US": "https://nadeonlabs.com/override-canonical",
        },
      },
    });

    expect(metadata.alternates?.canonical).toBe(
      "https://nadeonlabs.com/override-canonical"
    );
    expect(metadata.alternates?.languages).toEqual({
      "en-US": "https://nadeonlabs.com/override-canonical",
    });
  });

  it("buildMetadata handles noIndex when specified", () => {
    const metadata = buildMetadata({
      title: "Private Account Area",
      description: "Customer portal",
      pathname: "/account",
      noIndex: true,
    });

    expect(metadata.robots).toEqual({
      index: false,
      follow: false,
    });
  });

  it("buildMetadata does not duplicate site name if already present in title", () => {
    const metadata = buildMetadata({
      title: "Nadeon Labs | Science & Longevity",
      description: "Research backed cellular health",
      pathname: "/science",
    });

    expect(metadata.title).toBe("Nadeon Labs | Science & Longevity");
  });
});
