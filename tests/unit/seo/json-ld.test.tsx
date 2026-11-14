import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { JsonLd } from "@/lib/seo/json-ld";

describe("<JsonLd /> Component", () => {
  it("renders script tag with application/ld+json", () => {
    const data = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Nadeon Labs",
    };

    const html = renderToString(<JsonLd data={data} />);

    expect(html).toContain('<script type="application/ld+json"');
    expect(html).toContain('"@context":"https://schema.org"');
    expect(html).toContain('"@type":"Organization"');
    expect(html).toContain('"name":"Nadeon Labs"');
  });

  it("renders null when data is null or undefined", () => {
    const htmlNull = renderToString(<JsonLd data={null} />);
    expect(htmlNull).toBe("");

    const htmlUndefined = renderToString(<JsonLd data={undefined} />);
    expect(htmlUndefined).toBe("");
  });

  it("renders array of schema objects", () => {
    const data = [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Nadeon Labs",
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
      },
    ];

    const html = renderToString(<JsonLd data={data} />);

    expect(html).toContain('<script type="application/ld+json"');
    expect(html).toContain('"@type":"Organization"');
    expect(html).toContain('"@type":"BreadcrumbList"');
  });

  it("escapes '<' characters to prevent XSS script injection", () => {
    const maliciousData = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: "</script><script>alert('xss')</script>",
    };

    const html = renderToString(<JsonLd data={maliciousData} />);

    expect(html).not.toContain("</script><script>");
    expect(html).toContain("\\u003c/script>\\u003cscript>");
  });

  it("renders with custom id when provided", () => {
    const data = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
    };

    const html = renderToString(<JsonLd id="breadcrumbs-schema" data={data} />);

    expect(html).toContain('id="breadcrumbs-schema"');
  });
});
