import React from "react";
import { Button } from "@/components/ui/button";

export function StorySection() {
  return (
    <section
      aria-labelledby="about-story"
      className="w-full bg-bg text-fg py-14 sm:py-20 border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
            Our story
          </p>
          <h1
            id="about-story"
            className="font-archivo font-extrabold uppercase text-4xl sm:text-5xl text-fg"
          >
            Small lots. Big care.
          </h1>
          <p className="text-base sm:text-lg text-fg-muted leading-relaxed max-w-xl">
            Nadeon Labs makes NMN and NAD + formulas for people and for the
            animals they love. We do it in our own lab in Clifton, New Jersey,
            in small numbered lots, so every jar can be traced back to the batch
            it came from.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/human/shop" variant="primary">
              Shop the human line
            </Button>
            <Button href="/pet" variant="secondary">
              Shop for pets
            </Button>
          </div>
        </div>
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
            How it started
          </p>
          <h2 className="font-archivo font-extrabold uppercase text-2xl sm:text-3xl text-fg">
            Made by people who read labels
          </h2>
          <p className="text-base text-fg-muted leading-relaxed">
            We started Nadeon Labs after years of buying NMN with vague labels
            and no way to check what was inside. So we built the thing we
            wanted: a small lab that makes clean formulas, writes the exact dose
            on every label and publishes a lab report for every lot.
          </p>
          <p className="text-base text-fg-muted leading-relaxed">
            The same standard now covers our pet line, with soft chews, oils and
            drops for dogs, cats and horses.
          </p>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Stat
              term="Clifton, NJ"
              detail="Our own lab, not a white-label factory"
            />
            <Stat term="Every lot" detail="Numbered, dated and published" />
            <Stat term="People + pets" detail="Two lines, one standard" />
          </dl>
        </div>
      </div>
    </section>
  );
}

function Stat({ term, detail }: { term: string; detail: string }) {
  return (
    <div className="rounded-card border border-border bg-bg-elevated p-4">
      <dt className="font-archivo font-bold text-fg">{term}</dt>
      <dd className="mt-1 text-sm text-fg-muted">{detail}</dd>
    </div>
  );
}

const WHY_ITEMS: Array<{ mark?: string; title: string; text: string }> = [
  {
    mark: "NJ",
    title: "Own lab in Clifton, NJ",
    text: "Made in our own lab, not a white-label factory.",
  },
  {
    mark: "✓",
    title: "Lab report for every lot",
    text: "Third-party results published by lot number.",
  },
  {
    mark: "mg",
    title: "Exact dose on the label",
    text: "No proprietary blends. Every amount is listed.",
  },
  {
    mark: "99%",
    title: "NMN purity ≥99%",
    text: "Purity confirmed on each lot report.",
  },
  {
    title: "Vet-reviewed pet formulas",
    text: "Every pet product is reviewed by a veterinarian.",
  },
  {
    mark: "60",
    title: "60-day guarantee",
    text: "Not for you? We refund the first order.",
  },
];

export function WhySection() {
  return (
    <section
      aria-labelledby="about-why"
      className="w-full bg-bg-elevated text-fg py-14 sm:py-20 border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
          Why Nadeon
        </p>
        <h2
          id="about-why"
          className="mt-3 font-archivo font-extrabold uppercase text-3xl sm:text-4xl text-fg"
        >
          Six things we never skip
        </h2>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_ITEMS.map((item) => (
            <li
              key={item.title}
              className="rounded-card border border-border bg-bg p-6"
            >
              {item.mark && (
                <span
                  aria-hidden="true"
                  className="block font-archivo font-extrabold text-2xl text-accent"
                >
                  {item.mark}
                </span>
              )}
              <h3 className="mt-3 font-archivo font-bold text-lg text-fg">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-fg-muted leading-relaxed">
                {item.text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function MissionSection() {
  return (
    <section
      aria-labelledby="about-mission"
      className="w-full bg-bg text-fg py-14 sm:py-20 border-b border-border"
    >
      <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center space-y-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
          Our mission
        </p>
        <h2
          id="about-mission"
          className="font-archivo font-extrabold uppercase text-3xl sm:text-4xl text-fg"
        >
          Make NAD + support simple, honest and easy to verify.
        </h2>
        <p className="text-base sm:text-lg text-fg-muted">
          For you, and for the animals who share your life.
        </p>
      </div>
    </section>
  );
}

const VALUES = [
  {
    title: "Show the numbers",
    text: "Exact doses on every label. No proprietary blends. Lab results by lot.",
  },
  {
    title: "Small lots, big care",
    text: "We make less at a time so we can check more. Every lot is numbered and dated.",
  },
  {
    title: "Science before hype",
    text: 'We say "supports" because that is what the research backs. No miracle claims.',
  },
];

export function ValuesSection() {
  return (
    <section
      aria-labelledby="about-values"
      className="w-full bg-bg-elevated text-fg py-14 sm:py-20 border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
          Our values
        </p>
        <h2
          id="about-values"
          className="mt-3 font-archivo font-extrabold uppercase text-3xl sm:text-4xl text-fg"
        >
          What we stand for
        </h2>
        <ol className="mt-10 grid gap-5 md:grid-cols-3">
          {VALUES.map((value, index) => (
            <li
              key={value.title}
              className="rounded-card border border-border bg-bg p-6"
            >
              <span
                aria-hidden="true"
                className="font-archivo font-extrabold text-2xl text-accent"
              >
                {index + 1}
              </span>
              <h3 className="mt-3 font-archivo font-bold text-lg text-fg">
                {value.title}
              </h3>
              <p className="mt-2 text-sm text-fg-muted leading-relaxed">
                {value.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const PROCESS = [
  {
    title: "Source",
    text: "We buy raw materials from qualified suppliers, each with its own documentation.",
  },
  {
    title: "Check",
    text: "Every raw material is identity-tested on arrival before production.",
  },
  {
    title: "Make",
    text: "Blended, encapsulated or filled in a small lot in our Clifton lab.",
  },
  {
    title: "Number",
    text: "Each lot gets a number and a date that go on every label.",
  },
  {
    title: "Test",
    text: "A finished-lot sample goes to an independent third-party lab.",
  },
  {
    title: "Ship",
    text: "Sealed jars ship, and the COA goes online for that lot.",
  },
];

export function ProcessSection() {
  return (
    <section
      aria-labelledby="about-process"
      className="w-full bg-bg text-fg py-14 sm:py-20 border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
          Our process
        </p>
        <h2
          id="about-process"
          className="mt-3 font-archivo font-extrabold uppercase text-3xl sm:text-4xl text-fg"
        >
          From raw material to jar
        </h2>
        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {PROCESS.map((step, index) => (
            <li
              key={step.title}
              className="rounded-card border border-border bg-bg-elevated p-5"
            >
              <span
                aria-hidden="true"
                className="font-archivo font-extrabold text-xl text-accent"
              >
                {index + 1}
              </span>
              <h3 className="mt-2 font-archivo font-bold text-base text-fg">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-fg-muted leading-relaxed">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
        <div className="mt-10">
          <Button href="/lab-results" variant="secondary">
            See our lab results
          </Button>
        </div>
      </div>
    </section>
  );
}
