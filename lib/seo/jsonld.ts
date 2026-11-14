import type { Product, Money, ProductFaq } from "@/lib/contracts/catalog";
import { DEFAULT_SITE_URL } from "./metadata";

export interface OfferJsonLdOptions {
  price: Money;
  sku?: string;
  name?: string;
  url?: string;
  availability?: string;
  priceValidUntil?: string | null;
}

export interface SchemaOffer {
  "@type": "Offer";
  name: string | null;
  sku: string | null;
  price: number;
  priceCurrency: string;
  availability: string;
  url: string | null;
  priceValidUntil: string | null;
}

export function buildOfferJsonLd({
  price,
  sku,
  name,
  url,
  availability = "https://schema.org/InStock",
  priceValidUntil = null,
}: OfferJsonLdOptions): SchemaOffer {
  return {
    "@type": "Offer",
    name: name ?? null,
    sku: sku ?? null,
    price: price.amount,
    priceCurrency: price.currencyCode,
    availability,
    url: url ?? null,
    priceValidUntil,
  };
}

export interface ProductJsonLdOptions {
  url?: string;
  brandName?: string;
  priceValidUntil?: string | null;
}

export interface SchemaProduct {
  "@context": "https://schema.org";
  "@type": "Product";
  name: string;
  sku: string | null;
  description: string | null;
  brand: {
    "@type": "Brand";
    name: string;
  };
  image: string[];
  offers: SchemaOffer[];
  aggregateRating: null;
  review: null;
}

export function buildProductJsonLd(
  product: Product,
  options?: ProductJsonLdOptions
): SchemaProduct {
  const brandName = options?.brandName || "Nadeon";
  const url =
    options?.url ||
    `${DEFAULT_SITE_URL}/${product.line}/products/${product.slug}`;

  const description =
    product.benefits && product.benefits.length > 0
      ? product.benefits.join(". ")
      : product.technicalName || null;

  const images =
    product.images && product.images.length > 0
      ? product.images.map((img) =>
          img.startsWith("http://") || img.startsWith("https://")
            ? img
            : `${DEFAULT_SITE_URL}${img.startsWith("/") ? "" : "/"}${img}`
        )
      : [];

  const offers: SchemaOffer[] = product.variants.map((variant) =>
    buildOfferJsonLd({
      price: variant.price,
      sku: variant.sku,
      name: variant.title,
      url,
      priceValidUntil: options?.priceValidUntil ?? null,
    })
  );

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.variants[0]?.sku || null,
    description,
    brand: {
      "@type": "Brand",
      name: brandName,
    },
    image: images,
    offers,
    // Fields without data in design remain explicit null
    aggregateRating: null,
    review: null,
  };
}

export interface OrganizationJsonLdOptions {
  name?: string;
  url?: string;
  logo?: string | null;
  sameAs?: string[] | null;
  contactPoint?: unknown | null;
}

export interface SchemaOrganization {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  url: string;
  logo: string | null;
  sameAs: string[] | null;
  contactPoint: unknown | null;
}

export function buildOrganizationJsonLd(
  options?: OrganizationJsonLdOptions
): SchemaOrganization {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: options?.name || "Nadeon Labs",
    url: options?.url || DEFAULT_SITE_URL,
    logo: options?.logo ?? null,
    sameAs: options?.sameAs ?? ["https://instagram.com/nadeonlabs"],
    contactPoint: options?.contactPoint ?? null,
  };
}

export interface BreadcrumbItem {
  name: string;
  url?: string | null;
}

export interface SchemaBreadcrumbListItem {
  "@type": "ListItem";
  position: number;
  name: string;
  item: string | null;
}

export interface SchemaBreadcrumbList {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: SchemaBreadcrumbListItem[];
}

export function buildBreadcrumbJsonLd(
  items: BreadcrumbItem[]
): SchemaBreadcrumbList {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => {
      const resolvedItemUrl = item.url
        ? item.url.startsWith("http://") || item.url.startsWith("https://")
          ? item.url
          : `${DEFAULT_SITE_URL}${item.url.startsWith("/") ? "" : "/"}${item.url}`
        : null;

      return {
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: resolvedItemUrl,
      };
    }),
  };
}

export interface SchemaFaqItem {
  "@type": "Question";
  name: string;
  acceptedAnswer: {
    "@type": "Answer";
    text: string;
  };
}

export interface SchemaFaqPage {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: SchemaFaqItem[];
}

export function buildFaqJsonLd(
  faqs: Array<ProductFaq | { question: string; answer: string }>
): SchemaFaqPage {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
