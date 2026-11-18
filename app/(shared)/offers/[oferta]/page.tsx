import type { Metadata } from "next";
import Link from "next/link";
import { offersProvider } from "@/lib/providers";
import { buildMetadata } from "@/lib/seo";
import { PetRegulatoryNotice } from "@/app/(pet)/pet/_components/pet-regulatory-notice";

interface PageProps {
  params: Promise<{ oferta: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { oferta } = await params;
  const offer = await offersProvider.get(oferta);
  const title = offer?.title ?? "Special Offer";
  const description = offer?.description ?? "To be confirmed";

  return buildMetadata({
    title: `${title} - Nadeon`,
    description,
    pathname: `/offers/${encodeURIComponent(oferta)}`,
    noIndex: true,
  });
}

export async function generateStaticParams() {
  const offers = await offersProvider.list();
  if (offers.length === 0) {
    return [{ oferta: "model" }];
  }
  return offers.map((offer) => ({ oferta: offer.id }));
}

export default async function OfferPage({ params }: PageProps) {
  const { oferta } = await params;
  const offer = await offersProvider.get(oferta);

  const title = offer?.title ?? "Special Offer";
  const description = offer?.description ?? "To be confirmed";
  const code = offer?.code ?? "To be confirmed";

  const discountText = offer?.discount
    ? offer.discount.type === "percentage"
      ? `Save ${offer.discount.amount}%`
      : `Buy ${offer.discount.buy}, get ${offer.discount.get} free`
    : "To be confirmed";

  return (
    <main id="main-content" className="flex-1" tabIndex={-1}>
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-sm text-fg-muted">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link
                href="/pet"
                className="underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Pet
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href="/pet/dogs"
                className="underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Shop
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-fg">
              {title}
            </li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section
          className="grid gap-8 py-10 lg:grid-cols-2 lg:items-center lg:py-16"
          aria-labelledby="offer-title"
        >
          <div>
            <span className="inline-block rounded-pill border border-accent bg-bg-elevated px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
              Limited-time offer
            </span>
            <h1
              id="offer-title"
              className="mt-4 font-archivo text-4xl font-extrabold uppercase leading-tight text-fg sm:text-5xl"
            >
              {title}
            </h1>
            <p className="mt-3 font-archivo text-2xl font-bold uppercase text-accent">
              {discountText}
            </p>
            <p className="mt-4 max-w-xl text-base text-fg-muted">
              {description}
            </p>

            {/* Countdown placeholder */}
            <div className="mt-6 rounded-card border border-border bg-bg-elevated p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-fg-muted">
                Ends in · Countdown
              </p>
              <div
                className="mt-2 grid grid-cols-4 gap-2 text-center"
                aria-label="Countdown timer"
              >
                <div className="rounded-field border border-border p-2">
                  <span className="block font-archivo text-xl font-bold text-fg">
                    To be confirmed
                  </span>
                  <span className="text-[10px] font-bold uppercase text-fg-muted">
                    DAYS
                  </span>
                </div>
                <div className="rounded-field border border-border p-2">
                  <span className="block font-archivo text-xl font-bold text-fg">
                    To be confirmed
                  </span>
                  <span className="text-[10px] font-bold uppercase text-fg-muted">
                    HRS
                  </span>
                </div>
                <div className="rounded-field border border-border p-2">
                  <span className="block font-archivo text-xl font-bold text-fg">
                    To be confirmed
                  </span>
                  <span className="text-[10px] font-bold uppercase text-fg-muted">
                    MIN
                  </span>
                </div>
                <div className="rounded-field border border-border p-2">
                  <span className="block font-archivo text-xl font-bold text-fg">
                    To be confirmed
                  </span>
                  <span className="text-[10px] font-bold uppercase text-fg-muted">
                    SEC
                  </span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <a
                href="#on-offer"
                className="inline-flex min-h-11 items-center rounded-pill bg-fg px-6 font-bold text-bg transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Shop the offer
              </a>
              <span className="inline-flex min-h-11 items-center rounded-pill border border-border bg-bg-elevated px-4 text-xs font-bold text-fg">
                Code: {code} or applied automatically
              </span>
            </div>
          </div>

          <div className="flex min-h-72 items-center justify-center rounded-card border border-border bg-bg-elevated p-8 text-center text-fg-muted">
            To be confirmed
          </div>
        </section>

        {/* How the offer works */}
        <section
          className="border-t border-border py-12"
          aria-labelledby="how-it-works-title"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-fg-muted">
            HOW THE OFFER WORKS
          </p>
          <h2
            id="how-it-works-title"
            className="mt-2 font-archivo text-3xl font-extrabold uppercase text-fg"
          >
            Three easy steps
          </h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-3">
            <li className="rounded-card border border-border bg-bg-elevated p-6">
              <span className="flex h-8 w-8 items-center justify-center rounded-pill bg-accent font-archivo text-sm font-bold text-bg">
                1
              </span>
              <h3 className="mt-4 font-bold text-fg">Pick your products</h3>
              <p className="mt-2 text-sm text-fg-muted">
                Choose any eligible item marked with the offer badge. (To be
                confirmed)
              </p>
            </li>
            <li className="rounded-card border border-border bg-bg-elevated p-6">
              <span className="flex h-8 w-8 items-center justify-center rounded-pill bg-accent font-archivo text-sm font-bold text-bg">
                2
              </span>
              <h3 className="mt-4 font-bold text-fg">Discount applies</h3>
              <p className="mt-2 text-sm text-fg-muted">
                Use code {code} at checkout, or it applies automatically. (To be
                confirmed)
              </p>
            </li>
            <li className="rounded-card border border-border bg-bg-elevated p-6">
              <span className="flex h-8 w-8 items-center justify-center rounded-pill bg-accent font-archivo text-sm font-bold text-bg">
                3
              </span>
              <h3 className="mt-4 font-bold text-fg">Ships as usual</h3>
              <p className="mt-2 text-sm text-fg-muted">
                Delivery and subscription perks work as normal. (To be
                confirmed)
              </p>
            </li>
          </ol>
        </section>

        {/* Kits on offer */}
        <section
          className="border-t border-border py-12"
          aria-labelledby="kits-on-offer-title"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-fg-muted">
                KITS ON OFFER
              </p>
              <h2
                id="kits-on-offer-title"
                className="mt-2 font-archivo text-3xl font-extrabold uppercase text-fg"
              >
                Kits in the {title}
              </h2>
            </div>
            <Link
              href="/pet/kits"
              className="inline-flex min-h-11 items-center font-bold text-fg underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              All kits
            </Link>
          </div>
          <p className="mt-2 text-sm text-fg-muted">
            Offer kits: buy or kit price placeholders. (To be confirmed)
          </p>

          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <li
                key={item}
                className="flex flex-col justify-between rounded-card border border-border bg-bg-elevated p-6"
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-accent">
                    Kit · Save To be confirmed
                  </span>
                  <h3 className="mt-2 font-archivo text-xl font-bold uppercase text-fg">
                    To be confirmed
                  </h3>
                  <p className="mt-1 text-sm text-fg-muted">To be confirmed</p>
                  <p className="mt-4 font-bold text-fg">To be confirmed</p>
                </div>
                <div className="mt-6 space-y-3">
                  <button
                    type="button"
                    disabled
                    className="inline-flex min-h-11 w-full items-center justify-center rounded-pill bg-fg px-4 font-bold text-bg opacity-50 cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    Add kit to cart
                  </button>
                  <details className="text-xs text-fg-muted">
                    <summary className="cursor-pointer py-1 font-bold underline underline-offset-2">
                      What is inside
                    </summary>
                    <p className="mt-2">To be confirmed</p>
                  </details>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* On offer section */}
        <section
          id="on-offer"
          className="border-t border-border py-12"
          aria-labelledby="on-offer-title"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-fg-muted">
                ON OFFER
              </p>
              <h2
                id="on-offer-title"
                className="mt-2 font-archivo text-3xl font-extrabold uppercase text-fg"
              >
                Shop the {title}
              </h2>
            </div>
            <nav aria-label="Category filter" className="flex flex-wrap gap-2">
              <Link
                href="#on-offer"
                className="inline-flex min-h-11 items-center rounded-pill bg-fg px-4 text-xs font-bold text-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                All offers
              </Link>
              <Link
                href="/pet/dogs"
                className="inline-flex min-h-11 items-center rounded-pill border border-border bg-bg-elevated px-4 text-xs font-bold text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Dogs
              </Link>
              <Link
                href="/pet/cats"
                className="inline-flex min-h-11 items-center rounded-pill border border-border bg-bg-elevated px-4 text-xs font-bold text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Cats
              </Link>
              <Link
                href="/pet/horses"
                className="inline-flex min-h-11 items-center rounded-pill border border-border bg-bg-elevated px-4 text-xs font-bold text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Horses
              </Link>
              <Link
                href="/pet/kits"
                className="inline-flex min-h-11 items-center rounded-pill border border-border bg-bg-elevated px-4 text-xs font-bold text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Kits
              </Link>
            </nav>
          </div>
          <p className="mt-2 text-sm text-fg-muted">
            To be confirmed products on offer
          </p>

          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((product) => (
              <li
                key={product}
                className="flex flex-col justify-between rounded-card border border-border bg-bg-elevated p-6"
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-accent">
                    To be confirmed off
                  </span>
                  <h3 className="mt-2 font-archivo text-xl font-bold uppercase text-fg">
                    To be confirmed
                  </h3>
                  <p className="mt-1 text-sm text-fg-muted">To be confirmed</p>
                  <p className="mt-4 font-bold text-fg">To be confirmed</p>
                </div>
                <div className="mt-6 space-y-2">
                  <button
                    type="button"
                    disabled
                    className="inline-flex min-h-11 w-full items-center justify-center rounded-pill bg-fg px-4 font-bold text-bg opacity-50 cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    Add to cart
                  </button>
                  <button
                    type="button"
                    disabled
                    className="inline-flex min-h-11 w-full items-center justify-center rounded-pill border border-border px-4 text-xs font-bold text-fg opacity-50 cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    Subscribe &amp; save To be confirmed
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Bundle builder section */}
        <section
          className="border-t border-border py-12"
          aria-labelledby="bundle-builder-title"
        >
          <div className="rounded-card border border-border bg-bg-elevated p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-wider text-accent">
              BUNDLE BUILDER
            </p>
            <h2
              id="bundle-builder-title"
              className="mt-2 font-archivo text-3xl font-extrabold uppercase text-fg"
            >
              Pick To be confirmed, save To be confirmed
            </h2>
            <p className="mt-2 text-sm text-fg-muted">
              Mix any eligible products. Bundle rules: To be confirmed.
            </p>
            <p className="mt-4 font-bold text-fg">
              To be confirmed picked · add more to unlock To be confirmed
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="button"
                disabled
                className="inline-flex min-h-11 items-center rounded-pill border border-dashed border-border px-4 font-bold text-fg opacity-50 cursor-not-allowed"
              >
                + Add item
              </button>
              <span className="text-sm font-bold text-fg">
                Bundle total: To be confirmed
              </span>
              <button
                type="button"
                disabled
                className="inline-flex min-h-11 items-center rounded-pill bg-fg px-6 font-bold text-bg opacity-50 cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Add bundle to cart
              </button>
            </div>
          </div>
        </section>

        {/* Offer terms */}
        <section
          className="border-t border-border py-8"
          aria-labelledby="terms-title"
        >
          <h2 id="terms-title" className="sr-only">
            Offer terms
          </h2>
          <details className="rounded-card border border-border bg-bg-elevated p-6">
            <summary className="cursor-pointer font-bold text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
              Full terms
            </summary>
            <ul className="mt-4 space-y-2 text-sm text-fg-muted">
              <li>· Offer valid: To be confirmed.</li>
              <li>· Applies to: To be confirmed.</li>
              <li>· Code and stacking rule: To be confirmed.</li>
              <li>· Subscription eligibility: To be confirmed.</li>
              <li>
                · While supplies last. We may end or change the offer at any
                time.
              </li>
            </ul>
          </details>
        </section>
      </div>

      <PetRegulatoryNotice />
    </main>
  );
}
