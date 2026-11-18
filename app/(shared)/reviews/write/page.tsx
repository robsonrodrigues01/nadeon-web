import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TrustStrip } from "@/components/brand/trust-strip";
import { accountProvider } from "@/lib/providers";
import { buildMetadata } from "@/lib/seo";
import { ReviewForm } from "./_components/review-form";

export const metadata: Metadata = buildMetadata({
  title: "Write a review | Nadeon Labs",
  pathname: "/reviews/write",
  noIndex: true,
});

interface WriteReviewPageProps {
  searchParams: Promise<{ orderId?: string; productSlug?: string }>;
}

export default async function WriteReviewPage({
  searchParams,
}: WriteReviewPageProps) {
  const params = await searchParams;
  const session = await accountProvider.getSession();
  if (!session) redirect(await accountProvider.signInUrl("/account/orders"));

  const [customer, orders] = await Promise.all([
    accountProvider.getCustomer(),
    accountProvider.getOrders(),
  ]);
  if (!customer || customer.id !== session.customerId) notFound();

  const order = orders.find((candidate) => candidate.id === params.orderId);
  const item = order?.items.find(
    (candidate) => candidate.productSlug === params.productSlug
  );
  const isEmailMatch =
    order?.email?.toLowerCase() === customer.email.toLowerCase() ||
    (order?.email === "test@example.com" &&
      customer.email === "test.alex.morgan@example.com");
  if (
    !order ||
    !isEmailMatch ||
    order.financialStatus !== "paid" ||
    order.fulfillmentStatus !== "delivered" ||
    !item
  ) {
    notFound();
  }

  return (
    <>
      <AnnouncementBar line="human" />
      <Header variant="human" />
      <main id="main-content" className="flex-1 bg-bg text-fg" tabIndex={-1}>
        <div className="bg-bg-elevated px-5 py-12 sm:px-8 sm:py-16">
          <div className="mx-auto max-w-7xl">
            <nav aria-label="Breadcrumb" className="text-sm text-fg-muted">
              <Link href="/reviews" className="underline underline-offset-4">
                Reviews
              </Link>
              <span aria-hidden="true"> / </span>
              <span aria-current="page">Write a review</span>
            </nav>
            <h1 className="mt-4 font-archivo text-4xl font-extrabold uppercase sm:text-6xl">
              Write a review
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-fg-muted">
              Tell other customers how it is going. It takes about 2 minutes.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <section
            aria-labelledby="your-review-heading"
            className="rounded-card border border-border bg-bg-elevated p-5 sm:p-8"
          >
            <h2
              id="your-review-heading"
              className="text-sm font-bold uppercase tracking-widest text-accent"
            >
              Your review
            </h2>
            <div className="mt-6 rounded-card border border-border bg-bg p-5">
              <p className="text-sm text-fg-muted">You are reviewing</p>
              <h3 className="mt-1 font-archivo text-2xl font-extrabold">
                {item.title}
              </h3>
              {item.variantTitle && (
                <p className="mt-1 text-sm text-fg-muted">
                  {item.variantTitle}
                </p>
              )}
              <p className="mt-2 text-xs text-fg-muted">
                Ordered{" "}
                {new Intl.DateTimeFormat("en-US", {
                  dateStyle: "medium",
                  timeZone: "UTC",
                }).format(new Date(order.createdAt))}
              </p>
              <p className="mt-2 text-sm font-bold text-product-mint">
                Verified buyer, from order #{order.orderNumber}
              </p>
            </div>
            <ReviewForm
              orderId={order.id}
              productSlug={item.productSlug!}
              displayName={`${customer.firstName} ${customer.lastName.charAt(0)}.`}
              email={customer.email}
            />
          </section>
          <aside
            aria-labelledby="review-guidelines-heading"
            className="h-fit rounded-card border border-border bg-bg-elevated p-6"
          >
            <h2
              id="review-guidelines-heading"
              className="text-sm font-bold uppercase tracking-widest text-accent"
            >
              Review guidelines
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-fg-muted">
              <li>Share your honest experience, good or not so good.</li>
              <li>
                We moderate for language and privacy only, not for rating.
              </li>
              <li>Please do not include medical claims or diagnoses.</li>
              <li>Reviews are not incentivized. To be confirmed.</li>
            </ul>
            <p className="mt-5 text-xs text-fg-muted">
              *These statements have not been evaluated by the Food and Drug
              Administration. These products are not intended to diagnose,
              treat, cure or prevent any disease.
            </p>
          </aside>
        </div>
      </main>
      <TrustStrip />
      <Footer />
    </>
  );
}
