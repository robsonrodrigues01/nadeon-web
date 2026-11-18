import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TrustStrip } from "@/components/brand/trust-strip";
import { catalogProvider, reviewsProvider } from "@/lib/providers";
import type { ReviewsFilter } from "@/lib/contracts/reviews";
import { buildMetadata } from "@/lib/seo";
import { ReviewsFilters } from "./_components/reviews-filters";

const pageSize = 6;
const petSpecies = ["dog", "cat", "horse"] as const;

interface ReviewsPageProps {
  searchParams: Promise<{
    product?: string;
    rating?: string;
    pet?: string;
    photos?: string;
    sort?: string;
    offset?: string;
  }>;
}

export const metadata: Metadata = buildMetadata({
  title: "Reviews",
  description:
    "Every review is from a verified buyer. We show the good and the not so good.",
  pathname: "/reviews",
});

function parseOffset(value?: string) {
  const offset = Number(value);
  return Number.isInteger(offset) && offset > 0 ? offset : 0;
}

function parseRating(value?: string) {
  const rating = Number(value);
  return Number.isInteger(rating) && rating >= 1 && rating <= 5
    ? rating
    : undefined;
}

function displayAuthorName(value: string) {
  const [firstName, ...names] = value.trim().split(/\s+/);
  const surname = names.at(-1);
  return firstName && surname
    ? `${firstName} ${surname[0]}.`
    : "To be confirmed";
}

export default async function ReviewsPage({ searchParams }: ReviewsPageProps) {
  const params = await searchParams;
  const products = await catalogProvider.getProducts({ line: "pet" });
  const productSlug = products.some(
    (product) => product.slug === params.product
  )
    ? params.product
    : undefined;
  const rating = parseRating(params.rating);
  const pet = petSpecies.includes(params.pet as (typeof petSpecies)[number])
    ? (params.pet as (typeof petSpecies)[number])
    : params.pet === "all"
      ? undefined
      : "dog";
  const offset = parseOffset(params.offset);
  const filter: ReviewsFilter = {
    ...(productSlug ? { productSlug } : {}),
    ...(rating ? { rating } : {}),
    ...(pet ? { petSpecies: pet } : {}),
    ...(params.photos === "true" ? { hasImages: true } : {}),
    sort: "most_recent",
    limit: pageSize,
    offset,
  };

  const [result, summaries] = await Promise.all([
    reviewsProvider.list(filter),
    Promise.all(
      products.map((product) => reviewsProvider.summary(product.slug))
    ),
  ]);
  const totalRatings = summaries.reduce(
    (total, summary) => total + summary.totalReviews,
    0
  );
  const averageRating = totalRatings
    ? summaries.reduce(
        (total, summary) =>
          total + summary.averageRating * summary.totalReviews,
        0
      ) / totalRatings
    : 0;
  const ratingBreakdown = summaries.reduce<Record<number, number>>(
    (total, summary) => {
      for (const rating of [1, 2, 3, 4, 5]) {
        total[rating] += summary.ratingBreakdown[rating] ?? 0;
      }
      return total;
    },
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  );
  const productBySlug = new Map(
    products.map((product) => [product.slug, product])
  );
  const hasMore = offset + result.reviews.length < result.total;
  const publishedReviews = result.reviews.filter(
    (review) => review.moderationStatus === "approved" && review.verifiedBuyer
  );

  return (
    <>
      <AnnouncementBar line="pet" />
      <Header variant="pet" />
      <main id="main-content" className="flex-1 bg-bg text-fg" tabIndex={-1}>
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
          <header className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
              REVIEWS
            </p>
            <h1 className="mt-3 font-archivo text-4xl font-extrabold uppercase text-fg sm:text-6xl">
              From the pack
            </h1>
            <p className="mt-4 text-base text-fg-muted">
              Every review is from a verified buyer. We show the good and the
              not so good.
            </p>
          </header>

          <section
            aria-labelledby="reviews-summary-heading"
            className="mt-10 rounded-card border border-border bg-bg-elevated p-6 sm:p-8"
          >
            <h2
              id="reviews-summary-heading"
              className="text-xs font-bold uppercase tracking-[0.14em] text-fg-muted"
            >
              RATING SUMMARY · ALL PRODUCTS
            </h2>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
              <p
                role="img"
                aria-label={
                  totalRatings === 0
                    ? "No reviews yet"
                    : `${averageRating.toFixed(1)} out of 5 stars`
                }
                className="text-2xl tracking-widest text-accent"
              >
                {"★".repeat(Math.round(averageRating))}
                {"☆".repeat(5 - Math.round(averageRating))}
              </p>
              {totalRatings === 0 ? (
                <p className="font-bold text-fg">
                  No reviews yet. Reviews open after the first orders ship.
                </p>
              ) : (
                <p className="font-bold text-fg">
                  {averageRating.toFixed(1)} · {totalRatings}
                </p>
              )}
            </div>
            <dl className="mt-6 grid grid-cols-5 gap-2 text-sm text-fg-muted">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-2">
                  <dt>{rating}★</dt>
                  <dd>{ratingBreakdown[rating]}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-label="Reviews" className="mt-10">
            <ReviewsFilters
              products={products}
              product={productSlug ?? ""}
              rating={rating?.toString() ?? ""}
              pet={pet ?? "all"}
              photos={params.photos === "true"}
              sort="most_recent"
            />

            {publishedReviews.length ? (
              <ul className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {publishedReviews.map((review) => {
                  const product = productBySlug.get(review.productSlug);
                  return (
                    <li key={review.id}>
                      <article className="h-full rounded-card border border-border bg-bg-elevated p-6">
                        <div className="flex items-center justify-between gap-4">
                          <p
                            role="img"
                            aria-label={`${review.rating} out of 5 stars`}
                            className="tracking-widest text-accent"
                          >
                            {"★".repeat(review.rating)}
                            {"☆".repeat(5 - review.rating)}
                          </p>
                          <time
                            dateTime={review.createdAt}
                            className="text-xs text-fg-muted"
                          >
                            {new Date(review.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </time>
                        </div>
                        <h2 className="mt-4 font-archivo text-xl font-extrabold text-fg">
                          {review.title}
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                          {review.body}
                        </p>
                        {review.images.length > 0 && (
                          <ul
                            aria-label="Review photos"
                            className="mt-4 flex gap-2"
                          >
                            {review.images.map((src) => (
                              <li key={src}>
                                <Image
                                  src={src}
                                  alt="Review photo"
                                  width={74}
                                  height={74}
                                  unoptimized
                                  className="size-[74px] rounded-field object-cover"
                                />
                              </li>
                            ))}
                          </ul>
                        )}
                        <div className="mt-5 border-t border-border pt-4">
                          <p className="font-bold text-fg">
                            {displayAuthorName(review.authorName)}
                          </p>
                          <p className="mt-1 text-xs text-fg-muted">
                            Verified buyer ·{" "}
                            {review.petSpecies
                              ? `${review.petSpecies[0].toUpperCase()}${review.petSpecies.slice(1)} · To be confirmed`
                              : "To be confirmed"}
                          </p>
                        </div>
                        <div className="mt-4 flex items-center justify-between gap-3 text-sm">
                          {product ? (
                            <Link
                              href={`/pet/products/${encodeURIComponent(product.slug)}`}
                              className="inline-flex min-h-11 items-center rounded-pill bg-accent/15 px-3 py-2 font-bold text-fg underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                            >
                              {product.name}
                            </Link>
                          ) : (
                            <span>To be confirmed</span>
                          )}
                          <span className="text-fg-muted">
                            Helpful? 👍 {review.helpfulVotes}
                          </span>
                        </div>
                      </article>
                    </li>
                  );
                })}
              </ul>
            ) : totalRatings > 0 ? (
              <p className="mt-6 rounded-card border border-border bg-bg-elevated p-6 text-fg-muted">
                No reviews yet. Reviews open after the first orders ship.
              </p>
            ) : null}

            <form action="/reviews" method="get" className="mt-8 text-center">
              <input type="hidden" name="product" value={productSlug ?? ""} />
              <input
                type="hidden"
                name="rating"
                value={rating?.toString() ?? ""}
              />
              <input type="hidden" name="pet" value={pet ?? "all"} />
              <input
                type="hidden"
                name="photos"
                value={params.photos === "true" ? "true" : ""}
              />
              <input type="hidden" name="sort" value="most_recent" />
              <input
                type="hidden"
                name="offset"
                value={offset + result.reviews.length}
              />
              <button
                type="submit"
                disabled={!hasMore}
                className="min-h-11 rounded-pill border border-border px-6 font-bold text-fg enabled:hover:bg-bg-elevated disabled:cursor-not-allowed disabled:text-fg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Load more reviews
              </button>
            </form>
          </section>
        </div>
      </main>
      <TrustStrip line="pet" />
      <Footer line="pet" />
    </>
  );
}
