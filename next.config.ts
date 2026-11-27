import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
    ],
  },
  async headers() {
    const headers = [
      { key: "X-Frame-Options", value: "DENY" },
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
    ];

    if (process.env.NODE_ENV === "production") {
      const storefrontDomain =
        process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_DOMAIN;
      const storefrontOrigin = storefrontDomain
        ? storefrontDomain.startsWith("http")
          ? storefrontDomain
          : `https://${storefrontDomain}`
        : "https://*.myshopify.com";

      headers.push({
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          "base-uri 'self'",
          "object-src 'none'",
          "frame-ancestors 'none'",
          "form-action 'self'",
          "script-src 'self' 'unsafe-inline'",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob: https://cdn.shopify.com",
          "font-src 'self' data:",
          `connect-src 'self' ${storefrontOrigin}`,
        ].join("; "),
      });
    }

    return [{ source: "/:path*", headers }];
  },
};

export default nextConfig;
