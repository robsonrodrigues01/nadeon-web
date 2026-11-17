import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ConsentProvider } from "@/lib/consent";
import { MeasurementScripts } from "@/components/layout/measurement-scripts";

vi.mock("next/script", () => ({
  default: ({ id, src }: { id?: string; src?: string }) => (
    <span data-testid="script" data-id={id} data-src={src} />
  ),
}));

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("W4-08a measurement scripts", () => {
  it("loads no scripts before consent", () => {
    vi.stubEnv("NEXT_PUBLIC_GA4_ID", "G-123");
    vi.stubEnv("NEXT_PUBLIC_CLARITY_ID", "clarity-123");
    vi.stubEnv("NEXT_PUBLIC_META_PIXEL_ID", "meta-123");

    const html = renderToStaticMarkup(
      <ConsentProvider initialCountry="GB">
        <MeasurementScripts />
      </ConsentProvider>
    );

    expect(html).not.toContain('data-testid="script"');
  });

  it("loads only configured scripts allowed by consent", () => {
    vi.stubEnv("NEXT_PUBLIC_GA4_ID", "G-123");
    vi.stubEnv("NEXT_PUBLIC_CLARITY_ID", "");
    vi.stubEnv("NEXT_PUBLIC_META_PIXEL_ID", "meta-123");

    const html = renderToStaticMarkup(
      <ConsentProvider
        initialCountry="GB"
        initialRecord={{
          version: "1.0",
          timestamp: "2026-11-17T00:00:00.000Z",
          country: "GB",
          explicit: true,
          preferences: { necessary: true, analytics: true, marketing: false },
        }}
      >
        <MeasurementScripts />
      </ConsentProvider>
    );

    expect(html.match(/data-testid="script"/g)).toHaveLength(2);
    expect(html).toContain("G-123");
    expect(html).toContain("ga4-init");
    expect(html).not.toContain("clarity-init");
    expect(html).not.toContain("meta-pixel-init");
  });
});
