import type { Metadata } from "next";

export const DEFAULT_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://nadeonlabs.com";
export const DEFAULT_SITE_NAME = "Nadeon Labs";
export const DEFAULT_DESCRIPTION = "Cellular Longevity for Humans and Pets";

export const DEFAULT_MARKETS: Record<string, string> = {
  "en-US": "",
  "en-GB": "/en-gb",
  "en-CA": "/en-ca",
  "en-AU": "/en-au",
  "x-default": "",
};

export function buildMarketAlternates(
  pathname: string = "",
  customMarkets?: Record<string, string>
): Record<string, string> {
  const cleanPath = pathname
    ? pathname.startsWith("/")
      ? pathname
      : `/${pathname}`
    : "";

  if (customMarkets) {
    const alternates: Record<string, string> = {};
    for (const [locale, baseOrPrefix] of Object.entries(customMarkets)) {
      if (
        baseOrPrefix.startsWith("http://") ||
        baseOrPrefix.startsWith("https://")
      ) {
        const trimmed = baseOrPrefix.replace(/\/+$/, "");
        alternates[locale] = trimmed.endsWith(cleanPath)
          ? trimmed
          : `${trimmed}${cleanPath}`;
      } else {
        const prefix = baseOrPrefix
          ? `/${baseOrPrefix.replace(/^\/+|\/+$/g, "")}`
          : "";
        alternates[locale] = `${DEFAULT_SITE_URL}${prefix}${cleanPath}`;
      }
    }
    return alternates;
  }

  const alternates: Record<string, string> = {};
  for (const [locale, prefix] of Object.entries(DEFAULT_MARKETS)) {
    alternates[locale] = `${DEFAULT_SITE_URL}${prefix}${cleanPath}`;
  }
  return alternates;
}

export interface BuildMetadataOptions {
  title: string;
  description?: string;
  pathname?: string;
  canonical?: string;
  openGraph?: {
    title?: string;
    description?: string;
    images?:
      | Array<{ url: string; width?: number; height?: number; alt?: string }>
      | string[];
    type?: "website" | "article";
    siteName?: string;
    locale?: string;
    url?: string;
  };
  marketAlternates?: Record<string, string>;
  alternates?: {
    canonical?: string;
    languages?: Record<string, string>;
  };
  noIndex?: boolean;
}

export function buildMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  pathname = "",
  canonical,
  openGraph,
  marketAlternates,
  alternates: customAlternates,
  noIndex = false,
}: BuildMetadataOptions): Metadata {
  const cleanPath = pathname
    ? pathname.startsWith("/")
      ? pathname
      : `/${pathname}`
    : "";

  const canonicalUrl =
    canonical ||
    (cleanPath ? `${DEFAULT_SITE_URL}${cleanPath}` : DEFAULT_SITE_URL);

  const formattedTitle =
    title.includes(DEFAULT_SITE_NAME) || title.includes("Nadeon")
      ? title
      : `${title} | ${DEFAULT_SITE_NAME}`;

  const resolvedLanguages =
    customAlternates?.languages ||
    buildMarketAlternates(cleanPath, marketAlternates);

  return {
    metadataBase: new URL(DEFAULT_SITE_URL),
    title: formattedTitle,
    description,
    alternates: {
      canonical: customAlternates?.canonical || canonicalUrl,
      languages: resolvedLanguages,
    },
    openGraph: {
      title: openGraph?.title || formattedTitle,
      description: openGraph?.description || description,
      url: openGraph?.url || canonicalUrl,
      siteName: openGraph?.siteName || DEFAULT_SITE_NAME,
      locale: openGraph?.locale || "en_US",
      type: openGraph?.type || "website",
      images: openGraph?.images,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
  };
}
