import type { Metadata } from "next";
import Link from "next/link";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TrustStrip } from "@/components/brand/trust-strip";
import { MarketProvider } from "@/lib/market/context";
import { formatFreeShippingLabel } from "@/lib/market/shipping";
import { getVisitorMarket } from "@/lib/market/visitor";
import { storeLocatorProvider } from "@/lib/providers";
import { buildMetadata } from "@/lib/seo";

const radii = [10, 25, 50, 100] as const;
const lines = [
  { label: "All stores", value: "all" },
  { label: "Human line", value: "human" },
  { label: "Pet line", value: "pet" },
] as const;

type SearchParams = {
  zip?: string | string[];
  radius?: string | string[];
  line?: string | string[];
};

export const metadata: Metadata = buildMetadata({
  title: "Where to buy | Nadeon Labs",
  description: "Find a store near you. Store locations: To be confirmed.",
  pathname: "/where-to-buy",
});

function getRadius(value?: string) {
  const radius = Number(value);
  return radii.includes(radius as (typeof radii)[number]) ? radius : 25;
}

function getLine(value?: string) {
  return lines.find((line) => line.value === value)?.value ?? "all";
}

export default async function WhereToBuyPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const zipValue = Array.isArray(params.zip) ? params.zip[0] : params.zip;
  const radiusValue = Array.isArray(params.radius)
    ? params.radius[0]
    : params.radius;
  const lineValue = Array.isArray(params.line) ? params.line[0] : params.line;
  const zip = zipValue?.trim().slice(0, 12) ?? "";
  const radius = getRadius(radiusValue);
  const line = getLine(lineValue);
  const market = await getVisitorMarket();
  const humanShippingLabel = formatFreeShippingLabel(market, "human");
  const petShippingLabel = formatFreeShippingLabel(market, "pet");
  const freeShippingLabels = [
    humanShippingLabel ? `${humanShippingLabel} (Human)` : null,
    petShippingLabel ? `${petShippingLabel} (Pet)` : null,
  ].filter((label): label is string => label !== null);
  const stores = zip
    ? await storeLocatorProvider.search({
        zip,
        radiusMiles: radius,
        line,
      })
    : [];

  return (
    <MarketProvider initialMarket={market}>
      <AnnouncementBar line="human" />
      <Header variant="human" />
      <main id="main-content" className="flex-1 bg-bg text-fg" tabIndex={-1}>
        <section
          data-theme="human"
          className="border-b border-border bg-bg-elevated px-5 py-12 text-center sm:px-8 sm:py-16 lg:py-20"
        >
          <div className="mx-auto max-w-5xl">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
              Human · Pet
            </p>
            <h1 className="mt-4 font-archivo text-4xl font-extrabold uppercase tracking-tight text-fg sm:text-6xl">
              Where to buy
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-fg-muted sm:text-lg">
              Buy direct for the full range, subscriptions and our 60-day
              guarantee, or find Nadeon at a store near you.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                href="/human/shop"
                className="inline-flex min-h-11 items-center justify-center rounded-pill bg-accent px-6 py-3 text-sm font-bold text-bg hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                Shop Human
              </Link>
              <Link
                href="/pet/dogs"
                className="inline-flex min-h-11 items-center justify-center rounded-pill border-2 border-fg px-6 py-2.5 text-sm font-bold text-fg hover:bg-fg hover:text-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                Shop Pet
              </Link>
            </div>
          </div>
        </section>

        <section
          data-theme="human"
          aria-labelledby="shop-online-heading"
          className="bg-bg px-5 py-12 sm:px-8 sm:py-16 lg:px-16 lg:py-20"
        >
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
              Buy online
            </p>
            <h2
              id="shop-online-heading"
              className="mt-2 font-archivo text-3xl font-extrabold uppercase tracking-tight text-fg sm:text-5xl"
            >
              Shop online
            </h2>
            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              <div className="flex flex-col justify-between gap-6 rounded-card border border-border bg-bg-elevated p-6 sm:flex-row sm:items-center sm:p-8">
                <div>
                  <p className="inline-flex rounded-pill bg-bg px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-accent">
                    Best place to buy
                  </p>
                  <p className="mt-4 font-archivo text-3xl font-extrabold text-fg">
                    nadeonlabs.com
                  </p>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-fg-muted">
                    Full Human and Pet range · Subscribe &amp; save ·{" "}
                    {freeShippingLabels.length
                      ? freeShippingLabels.join(" / ")
                      : "Free shipping details: To be confirmed"}{" "}
                    · 60-day money-back guarantee
                  </p>
                </div>
                <div className="flex shrink-0 gap-3">
                  <Link
                    href="/human/shop"
                    aria-label="Shop Human online"
                    className="inline-flex min-h-11 items-center rounded-pill bg-accent px-4 py-2 text-sm font-bold text-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                  >
                    Shop Human
                  </Link>
                  <Link
                    href="/pet/dogs"
                    aria-label="Shop Pet online"
                    className="inline-flex min-h-11 items-center rounded-pill border border-border px-4 py-2 text-sm font-bold text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                  >
                    Shop Pet
                  </Link>
                </div>
              </div>
              <div className="flex flex-col justify-between gap-5 rounded-card border border-border bg-bg-elevated p-6 sm:flex-row sm:items-center sm:p-8">
                <div>
                  <h3 className="font-archivo text-2xl font-extrabold text-fg">
                    Marketplaces
                  </h3>
                  <p className="mt-2 text-sm text-fg-muted">Coming soon</p>
                </div>
                <span className="inline-flex min-h-10 items-center self-start rounded-pill border border-dashed border-border px-4 py-2 text-sm font-bold text-accent sm:self-center">
                  Coming soon
                </span>
              </div>
            </div>
          </div>
        </section>

        <section
          data-theme="pet"
          aria-labelledby="store-locator-heading"
          className="bg-bg px-5 py-12 text-fg sm:px-8 sm:py-16 lg:px-16 lg:py-20"
        >
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
              Store locator
            </p>
            <h2
              id="store-locator-heading"
              className="mt-2 font-archivo text-3xl font-extrabold uppercase tracking-tight sm:text-5xl"
            >
              Find a store near you
            </h2>
            <form
              action="/where-to-buy"
              method="get"
              className="mt-7 grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem_auto]"
            >
              <label className="sr-only" htmlFor="store-zip">
                ZIP code
              </label>
              <input
                id="store-zip"
                name="zip"
                autoComplete="postal-code"
                maxLength={12}
                required
                defaultValue={zip}
                placeholder="Enter ZIP code"
                className="min-h-12 rounded-pill border border-border bg-bg-elevated px-5 text-fg placeholder:text-fg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              />
              <input type="hidden" name="line" value={line} />
              <label className="sr-only" htmlFor="store-radius">
                Within miles
              </label>
              <select
                id="store-radius"
                name="radius"
                defaultValue={String(radius)}
                className="min-h-12 rounded-pill border border-border bg-bg-elevated px-5 text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {radii.map((miles) => (
                  <option key={miles} value={miles}>
                    Within {miles} mi
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="min-h-12 rounded-pill bg-fg px-7 py-3 font-bold text-bg hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                Search
              </button>
            </form>

            <fieldset className="mt-4 flex flex-wrap gap-2">
              <legend className="sr-only">Store filters</legend>
              {lines.map((option) => (
                <form key={option.value} action="/where-to-buy" method="get">
                  <input type="hidden" name="zip" value={zip} />
                  <input type="hidden" name="radius" value={radius} />
                  <button
                    type="submit"
                    name="line"
                    value={option.value}
                    aria-pressed={line === option.value}
                    className={`min-h-11 rounded-pill border px-5 py-2 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      line === option.value
                        ? "border-accent bg-accent text-bg"
                        : "border-border bg-bg text-fg hover:border-accent"
                    }`}
                  >
                    {option.label}
                  </button>
                </form>
              ))}
            </fieldset>

            <div className="mt-8">
              {stores.length > 0 ? (
                <>
                  <p className="mb-4 text-sm font-bold text-fg-muted">
                    {stores.length} stores near {zip}
                  </p>
                  <ul className="grid gap-3 lg:max-w-2xl">
                    {stores.map((store) => (
                      <li
                        key={store.id}
                        className="rounded-card border border-border bg-bg p-5"
                      >
                        <div className="flex flex-wrap justify-between gap-2">
                          <h3 className="font-bold text-fg">{store.name}</h3>
                          <span className="text-sm font-bold text-fg">
                            {store.distanceMiles} mi
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-fg-muted">
                          {store.address}
                        </p>
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                          <ul
                            aria-label="Available product lines"
                            className="flex gap-2"
                          >
                            {store.lines.map((storeLine) => (
                              <li
                                key={storeLine}
                                className="rounded-pill bg-bg-elevated px-3 py-1 text-xs font-bold"
                              >
                                {storeLine === "human"
                                  ? "Human line"
                                  : "Pet line"}
                              </li>
                            ))}
                          </ul>
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(store.address)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="min-h-11 inline-flex items-center font-bold text-fg underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                          >
                            Directions →
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="rounded-card border border-border bg-bg p-6 text-sm text-fg-muted">
                  Store locations: To be confirmed.
                </p>
              )}
            </div>
          </div>
        </section>

        <section
          data-theme="pet"
          className="bg-bg px-5 py-12 sm:px-8 sm:py-16 lg:px-16 lg:py-20"
        >
          <div
            data-theme="human"
            className="mx-auto flex max-w-6xl flex-col gap-6 rounded-card border border-border bg-bg-elevated p-6 sm:p-10 lg:flex-row lg:items-center lg:justify-between"
          >
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
                For retailers
              </p>
              <h2 className="mt-3 font-archivo text-3xl font-extrabold uppercase tracking-tight text-fg sm:text-5xl">
                Own a store? Become a retailer.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-fg-muted">
                Pet stores, clinics, gyms and pharmacies get wholesale pricing,
                a POS display kit and one-click reorders in our trade portal.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <button
                type="button"
                disabled
                aria-describedby="retailer-actions-note"
                className="min-h-11 cursor-not-allowed rounded-pill bg-accent px-6 py-3 text-sm font-bold text-bg opacity-60"
              >
                Apply for wholesale
              </button>
              <button
                type="button"
                disabled
                aria-describedby="retailer-actions-note"
                className="min-h-11 cursor-not-allowed rounded-pill border-2 border-border px-5 py-2.5 text-sm font-bold text-fg opacity-60"
              >
                Retailer sign in
              </button>
              <p
                id="retailer-actions-note"
                className="w-full text-xs text-fg-muted"
              >
                Wholesale actions: To be confirmed.
              </p>
            </div>
          </div>
        </section>
      </main>
      <TrustStrip data-theme="human" line="human" />
      <Footer />
    </MarketProvider>
  );
}
