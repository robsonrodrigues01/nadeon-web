import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { AffiliateApplicationForm } from "./_components/affiliate-application-form";

const creatorBenefits = [
  "Commission",
  "Free product to try",
  "Personal link and code",
  "Monthly payouts",
  "Creative assets",
];

const audienceTypes = [
  {
    title: "Creators",
    description:
      "Wellness, fitness and lifestyle creators on Instagram, TikTok and YouTube.",
  },
  {
    title: "Longevity podcasters",
    description:
      "Hosts and newsletter writers who cover healthy aging and the science behind it.",
  },
  {
    title: "Pet influencers",
    description:
      "Dog, cat and horse accounts that share their daily routine with their animals.",
  },
];

const questions = [
  "Do I need a minimum number of followers?",
  "When and how do I get paid?",
  "Can I promote both the Human and Pet lines?",
  "How long does my link track a visitor?",
  "Can I run paid ads with my code?",
  "Is there a cost to join?",
];

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Affiliates & Creators | Nadeon Labs",
    description:
      "Share what you take. Join the Nadeon creator program. Program details: To be confirmed.",
    pathname: "/affiliates",
  });
}

export default function AffiliatesPage() {
  return (
    <main id="main-content" className="flex-1" tabIndex={-1}>
      <section className="border-b border-border bg-bg px-5 py-14 text-fg sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
              AFFILIATES &amp; CREATORS
            </p>
            <h1 className="font-archivo text-4xl font-extrabold uppercase sm:text-6xl">
              Share what you take.
            </h1>
            <p className="max-w-3xl text-lg leading-relaxed text-fg-muted">
              Join the Nadeon creator program. Program details: To be confirmed.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#application"
                className="inline-flex min-h-11 items-center rounded-full bg-gradient-gold px-6 py-3 font-bold uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Apply to join
              </a>
              <a
                href="#guidelines"
                className="inline-flex min-h-11 items-center rounded-full border border-border px-6 py-3 font-bold uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                See the guidelines
              </a>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {creatorBenefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-center justify-between gap-4 rounded-card border border-border bg-bg-elevated p-5"
              >
                <span className="font-bold">{benefit}</span>
                <span className="text-sm text-fg-muted">To be confirmed</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-16 px-5 py-14 sm:px-8 sm:py-20">
        <section aria-labelledby="audience-title" className="space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
              WHO IT IS FOR
            </p>
            <h2
              id="audience-title"
              className="font-archivo text-3xl font-extrabold uppercase sm:text-4xl"
            >
              Made for three kinds of voices
            </h2>
          </div>
          <ul className="grid gap-4 md:grid-cols-3">
            {audienceTypes.map((audience) => (
              <li
                key={audience.title}
                className="rounded-card border border-border p-6 sm:p-8"
              >
                <h3 className="font-archivo text-xl font-bold">
                  {audience.title}
                </h3>
                <p className="mt-3 leading-relaxed text-fg-muted">
                  {audience.description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section
          id="how-it-works"
          aria-labelledby="how-title"
          className="scroll-mt-8 space-y-6 border-y border-border py-12"
        >
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
              HOW IT WORKS
            </p>
            <h2
              id="how-title"
              className="font-archivo text-3xl font-extrabold uppercase sm:text-4xl"
            >
              Start in three steps
            </h2>
          </div>
          <ol className="grid gap-4 md:grid-cols-3">
            {["Apply", "Get approved", "Share and earn"].map((step, index) => (
              <li key={step} className="rounded-card border border-border p-6">
                <p className="text-sm font-semibold text-fg-muted">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 font-archivo text-xl font-bold">{step}</h3>
                <p className="mt-2 text-fg-muted">To be confirmed</p>
              </li>
            ))}
          </ol>
        </section>

        <section
          id="application"
          aria-labelledby="application-title"
          className="scroll-mt-8 rounded-card border border-border bg-bg-elevated p-6 sm:p-10"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
            APPLY
          </p>
          <h2
            id="application-title"
            className="mt-3 font-archivo text-3xl font-extrabold uppercase"
          >
            Join the creator program
          </h2>
          <p className="mt-3 max-w-2xl text-fg-muted">Takes about 3 minutes.</p>
          <div className="mt-8">
            <AffiliateApplicationForm />
          </div>
        </section>

        <section
          id="guidelines"
          aria-labelledby="guidelines-title"
          className="scroll-mt-8 space-y-4 rounded-card border border-border p-6 sm:p-8"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
            CONTENT GUIDELINES
          </p>
          <h2
            id="guidelines-title"
            className="font-archivo text-3xl font-extrabold uppercase"
          >
            Keep it honest
          </h2>
          <p className="max-w-3xl leading-relaxed text-fg-muted">
            Affiliate terms and content guidelines: To be confirmed.
          </p>
        </section>

        <section aria-labelledby="faq-title" className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
            FAQ
          </p>
          <h2
            id="faq-title"
            className="font-archivo text-3xl font-extrabold uppercase"
          >
            Questions, answered
          </h2>
          <div className="divide-y divide-border border-y border-border">
            {questions.map((question) => (
              <details key={question} className="py-4">
                <summary className="min-h-11 cursor-pointer py-2 font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                  {question}
                </summary>
                <p className="pb-2 text-fg-muted">To be confirmed</p>
              </details>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-card border border-border p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <p className="max-w-2xl text-lg font-bold">
            More questions? To be confirmed.
          </p>
          <Link
            href="/help#contact"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-border px-5 py-3 font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Email the team
          </Link>
        </section>
      </div>
    </main>
  );
}
