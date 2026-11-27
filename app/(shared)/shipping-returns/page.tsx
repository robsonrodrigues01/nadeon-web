import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { TrustStrip } from "@/components/brand/trust-strip";
import { Newsletter } from "@/components/brand/newsletter";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { getVisitorMarket } from "@/lib/market/visitor";
import { MarketProvider } from "@/lib/market/context";
import {
  formatFreeShippingThreshold,
  formatFreeShippingLabel,
  getInternationalShippingNotice,
} from "@/lib/market/shipping";

export const metadata: Metadata = buildMetadata({
  title: "Shipping & Returns | Nadeon Labs",
  description:
    "Where we ship, how long it takes, what it costs and how returns work at Nadeon Labs.",
  pathname: "/shipping-returns",
});

const JUMP_LINKS = [
  { label: "Rates and times", href: "#rates" },
  { label: "Tracking", href: "#tracking" },
  { label: "Subscriptions", href: "#subscriptions" },
  { label: "Returns", href: "#returns" },
  { label: "Damaged orders", href: "#damaged" },
  { label: "FAQ", href: "#faq" },
] as const;

const RETURN_STEPS = [
  {
    step: 1,
    title: "Start a return",
    description:
      "Enter your order number and email, or go to Orders in your account.",
  },
  {
    step: 2,
    title: "Tell us why",
    description:
      "Pick a reason. Return policy for opened jars: To be confirmed.",
  },
  {
    step: 3,
    title: "Send it back",
    description:
      "Return shipping instructions and prepaid labels: To be confirmed.",
  },
  {
    step: 4,
    title: "Get your refund",
    description:
      "Refunded to your original payment method. Processing timeframe: To be confirmed.",
  },
] as const;

const DAMAGED_STEPS = [
  {
    step: 1,
    title: "Take a photo",
    description:
      "Of the box, the label and the damaged item. Reporting window: To be confirmed.",
  },
  {
    step: 2,
    title: "Contact us",
    description: "Send the photos with your order number by chat or email.",
  },
  {
    step: 3,
    title: "We make it right",
    description:
      "We send a free replacement or refund. No need to return damaged items.",
  },
] as const;

const FAQ_ITEMS = [
  {
    question: "When will my order ship?",
    answer:
      "Orders placed before cutoff on business days ship the same day. Fulfillment schedule and cutoff time: To be confirmed.",
  },
  {
    question: "Do you ship outside the US?",
    answer:
      "Shipping coverage and international destinations: To be confirmed.",
  },
  {
    question: "Can I change my address after ordering?",
    answer:
      "Address change policy: To be confirmed. If your order has not shipped yet, contact support as soon as possible.",
  },
  {
    question: "How do I return a subscription order?",
    answer:
      "Subscription return policy: To be confirmed. Subscriptions can be managed directly in your account dashboard.",
  },
  {
    question: "What if my package says delivered but I do not have it?",
    answer:
      "Delivery resolution policy: To be confirmed. Please check with neighbors or building staff and contact our support team.",
  },
  {
    question: "How long do refunds take to show up?",
    answer: "Refund processing timeframe: To be confirmed.",
  },
  {
    question: "Do you charge restocking fees?",
    answer: "Restocking fee policy: To be confirmed.",
  },
] as const;

const jumpPillClass =
  "inline-flex min-h-11 items-center rounded-pill border border-border px-4 py-2 text-xs sm:text-sm font-bold text-fg transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

export default async function ShippingReturnsPage() {
  const market = await getVisitorMarket();
  const freeShippingThreshold = formatFreeShippingThreshold(market, "human");
  const freeShippingLabel = formatFreeShippingLabel(market, "human");
  const internationalNotice = getInternationalShippingNotice(market);

  const shippingZones = [
    {
      zone: "Contiguous US",
      method: "Standard",
      time: "To be confirmed",
      cost: "To be confirmed",
      freeOver: freeShippingThreshold ?? "To be confirmed",
    },
    {
      zone: "Contiguous US",
      method: "Express",
      time: "To be confirmed",
      cost: "To be confirmed",
      freeOver: "None",
    },
    {
      zone: "Alaska and Hawaii",
      method: "Standard",
      time: "To be confirmed",
      cost: "To be confirmed",
      freeOver: "To be confirmed",
    },
    {
      zone: "PR, US territories, APO/FPO",
      method: "Standard",
      time: "To be confirmed",
      cost: "To be confirmed",
      freeOver: "None",
    },
    {
      zone: "International",
      method: "To be confirmed",
      time: "To be confirmed",
      cost: "To be confirmed",
      freeOver: "To be confirmed",
    },
  ];

  return (
    <MarketProvider initialMarket={market}>
      <AnnouncementBar line="human" />
      <Header variant="human" />

      <main id="main-content" className="flex-1 bg-bg text-fg" tabIndex={-1}>
        {/* Hero Section */}
        <header className="border-b border-border bg-bg-elevated px-4 py-10 sm:px-8 sm:py-16 lg:px-16 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-xs text-fg-muted">
                <li>
                  <Link
                    href="/"
                    className="hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                  >
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link
                    href="/help"
                    className="hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                  >
                    Help
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="font-medium text-fg">
                  Shipping &amp; returns
                </li>
              </ol>
            </nav>

            <h1 className="mt-4 font-archivo text-4xl font-extrabold uppercase tracking-tight text-fg sm:text-6xl lg:text-7xl">
              Shipping &amp; returns
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-fg-muted sm:text-lg">
              Where we ship, how long it takes, what it costs and how returns
              work. All rates and times below are placeholders.
            </p>
            <p className="mt-3 text-xs text-fg-muted">
              Last updated: To be confirmed
            </p>

            {/* 3 Highlight Cards */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
              <div className="rounded-card border border-border bg-bg p-5 sm:p-6 shadow-card">
                <p className="font-archivo text-lg font-extrabold uppercase tracking-tight text-accent sm:text-xl">
                  Free shipping
                </p>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  {freeShippingLabel
                    ? `${freeShippingLabel}. Subscription delivery: To be confirmed.`
                    : "To be confirmed."}
                </p>
              </div>

              <div className="rounded-card border border-border bg-bg p-5 sm:p-6 shadow-card">
                <p className="font-archivo text-lg font-extrabold uppercase tracking-tight text-accent sm:text-xl">
                  Ships fast
                </p>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  Orders leave our warehouse: To be confirmed.
                </p>
              </div>

              <div className="rounded-card border border-border bg-bg p-5 sm:p-6 shadow-card">
                <p className="font-archivo text-lg font-extrabold uppercase tracking-tight text-accent sm:text-xl">
                  Guarantee
                </p>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  Not happy? Guarantee window: To be confirmed.
                </p>
              </div>
            </div>

            {/* Jump Navigation Pills */}
            <nav
              aria-label="Jump to section"
              className="mt-8 flex flex-wrap gap-2.5"
            >
              {JUMP_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={jumpPillClass}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        {/* Section: Shipping Rates */}
        <section
          id="rates"
          aria-labelledby="rates-heading"
          className="scroll-mt-20 border-b border-border px-4 py-12 sm:px-8 sm:py-16 lg:px-16 lg:py-20"
        >
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
              Shipping rates
            </p>
            <h2
              id="rates-heading"
              className="mt-2 font-archivo text-3xl font-extrabold uppercase tracking-tight text-fg sm:text-5xl"
            >
              Zones and delivery times
            </h2>

            {internationalNotice && (
              <div
                role="note"
                aria-label="International shipping notice"
                className="mt-6 rounded-card border border-border bg-bg-elevated p-4 sm:p-5 text-sm leading-relaxed text-fg-muted"
              >
                <p className="font-bold text-fg">International shipping</p>
                <p className="mt-1">{internationalNotice}</p>
              </div>
            )}

            {/* Desktop Table */}
            <div className="mt-8 hidden overflow-hidden rounded-card border border-border bg-bg-elevated md:block">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-bg text-xs font-bold uppercase tracking-wider text-fg-muted">
                  <tr>
                    <th scope="col" className="px-6 py-4">
                      Zone
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Method
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Delivery time
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Cost
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Free over
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {shippingZones.map((row) => (
                    <tr
                      key={`${row.zone}-${row.method}`}
                      className="hover:bg-bg/40 transition-colors"
                    >
                      <th scope="row" className="px-6 py-4 font-bold text-fg">
                        {row.zone}
                      </th>
                      <td className="px-6 py-4 text-fg-muted">{row.method}</td>
                      <td className="px-6 py-4 text-fg-muted">{row.time}</td>
                      <td className="px-6 py-4 font-bold text-fg">
                        {row.cost}
                      </td>
                      <td className="px-6 py-4 text-fg-muted">
                        {row.freeOver}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="mt-6 flex flex-col gap-3 md:hidden">
              {shippingZones.map((row) => (
                <div
                  key={`mobile-${row.zone}-${row.method}`}
                  className="rounded-card border border-border bg-bg-elevated p-4 text-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-fg">{row.zone}</span>
                    <span className="font-extrabold text-accent">
                      {row.cost}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-fg-muted">
                    {row.method} · {row.time}
                  </div>
                  <div className="mt-1 text-xs text-fg-muted">
                    Free over: {row.freeOver}
                  </div>
                </div>
              ))}
            </div>

            {/* 4-Item Information Grid */}
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="font-archivo text-base font-bold text-fg">
                  Order cutoff
                </p>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  Orders placed before cutoff on business days ship the same
                  day. Cutoff time: To be confirmed.
                </p>
              </div>
              <div>
                <p className="font-archivo text-base font-bold text-fg">
                  Carriers
                </p>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  Carriers: To be confirmed. Tracking on every order: To be
                  confirmed.
                </p>
              </div>
              <div>
                <p className="font-archivo text-base font-bold text-fg">
                  PO boxes
                </p>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  Standard shipping to PO boxes and Express address
                  requirements: To be confirmed.
                </p>
              </div>
              <div>
                <p className="font-archivo text-base font-bold text-fg">
                  Taxes
                </p>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  {market.taxNotice ??
                    "Sales tax is calculated at checkout based on your shipping address."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Tracking & Subscriptions */}
        <section
          aria-labelledby="tracking-heading"
          className="scroll-mt-20 border-b border-border bg-bg-elevated px-4 py-12 sm:px-8 sm:py-16 lg:px-16 lg:py-20"
        >
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
              Tracking &amp; subscriptions
            </p>
            <h2
              id="tracking-heading"
              className="mt-2 font-archivo text-3xl font-extrabold uppercase tracking-tight text-fg sm:text-5xl"
            >
              After you order
            </h2>

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Tracking Card */}
              <div
                id="tracking"
                className="scroll-mt-24 rounded-card border border-border bg-bg p-6 sm:p-8"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-accent">
                  Tracking
                </p>
                <h3 className="mt-2 font-archivo text-2xl font-extrabold uppercase tracking-tight text-fg sm:text-3xl">
                  Track your order
                </h3>

                <div className="mt-6 flex flex-col gap-5">
                  <div className="flex items-start gap-4">
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-gold font-archivo font-extrabold text-accent-fg"
                    >
                      1
                    </span>
                    <div>
                      <p className="font-bold text-fg">Order confirmed</p>
                      <p className="mt-1 text-sm leading-relaxed text-fg-muted">
                        Email with your order number right after checkout.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-gold font-archivo font-extrabold text-accent-fg"
                    >
                      2
                    </span>
                    <div>
                      <p className="font-bold text-fg">Shipped</p>
                      <p className="mt-1 text-sm leading-relaxed text-fg-muted">
                        Email and optional SMS with your tracking link.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-gold font-archivo font-extrabold text-accent-fg"
                    >
                      3
                    </span>
                    <div>
                      <p className="font-bold text-fg">Track anytime</p>
                      <p className="mt-1 text-sm leading-relaxed text-fg-muted">
                        Use your order number and email on our Track order page.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Button href="/track" variant="primary">
                    Track your order
                  </Button>
                </div>
              </div>

              {/* Subscriptions Card */}
              <div
                id="subscriptions"
                className="scroll-mt-24 rounded-card border border-border bg-bg p-6 sm:p-8"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-accent">
                  Subscriptions
                </p>
                <h3 className="mt-2 font-archivo text-2xl font-extrabold uppercase tracking-tight text-fg sm:text-3xl">
                  Subscription shipping
                </h3>

                <ul className="mt-6 flex flex-col gap-4 text-sm leading-relaxed text-fg-muted">
                  <li className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="text-base font-bold text-accent"
                    >
                      ✓
                    </span>
                    <span>
                      Subscription delivery shipping: To be confirmed.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="text-base font-bold text-accent"
                    >
                      ✓
                    </span>
                    <span>
                      We email you before each charge and shipment. Notice
                      window: To be confirmed.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="text-base font-bold text-accent"
                    >
                      ✓
                    </span>
                    <span>
                      Change your ship date, skip, pause or cancel in your
                      account anytime.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="text-base font-bold text-accent"
                    >
                      ✓
                    </span>
                    <span>
                      Add a product before the charge date and it ships in the
                      same box.
                    </span>
                  </li>
                </ul>

                <div className="mt-8">
                  <Button href="/account" variant="secondary">
                    Manage subscription
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Returns */}
        <section
          id="returns"
          aria-labelledby="returns-heading"
          className="scroll-mt-20 border-b border-border px-4 py-12 sm:px-8 sm:py-16 lg:px-16 lg:py-20"
        >
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
              Returns
            </p>
            <h2
              id="returns-heading"
              className="mt-2 font-archivo text-3xl font-extrabold uppercase tracking-tight text-fg sm:text-5xl"
            >
              Returns and refunds
            </h2>

            {/* Promise Banner */}
            <div className="mt-8 flex flex-col gap-6 rounded-card border border-border bg-bg-elevated p-6 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <span className="inline-block rounded-pill border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
                  Our promise
                </span>
                <h3 className="mt-3 font-archivo text-2xl font-extrabold uppercase tracking-tight text-fg sm:text-3xl">
                  Money-back guarantee
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted sm:text-base">
                  Try it on your first order. If it is not right for you,
                  contact us and we will refund your first order, even if the
                  jar is opened. Conditions, limits and trial period: To be
                  confirmed.
                </p>
              </div>
              <div className="shrink-0">
                <Button href="/help#contact" variant="primary">
                  Start a return
                </Button>
              </div>
            </div>

            {/* 4 Return Steps */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {RETURN_STEPS.map((item) => (
                <div
                  key={item.step}
                  className="rounded-card border border-border bg-bg-elevated p-5 sm:p-6"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-gold font-archivo font-extrabold text-accent-fg"
                  >
                    {item.step}
                  </span>
                  <h3 className="mt-4 font-archivo text-lg font-bold text-fg">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-fg-muted sm:text-sm">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Eligibility Cards */}
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-card border border-border bg-bg-elevated p-6">
                <div className="flex items-center gap-2.5 font-archivo text-base font-bold text-fg">
                  <span
                    aria-hidden="true"
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent"
                  >
                    ✓
                  </span>
                  Eligible
                </div>
                <ul className="mt-4 flex flex-col gap-2.5 text-sm text-fg-muted">
                  <li className="pl-8">
                    First order of any formula (trial period: To be confirmed)
                  </li>
                  <li className="pl-8">
                    Unopened products (return window: To be confirmed)
                  </li>
                  <li className="pl-8">
                    Other eligible conditions: To be confirmed
                  </li>
                </ul>
              </div>

              <div className="rounded-card border border-border bg-bg-elevated p-6">
                <div className="flex items-center gap-2.5 font-archivo text-base font-bold text-fg">
                  <span
                    aria-hidden="true"
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-border text-xs font-bold text-fg-muted"
                  >
                    ×
                  </span>
                  Not eligible
                </div>
                <ul className="mt-4 flex flex-col gap-2.5 text-sm text-fg-muted">
                  <li className="pl-8">
                    Orders past the return window: To be confirmed
                  </li>
                  <li className="pl-8">
                    Products bought from third-party sellers
                  </li>
                  <li className="pl-8">Other exclusions: To be confirmed</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Button href="/help#contact" variant="primary">
                Start a return
              </Button>
              <p className="text-xs text-fg-muted sm:text-sm">
                You will need your order number (starts with NL-) and email.
              </p>
            </div>
          </div>
        </section>

        {/* Section: Damaged or Missing */}
        <section
          id="damaged"
          aria-labelledby="damaged-heading"
          className="scroll-mt-20 border-b border-border bg-bg-elevated px-4 py-12 sm:px-8 sm:py-16 lg:px-16 lg:py-20"
        >
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-16">
              <div className="lg:w-[400px] lg:shrink-0">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
                  Damaged or missing
                </p>
                <h2
                  id="damaged-heading"
                  className="mt-2 font-archivo text-3xl font-extrabold uppercase tracking-tight text-fg sm:text-5xl"
                >
                  Damaged, missing or wrong item?
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-fg-muted sm:text-base">
                  Sorry about that. Reporting window: To be confirmed. We fix it
                  fast.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button href="/help#contact" variant="primary">
                    Report a problem
                  </Button>
                  <Button href="/help" variant="secondary">
                    Contact us
                  </Button>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-col gap-3">
                  {DAMAGED_STEPS.map((item) => (
                    <div
                      key={item.step}
                      className="flex items-start gap-4 rounded-card border border-border bg-bg p-4 sm:p-5"
                    >
                      <span
                        aria-hidden="true"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-gold font-archivo font-extrabold text-accent-fg"
                      >
                        {item.step}
                      </span>
                      <div>
                        <p className="font-archivo text-base font-bold text-fg">
                          {item.title}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-fg-muted">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section: FAQ */}
        <section
          id="faq"
          aria-labelledby="faq-heading"
          className="scroll-mt-20 px-4 py-12 sm:px-8 sm:py-16 lg:px-16 lg:py-20"
        >
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-8 lg:flex-row lg:gap-16">
              <div className="lg:w-[380px] lg:shrink-0">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
                  FAQ
                </p>
                <h2
                  id="faq-heading"
                  className="mt-2 font-archivo text-3xl font-extrabold uppercase tracking-tight text-fg sm:text-5xl"
                >
                  Shipping questions
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                  Still stuck? Contact us through our{" "}
                  <Link
                    href="/help"
                    className="font-bold text-fg underline underline-offset-4 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                  >
                    Help page
                  </Link>
                  .
                </p>
              </div>

              <div className="flex-1">
                {FAQ_ITEMS.map((faq) => (
                  <details
                    key={faq.question}
                    className="group border-b border-border py-5"
                  >
                    <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-base font-bold text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent [&::-webkit-details-marker]:hidden">
                      <span>{faq.question}</span>
                      <span
                        aria-hidden="true"
                        className="text-xl text-accent group-open:hidden"
                      >
                        +
                      </span>
                      <span
                        aria-hidden="true"
                        className="hidden text-xl text-accent group-open:inline"
                      >
                        −
                      </span>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <TrustStrip line="human" />
      <Newsletter variant="human" />
      <Footer line="human" />
    </MarketProvider>
  );
}
