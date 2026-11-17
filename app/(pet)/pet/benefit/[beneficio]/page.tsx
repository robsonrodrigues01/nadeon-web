import type { Metadata } from "next";
import Link from "next/link";
import { PetRegulatoryNotice } from "../../_components/pet-regulatory-notice";
import { buildMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ beneficio: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Shop by benefit - Nadeon Pet",
    description: "To be confirmed",
    pathname: "/pet/benefit",
    noIndex: true,
  });
}

export default async function BenefitCollectionPage({ params }: PageProps) {
  await params;
  const label = "To be confirmed";

  return (
    <main id="main-content" className="flex-1" tabIndex={-1}>
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-12">
        <nav aria-label="Breadcrumb" className="text-sm text-fg-muted">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link
                href="/pet"
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Pet
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href="/pet/dogs"
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Shop
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <span>Shop by benefit</span>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">{label}</li>
          </ol>
        </nav>

        <section
          className="grid gap-8 py-12 md:grid-cols-2 md:items-center lg:py-20"
          aria-labelledby="benefit-title"
        >
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-fg-muted">
              Shop by benefit
            </p>
            <h1
              id="benefit-title"
              className="mt-3 font-archivo text-4xl font-extrabold uppercase leading-tight text-fg sm:text-5xl"
            >
              {label} support for dogs
            </h1>
            <p className="mt-5 max-w-xl text-lg text-fg-muted">
              To be confirmed
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="#hero-formula"
                className="inline-flex min-h-11 items-center rounded-pill bg-fg px-5 font-bold text-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Shop {label}
              </Link>
              <Link
                href="/pet/quiz"
                className="inline-flex min-h-11 items-center rounded-pill border border-border px-5 font-bold text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Take the quiz
              </Link>
            </div>
          </div>
          <div className="flex min-h-64 items-center justify-center rounded-card border border-border bg-bg-elevated p-8 text-center text-fg-muted">
            To be confirmed
          </div>
        </section>

        <ul className="grid gap-4 border-y border-border py-6 sm:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <li key={item} className="text-center font-bold text-fg">
              To be confirmed
            </li>
          ))}
        </ul>

        <section className="py-14" aria-labelledby="signs-title">
          <p className="text-sm font-bold uppercase tracking-wider text-fg-muted">
            Signs to watch
          </p>
          <h2
            id="signs-title"
            className="mt-2 font-archivo text-3xl font-extrabold uppercase text-fg"
          >
            Is your dog showing these?
          </h2>
          <p className="mt-3 text-fg-muted">
            To be confirmed. Not a diagnosis: if something feels wrong, talk to
            your vet.
          </p>
          <ul className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <li key={item} className="rounded-card border border-border p-5">
                <h3 className="font-bold text-fg">To be confirmed</h3>
                <p className="mt-2 text-sm text-fg-muted">To be confirmed</p>
              </li>
            ))}
          </ul>
        </section>

        <section
          id="hero-formula"
          className="grid gap-8 rounded-card bg-bg-elevated p-6 sm:p-8 lg:grid-cols-2"
          aria-labelledby="hero-formula-title"
        >
          <div className="flex min-h-72 items-center justify-center rounded-card border border-border bg-bg p-8 text-center text-fg-muted">
            To be confirmed
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-fg-muted">
              The hero formula
            </p>
            <h2
              id="hero-formula-title"
              className="mt-2 font-archivo text-3xl font-extrabold uppercase text-fg"
            >
              Start here for {label}
            </h2>
            <fieldset
              className="mt-6"
              aria-label="Hero formula purchase options"
            >
              <legend className="font-bold text-fg">
                Size and purchase options
              </legend>
              <div className="mt-3 flex flex-wrap gap-3">
                {[1, 2, 3].map((item) => (
                  <label
                    key={item}
                    className="flex min-h-11 cursor-pointer items-center gap-2 rounded-field border border-border px-3 text-sm text-fg"
                  >
                    <input type="radio" name="hero-size" disabled />
                    To be confirmed
                  </label>
                ))}
              </div>
              <div className="mt-5 grid gap-2">
                <label className="flex min-h-11 items-center gap-2 text-fg">
                  <input type="radio" name="purchase-type" disabled />
                  Subscribe &amp; save To be confirmed
                </label>
                <label className="flex min-h-11 items-center gap-2 text-fg">
                  <input type="radio" name="purchase-type" disabled />
                  One-time purchase
                </label>
              </div>
              <p className="mt-4 text-sm text-fg-muted">
                Delivery every To be confirmed weeks
              </p>
            </fieldset>
            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                aria-label="Decrease quantity"
                disabled
                className="min-h-11 min-w-11 rounded-full border border-border disabled:opacity-50"
              >
                −
              </button>
              <output aria-label="Quantity" className="min-w-8 text-center">
                1
              </output>
              <button
                type="button"
                aria-label="Increase quantity"
                disabled
                className="min-h-11 min-w-11 rounded-full border border-border disabled:opacity-50"
              >
                +
              </button>
            </div>
            <button
              type="button"
              disabled
              className="mt-5 min-h-11 rounded-pill bg-fg px-6 font-bold text-bg disabled:opacity-50"
            >
              Add to cart
            </button>
            <p className="mt-3 text-sm text-fg-muted">
              Free shipping at To be confirmed
            </p>
            <p className="mt-2 text-sm text-fg-muted">To be confirmed</p>
            <p className="mt-2 text-sm text-fg-muted">
              Dose by weight · To be confirmed
            </p>
          </div>
        </section>

        <section className="py-14" aria-labelledby="routine-title">
          <p className="text-sm font-bold uppercase tracking-wider text-fg-muted">
            Kits for {label}
          </p>
          <h2
            id="routine-title"
            className="mt-2 font-archivo text-3xl font-extrabold uppercase text-fg"
          >
            Build the routine
          </h2>
          <p className="mt-3 text-fg-muted">To be confirmed</p>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <li
                key={item}
                className="rounded-card border border-border bg-bg-elevated p-5"
              >
                <h3 className="font-bold text-fg">To be confirmed</h3>
                <p className="mt-2 text-fg-muted">To be confirmed</p>
                <p className="mt-3 font-bold text-fg">To be confirmed</p>
                <button
                  type="button"
                  disabled
                  className="mt-4 min-h-11 rounded-pill bg-fg px-5 font-bold text-bg disabled:opacity-50"
                >
                  Add kit to cart
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="border-t border-border py-12"
          aria-labelledby="inside-title"
        >
          <p className="text-sm font-bold uppercase tracking-wider text-fg-muted">
            How it works
          </p>
          <h2
            id="inside-title"
            className="mt-2 font-archivo text-3xl font-extrabold uppercase text-fg"
          >
            Inside the formula
          </h2>
          <p className="mt-4 text-fg-muted">To be confirmed</p>
          <ol className="mt-6 grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((step) => (
              <li key={step} className="rounded-card border border-border p-5">
                <span className="text-sm font-bold text-fg-muted">{step}</span>
                <h3 className="mt-2 font-bold text-fg">To be confirmed</h3>
                <p className="mt-2 text-sm text-fg-muted">To be confirmed</p>
              </li>
            ))}
          </ol>
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <li key={item} className="rounded-card bg-bg-elevated p-5">
                <p className="text-sm font-bold uppercase text-fg-muted">
                  To be confirmed
                </p>
                <h3 className="mt-2 font-bold text-fg">To be confirmed</h3>
                <p className="mt-2 text-sm text-fg-muted">To be confirmed</p>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="border-t border-border py-12"
          aria-labelledby="learn-title"
        >
          <p className="text-sm font-bold uppercase tracking-wider text-fg-muted">
            Learn
          </p>
          <h2
            id="learn-title"
            className="mt-2 font-archivo text-3xl font-extrabold uppercase text-fg"
          >
            Read up on {label}
          </h2>
          <Link
            href="/pet/journal"
            className="mt-5 inline-flex min-h-11 items-center rounded-pill border border-border px-5 font-bold text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Visit the journal
          </Link>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((article) => (
              <li
                key={article}
                className="rounded-card border border-border p-5"
              >
                <p className="text-sm text-fg-muted">To be confirmed</p>
                <h3 className="mt-3 font-bold text-fg">To be confirmed</h3>
                <p className="mt-2 text-sm text-fg-muted">To be confirmed</p>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="border-t border-border py-12"
          aria-labelledby="faq-title"
        >
          <h2
            id="faq-title"
            className="font-archivo text-3xl font-extrabold uppercase text-fg"
          >
            {label} questions
          </h2>
          <ul className="mt-5 divide-y divide-border">
            {[
              "How long until I see a difference?",
              "How do I dose by weight?",
              "Can I combine products for To be confirmed?",
              "Is it safe for puppies or senior dogs?",
              "Do I need to talk to my vet first?",
            ].map((question) => (
              <li key={question} className="py-4">
                <details>
                  <summary className="min-h-11 cursor-pointer py-2 font-bold text-fg">
                    {question}
                  </summary>
                  <p className="pt-2 text-fg-muted">To be confirmed</p>
                </details>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="border-t border-border py-10"
          aria-labelledby="quiz-cta-title"
        >
          <h2
            id="quiz-cta-title"
            className="font-archivo text-2xl font-extrabold uppercase text-fg"
          >
            Not sure what your dog needs?
          </h2>
          <p className="mt-3 max-w-2xl text-fg-muted">
            Answer a few quick questions about age, size and goals. Get a
            routine and a dose by weight.
          </p>
          <Link
            href="/pet/quiz"
            className="mt-5 inline-flex min-h-11 items-center rounded-pill bg-fg px-5 font-bold text-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Take the quiz
          </Link>
        </section>

        <p className="border-t border-border py-8 text-xs text-fg-muted">
          *These statements have not been evaluated by the Food and Drug
          Administration. These products are not intended to diagnose, treat,
          cure or prevent any disease. This page is for education only and is
          not veterinary advice. Talk to your veterinarian before starting any
          supplement.
        </p>
      </div>
      <PetRegulatoryNotice />
    </main>
  );
}
