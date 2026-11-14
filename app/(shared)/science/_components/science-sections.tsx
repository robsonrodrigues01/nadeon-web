import React from "react";
import { Button } from "@/components/ui/button";
import { Claim } from "@/components/commerce/product-card/claim";
import { NadDeclineChart } from "./nad-decline-chart";

const WHAT_NAD_DOES = [
  {
    title: "Energy metabolism",
    body: "NAD+ helps your cells turn the food you eat into usable energy inside the mitochondria.*",
  },
  {
    title: "Cellular maintenance",
    body: "Enzymes involved in normal cellular upkeep, including DNA maintenance, use NAD+ as fuel.*",
  },
  {
    title: "Sirtuin activity",
    body: "Sirtuins are proteins studied in healthy aging research. They need NAD+ to work.*",
  },
];

const PATHWAY_STEPS = [
  {
    chip: "NMN",
    label: "Step 1",
    title: "You take it",
    body: "NMN (nicotinamide mononucleotide) is a form of vitamin B3, taken as a capsule or powder.",
  },
  {
    chip: "Absorb",
    label: "Step 2",
    title: "It enters your cells",
    body: "NMN is absorbed and carried into cells, where the conversion happens.",
  },
  {
    chip: "Convert",
    label: "Step 3",
    title: "One enzyme step",
    body: "Enzymes called NMNAT add one small piece to NMN. That single step makes NAD+.",
  },
  {
    chip: "NAD+",
    label: "Step 4",
    title: "Cells put it to work",
    body: "NAD+ supports energy metabolism and normal cellular upkeep.*",
  },
];

const DECLINE_REASONS = [
  {
    title: "More demand",
    body: "With age, enzymes such as CD38 and PARPs use up more NAD+.",
  },
  {
    title: "Less recycling",
    body: "The salvage pathway that recycles NAD+ may work less efficiently over time.",
  },
  {
    title: "Daily habits",
    body: "Sleep, activity and diet also influence how much NAD+ cells have.",
  },
];

const sectionClass =
  "w-full bg-bg text-fg py-14 sm:py-20 border-b border-border";
const innerClass = "max-w-7xl mx-auto px-5 sm:px-8 lg:px-12";
const eyebrowClass =
  "text-xs font-semibold uppercase tracking-widest text-fg-muted";
const h2Class =
  "font-archivo font-extrabold uppercase text-3xl sm:text-4xl text-fg";
const h3Class = "font-archivo font-bold text-xl text-fg";
const bodyClass = "text-base text-fg-muted leading-relaxed";

export function ScienceHero() {
  return (
    <section
      aria-labelledby="science-hero"
      className="w-full bg-bg text-fg py-14 sm:py-20 border-b border-border"
    >
      <div className={`${innerClass} space-y-6`}>
        <p className={eyebrowClass}>The science</p>
        <h1
          id="science-hero"
          className="font-archivo font-extrabold uppercase text-4xl sm:text-6xl text-fg"
        >
          The science of NAD+
        </h1>
        <p className="text-base sm:text-lg text-fg-muted leading-relaxed max-w-2xl">
          NAD+ is a coenzyme found in every living cell. Here is what it does,
          how NMN becomes NAD+, and how we test what goes into every jar. Plain
          language, careful claims.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="/human/shop" variant="primary">
            Shop NMN formulas
          </Button>
          <Button href="/lab-results" variant="secondary">
            See lab results
          </Button>
        </div>
      </div>
    </section>
  );
}

export function WhatNadDoesSection() {
  return (
    <section aria-labelledby="nad-does" className={sectionClass}>
      <div className={`${innerClass} space-y-10`}>
        <div className="space-y-3">
          <p className={eyebrowClass}>What NAD+ does</p>
          <p className="font-archivo font-extrabold text-2xl text-accent">
            NAD+
          </p>
          <p className="text-sm uppercase tracking-widest text-fg-muted">
            Nicotinamide adenine dinucleotide
          </p>
          <h2 id="nad-does" className={h2Class}>
            A coenzyme with a big job
          </h2>
        </div>
        <ol className="grid gap-4 md:grid-cols-3">
          {WHAT_NAD_DOES.map((item, index) => (
            <li
              key={item.title}
              className="rounded-card border border-border bg-bg-elevated p-6 space-y-3"
            >
              <p className="font-archivo font-bold text-accent">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className={h3Class}>{item.title}</h3>
              <p className={bodyClass}>
                <Claim>{item.body}</Claim>
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function NmnPathwaySection() {
  return (
    <section aria-labelledby="nmn-pathway" className={sectionClass}>
      <div className={`${innerClass} space-y-10`}>
        <div className="space-y-3">
          <p className={eyebrowClass}>How NMN becomes NAD+</p>
          <h2 id="nmn-pathway" className={h2Class}>
            From capsule to coenzyme
          </h2>
        </div>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PATHWAY_STEPS.map((step) => (
            <li
              key={step.label}
              className="rounded-card border border-border bg-bg-elevated p-6 space-y-3"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
                {step.label}
              </p>
              <span className="inline-block rounded-pill border border-border px-3 py-1 text-sm font-semibold text-accent">
                {step.chip}
              </span>
              <h3 className={h3Class}>{step.title}</h3>
              <p className={bodyClass}>
                {step.label === "Step 4" ? (
                  <Claim>{step.body}</Claim>
                ) : (
                  step.body
                )}
              </p>
            </li>
          ))}
        </ol>
        <div className="max-w-3xl space-y-3">
          <h3 className={h3Class}>Why NMN and not just vitamin B3?</h3>
          <p className={bodyClass}>
            NMN sits one step away from NAD+ in the pathway your cells already
            use to recycle it, often called the salvage pathway. Other B3 forms
            take more steps.
          </p>
        </div>
      </div>
    </section>
  );
}

export function NadDeclineSection() {
  return (
    <section aria-labelledby="nad-decline" className={sectionClass}>
      <div
        className={`${innerClass} grid gap-10 lg:grid-cols-2 lg:items-start`}
      >
        <div className="space-y-8">
          <div className="space-y-3">
            <p className={eyebrowClass}>Why it declines</p>
            <h2 id="nad-decline" className={h2Class}>
              NAD+ and age
            </h2>
            <p className={bodyClass}>
              Studies in people and animals report that NAD+ levels tend to be
              lower in older tissues. Researchers point to a few reasons:
            </p>
          </div>
          <ol className="space-y-4">
            {DECLINE_REASONS.map((reason, index) => (
              <li
                key={reason.title}
                className="flex gap-4 rounded-card border border-border bg-bg-elevated p-5"
              >
                <span
                  className="font-archivo font-extrabold text-2xl text-accent"
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <div className="space-y-1">
                  <h3 className={h3Class}>{reason.title}</h3>
                  <p className={bodyClass}>{reason.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <figure className="rounded-card border border-border bg-bg-elevated p-5 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <h3 className={h3Class}>NAD+ over a lifetime</h3>
            <span className="rounded-pill border border-border px-3 py-1 text-xs font-semibold uppercase tracking-widest text-fg-muted">
              Illustrative
            </span>
          </div>
          <NadDeclineChart />
          <figcaption className="text-sm text-fg-muted leading-relaxed">
            Illustrative curve, not real data and not to scale. It shows the
            general trend reported in published research, not your personal
            levels.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
