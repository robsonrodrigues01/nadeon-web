import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { contentProvider } from "@/lib/providers";
import { buildBreadcrumbJsonLd, buildMetadata, JsonLd } from "@/lib/seo";
import { Claim } from "@/components/commerce/product-card/claim";
import { PetRegulatoryNotice } from "../../_components/pet-regulatory-notice";
import { AddKitButton } from "./_components/add-kit-button";
import { GuideFaq } from "./_components/guide-faq";

interface BreedGuidePageProps {
  params: Promise<{ raca: string }>;
}

export async function generateStaticParams() {
  const breedGuides = await contentProvider.listBreedGuides();
  return breedGuides.map((guide) => ({
    raca: guide.slug,
  }));
}

export async function generateMetadata({
  params,
}: BreedGuidePageProps): Promise<Metadata> {
  const { raca } = await params;
  const breed = await contentProvider.getBreedGuide(raca);

  if (!breed) {
    return buildMetadata({
      title: "Breed Guide Not Found | Nadeon Pet",
      description: "The requested breed care guide was not found.",
      pathname: `/pet/breeds/${raca}`,
    });
  }

  return buildMetadata({
    title: `${breed.title} Care Guide & Supplement Dose - Nadeon Pet`,
    description: `A care guide for ${breed.title}s at every age: health topics by life stage, weight, exercise, food and vet-reviewed supplement guidance.`,
    pathname: `/pet/breeds/${breed.slug}`,
  });
}

export default async function BreedGuidePage({ params }: BreedGuidePageProps) {
  const { raca } = await params;
  const breed = await contentProvider.getBreedGuide(raca);

  if (!breed) {
    notFound();
  }

  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: "Pet", url: "/pet" },
    { name: "Journal", url: "/pet" },
    { name: "Breed guides", url: "/pet" },
    { name: breed.title, url: `/pet/breeds/${breed.slug}` },
  ]);

  return (
    <main id="main-content" tabIndex={-1} className="flex-1 bg-bg text-fg">
      <JsonLd data={{ ...breadcrumbLd }} id="breed-guide-breadcrumb-ld" />

      {/* Hero Section */}
      <section
        aria-labelledby="breed-title-heading"
        className="relative overflow-hidden bg-gradient-to-b from-bg-elevated/90 to-bg px-4 sm:px-6 md:px-12 pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-border/40"
      >
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="text-xs sm:text-sm text-fg-muted flex flex-wrap items-center gap-2 mb-6"
          >
            <Link href="/pet" className="hover:text-fg transition-colors">
              Pet
            </Link>
            <span aria-hidden="true" className="opacity-40">
              /
            </span>
            <Link href="/pet" className="hover:text-fg transition-colors">
              Journal
            </Link>
            <span aria-hidden="true" className="opacity-40">
              /
            </span>
            <Link href="/pet" className="hover:text-fg transition-colors">
              Breed guides
            </Link>
            <span aria-hidden="true" className="opacity-40">
              /
            </span>
            <span aria-current="page" className="text-fg font-medium">
              {breed.title}
            </span>
          </nav>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-block px-3 py-1 rounded-full bg-fg text-bg text-[11px] font-bold tracking-widest uppercase shadow-xs">
              Breed guide
            </span>
            <span className="text-xs font-bold text-fg-muted uppercase tracking-wider">
              Dogs · {breed.readingMinutes ?? 9} min read
            </span>
          </div>

          <h1
            id="breed-title-heading"
            className="font-archivo font-extrabold text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight text-fg leading-none"
          >
            {breed.title}
          </h1>

          <p className="mt-4 text-base sm:text-xl text-fg-muted max-w-3xl leading-relaxed">
            A care guide for Labs at every age: common health topics by life
            stage, weight and exercise, food, and a supplement dose for To be
            confirmed lb dogs.
          </p>

          {/* Author & Reviewer Bylines */}
          <div className="flex flex-wrap items-center gap-6 mt-8 pt-6 border-t border-border/50 text-xs sm:text-sm text-fg-muted">
            <div className="flex items-center gap-3">
              <div
                aria-hidden="true"
                className="w-10 h-10 rounded-full bg-bg-elevated border border-border flex items-center justify-center font-bold text-fg text-xs"
              >
                NL
              </div>
              <div>
                <div className="font-bold text-fg">
                  Nadeon Pet Health Editorial
                </div>
                <div className="text-xs opacity-75">To be confirmed</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                aria-hidden="true"
                className="w-10 h-10 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center font-bold text-accent text-xs"
              >
                DVM
              </div>
              <div>
                <div className="font-bold text-fg">
                  Reviewed by{" "}
                  {breed.reviewer !== "To be confirmed"
                    ? breed.reviewer
                    : "Veterinary Advisory Board (To be confirmed)"}
                </div>
                <div className="text-xs opacity-75">
                  License # To be confirmed · Date To be confirmed
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area: Facts, TOC & Sections */}
      <div className="px-4 sm:px-6 md:px-12 py-10 sm:py-16 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Column: Facts Card & In This Guide Navigation */}
        <aside className="lg:col-span-4 flex flex-col gap-8">
          {/* Breed facts card */}
          <section
            aria-labelledby="breed-facts-heading"
            className="rounded-3xl border border-border/80 bg-bg-elevated/40 p-6 sm:p-7 flex flex-col gap-5 shadow-xs"
          >
            <div className="aspect-[4/3] rounded-2xl bg-bg-elevated border border-border/60 flex items-center justify-center text-xs font-bold text-fg-muted/60 uppercase tracking-widest">
              Labrador photo
            </div>

            <div>
              <h2
                id="breed-facts-heading"
                className="font-archivo font-extrabold text-2xl uppercase tracking-tight text-fg"
              >
                Breed facts
              </h2>
              <div className="divide-y divide-border/50 mt-3 text-sm">
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-fg-muted font-medium">Size</span>
                  <span className="font-bold text-fg">{breed.facts.size}</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-fg-muted font-medium">
                    Weight range
                  </span>
                  <span className="font-bold text-fg">
                    {breed.facts.weightRange}
                  </span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-fg-muted font-medium">
                    Life expectancy
                  </span>
                  <span className="font-bold text-fg">
                    {breed.facts.lifeExpectancy}
                  </span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-fg-muted font-medium">
                    Energy level
                  </span>
                  <span className="font-bold text-fg">
                    {breed.facts.energyLevel}
                  </span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-fg-muted font-medium">Breed group</span>
                  <span className="font-bold text-fg">{breed.facts.group}</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-fg-muted font-medium">Coat</span>
                  <span className="font-bold text-fg">{breed.facts.coat}</span>
                </div>
              </div>
              <p className="text-xs text-fg-muted mt-3 italic">
                Values are examples. Individual dogs vary.
              </p>
            </div>
          </section>

          {/* In This Guide Navigation */}
          <nav
            aria-label="In this guide"
            className="rounded-3xl border border-border/80 bg-bg-elevated/30 p-6 sm:p-7 flex flex-col gap-4 sticky top-6"
          >
            <h3 className="font-archivo font-extrabold text-lg uppercase tracking-tight text-fg">
              In this guide
            </h3>
            <ol className="flex flex-col gap-2.5 text-sm font-bold text-fg/85">
              <li>
                <a
                  href="#about-the-breed"
                  className="hover:text-accent transition-colors"
                >
                  01 About the breed
                </a>
              </li>
              <li>
                <a
                  href="#health-by-life-stage"
                  className="hover:text-accent transition-colors"
                >
                  02 Health by life stage
                </a>
              </li>
              <li>
                <a
                  href="#weight-and-exercise"
                  className="hover:text-accent transition-colors"
                >
                  03 Weight & exercise
                </a>
              </li>
              <li>
                <a
                  href="#nutrition-notes"
                  className="hover:text-accent transition-colors"
                >
                  04 Nutrition notes
                </a>
              </li>
              <li>
                <a
                  href="#supplement-guide"
                  className="hover:text-accent transition-colors"
                >
                  05 Supplement guide
                </a>
              </li>
              <li>
                <a
                  href="#when-to-see-your-vet"
                  className="hover:text-accent transition-colors"
                >
                  06 When to see your vet
                </a>
              </li>
            </ol>

            {/* Quiz Callout Box */}
            <div className="mt-4 pt-4 border-t border-border/50 flex flex-col gap-2">
              <div className="font-extrabold text-sm text-fg">
                Dose for your Lab
              </div>
              <div className="text-xs text-fg-muted">
                Take the 60-second quiz.
              </div>
              <Link
                href="/pet/quiz"
                className="mt-1 min-h-11 px-4 py-2.5 rounded-full bg-accent text-accent-fg font-extrabold text-xs text-center hover:opacity-95 transition-all shadow-xs"
              >
                Take the quiz
              </Link>
            </div>
          </nav>
        </aside>

        {/* Right Column: 6 Guide Sections & FAQ */}
        <div className="lg:col-span-8 flex flex-col gap-14">
          {/* Sample Copy Notice */}
          <div className="p-4 rounded-2xl border border-border/80 bg-bg-elevated/40 text-xs text-fg-muted leading-relaxed">
            <span className="font-bold text-fg uppercase mr-1">
              SAMPLE COPY:
            </span>
            Body text below is placeholder content for layout only. Final copy
            will be written and reviewed by a veterinarian, using structure and
            function language only.
          </div>

          {/* Section 01: About the breed */}
          <section
            id="about-the-breed"
            className="flex flex-col gap-3 scroll-mt-20"
          >
            <span className="text-xs font-bold tracking-widest text-accent uppercase">
              01
            </span>
            <h2 className="font-archivo font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-fg">
              About the breed
            </h2>
            <div className="text-base text-fg-muted leading-relaxed flex flex-col gap-3">
              <p>
                Labs are friendly, food-motivated and built to work. This
                paragraph introduces temperament, history and what daily life
                with a Lab looks like.
              </p>
              <p>
                Sample copy. Short sentences, plain words, one idea per
                paragraph, with links to related guides.
              </p>
            </div>
          </section>

          {/* Section 02: Common health topics by life stage */}
          <section
            id="health-by-life-stage"
            className="flex flex-col gap-4 scroll-mt-20"
          >
            <span className="text-xs font-bold tracking-widest text-accent uppercase">
              02
            </span>
            <h2 className="font-archivo font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-fg">
              Common health topics by life stage
            </h2>
            <p className="text-sm text-fg-muted">
              Sample copy. Topics to discuss with your vet at each stage. Not a
              diagnosis list.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
              <div className="p-5 rounded-2xl border border-border/80 bg-bg-elevated/40 flex flex-col gap-2">
                <div className="font-archivo font-extrabold text-lg text-fg">
                  Puppy
                </div>
                <div className="text-xs font-bold text-accent">0 to 1 year</div>
                <ul className="text-xs text-fg-muted space-y-1.5 mt-2 list-disc list-inside">
                  <li>Steady growth, not too fast</li>
                  <li>Hip and elbow screening talk</li>
                  <li>Vaccines and parasite plan</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl border border-border/80 bg-bg-elevated/40 flex flex-col gap-2">
                <div className="font-archivo font-extrabold text-lg text-fg">
                  Adult
                </div>
                <div className="text-xs font-bold text-accent">
                  1 to 7 years
                </div>
                <ul className="text-xs text-fg-muted space-y-1.5 mt-2 list-disc list-inside">
                  <li>Weight creep is common</li>
                  <li>Ear checks after swimming</li>
                  <li>Daily joint-friendly exercise</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl border border-border/80 bg-bg-elevated/40 flex flex-col gap-2">
                <div className="font-archivo font-extrabold text-lg text-fg">
                  Senior
                </div>
                <div className="text-xs font-bold text-accent">7+ years</div>
                <ul className="text-xs text-fg-muted space-y-1.5 mt-2 list-disc list-inside">
                  <li>Stiffness after rest</li>
                  <li>Lumps, teeth and eyes</li>
                  <li>Twice-yearly vet visits</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 03: Weight & exercise */}
          <section
            id="weight-and-exercise"
            className="flex flex-col gap-4 scroll-mt-20"
          >
            <span className="text-xs font-bold tracking-widest text-accent uppercase">
              03
            </span>
            <h2 className="font-archivo font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-fg">
              Weight & exercise
            </h2>
            <p className="text-sm text-fg-muted leading-relaxed">
              Exercise and healthy body composition are essential for
              large-breed joint wellness.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
              <div className="p-4 rounded-xl border border-border/70 bg-bg-elevated/30 text-center">
                <div className="text-xs font-medium text-fg-muted">
                  Typical weight
                </div>
                <div className="font-archivo font-extrabold text-lg text-fg mt-1">
                  To be confirmed
                </div>
                <div className="text-[10px] text-fg-muted opacity-75">
                  To be confirmed
                </div>
              </div>
              <div className="p-4 rounded-xl border border-border/70 bg-bg-elevated/30 text-center">
                <div className="text-xs font-medium text-fg-muted">
                  Daily activity
                </div>
                <div className="font-archivo font-extrabold text-lg text-fg mt-1">
                  60 to 90 min
                </div>
                <div className="text-[10px] text-fg-muted opacity-75">
                  (split in two)
                </div>
              </div>
              <div className="p-4 rounded-xl border border-border/70 bg-bg-elevated/30 text-center">
                <div className="text-xs font-medium text-fg-muted">
                  Low-impact
                </div>
                <div className="font-archivo font-extrabold text-lg text-fg mt-1">
                  Swim & fetch
                </div>
                <div className="text-[10px] text-fg-muted opacity-75">
                  (favorites)
                </div>
              </div>
              <div className="p-4 rounded-xl border border-border/70 bg-bg-elevated/30 text-center">
                <div className="text-xs font-medium text-fg-muted">
                  Rib check
                </div>
                <div className="font-archivo font-extrabold text-lg text-fg mt-1">
                  Light touch
                </div>
                <div className="text-[10px] text-fg-muted opacity-75">
                  (feel ribs)
                </div>
              </div>
            </div>
          </section>

          {/* Section 04: Nutrition notes */}
          <section
            id="nutrition-notes"
            className="flex flex-col gap-3 scroll-mt-20"
          >
            <span className="text-xs font-bold tracking-widest text-accent uppercase">
              04
            </span>
            <h2 className="font-archivo font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-fg">
              Nutrition notes
            </h2>
            <ul className="text-sm text-fg-muted space-y-2.5 list-disc list-inside leading-relaxed">
              <li>Measure meals: Labs tend to ask for more than they need.</li>
              <li>Count treats as part of the daily total.</li>
              <li>Large-breed puppy food for steady growth.</li>
              <li>Ask your vet about food changes for seniors.</li>
            </ul>
          </section>

          {/* Section 05: Supplement guide for Labradors */}
          <section
            id="supplement-guide"
            className="flex flex-col gap-4 scroll-mt-20"
          >
            <span className="text-xs font-bold tracking-widest text-accent uppercase">
              05
            </span>
            <h2 className="font-archivo font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-fg">
              Supplement guide for Labradors
            </h2>
            <p className="text-sm text-fg-muted">
              How NMN fits a Lab routine and which formula suits each age.*
            </p>

            <div className="p-5 rounded-2xl border border-accent/40 bg-accent/10 flex flex-col gap-2">
              <span className="text-xs font-bold tracking-wider uppercase text-accent">
                DOSE FOR A 55 TO 80 LB LABRADOR
              </span>
              <div className="font-archivo font-extrabold text-xl text-fg">
                Dose: To be confirmed
              </div>
              <p className="text-xs text-fg-muted">
                Product names, formats and dosages are To be confirmed. Give
                with or after a meal. Check with your vet first.*
              </p>
            </div>

            <div className="text-xs text-fg-muted italic">
              <Claim showDisclaimer={false}>
                Dose is from the label for this weight range. Check with your
                vet first. Supports healthy aging and joint function.*
              </Claim>
            </div>
          </section>

          {/* Section 06: When to see your vet */}
          <section
            id="when-to-see-your-vet"
            className="flex flex-col gap-3 scroll-mt-20"
          >
            <span className="text-xs font-bold tracking-widest text-accent uppercase">
              06
            </span>
            <h2 className="font-archivo font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-fg">
              When to see your vet
            </h2>
            <ul className="text-sm text-fg-muted space-y-2 list-disc list-inside leading-relaxed">
              <li>Limping or stiffness that lasts more than a day</li>
              <li>Sudden change in appetite, thirst or weight</li>
              <li>Vomiting or diarrhea for more than 24 hours</li>
              <li>New lumps, or a lump that changes</li>
              <li>Collapse or trouble breathing after exercise</li>
            </ul>
            <p className="text-xs text-fg-muted font-bold mt-2">
              If something feels wrong, call your vet. Supplements do not
              replace veterinary care.
            </p>
          </section>

          {/* FAQ Accordion */}
          <GuideFaq breedTitle={breed.title} />

          {/* Related Breeds */}
          <section
            aria-labelledby="related-breeds-heading"
            className="flex flex-col gap-6 pt-6 border-t border-border/50"
          >
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs font-bold tracking-widest uppercase text-fg-muted">
                  RELATED BREEDS
                </span>
                <h2
                  id="related-breeds-heading"
                  className="font-archivo font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-fg"
                >
                  More breed guides
                </h2>
              </div>
              <Link
                href="/pet/dogs"
                className="text-xs sm:text-sm font-bold text-accent hover:underline"
              >
                All breed guides →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { name: "Golden Retriever", size: "Large · Sporting" },
                { name: "German Shepherd", size: "Large · Herding" },
                { name: "Dachshund", size: "Small · Hound" },
                { name: "French Bulldog", size: "Small · Companion" },
              ].map((item) => (
                <div
                  key={item.name}
                  className="p-4 rounded-2xl border border-border/80 bg-bg-elevated/40 flex flex-col justify-between gap-3"
                >
                  <div className="aspect-[4/3] rounded-xl bg-bg-elevated flex items-center justify-center text-xs font-bold text-fg-muted/60 uppercase">
                    Photo
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-fg">
                      {item.name}
                    </div>
                    <div className="text-[11px] text-fg-muted font-medium">
                      {item.size}
                    </div>
                  </div>
                  <Link
                    href="/pet/dogs"
                    className="text-xs font-bold text-accent hover:underline inline-flex items-center gap-1"
                  >
                    Breed guide →
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Shop for [Breed] Section */}
          <section
            aria-labelledby="shop-breed-heading"
            className="flex flex-col gap-6 pt-6 border-t border-border/50"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <span className="text-xs font-bold tracking-widest uppercase text-fg-muted">
                  RECOMMENDED FOR LABS
                </span>
                <h2
                  id="shop-breed-heading"
                  className="font-archivo font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-fg"
                >
                  Shop for {breed.title}
                </h2>
              </div>
              <Link
                href="/pet/dogs"
                className="text-xs sm:text-sm font-bold text-accent hover:underline"
              >
                Shop all for dogs →
              </Link>
            </div>

            {/* Breed Kit Card */}
            <div className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-gradient-to-r from-bg-elevated/80 via-bg-elevated/40 to-bg-elevated/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="flex flex-col gap-1.5 max-w-md">
                <span className="text-xs font-bold text-accent tracking-wider uppercase">
                  KIT · To be confirmed
                </span>
                <h3 className="font-archivo font-extrabold text-xl sm:text-2xl text-fg">
                  {breed.title} Starter Kit
                </h3>
                <p className="text-xs sm:text-sm text-fg-muted">
                  Daily NAD+ chew + joint recovery oil. Formulated for active
                  large dogs.
                </p>
              </div>

              <AddKitButton kitSlug="chew-oil" />
            </div>
          </section>

          {/* Quiz CTA Banner */}
          <section
            aria-labelledby="quiz-cta-heading"
            className="p-8 sm:p-10 rounded-3xl border border-accent/40 bg-gradient-to-r from-accent/15 via-bg-elevated to-accent/15 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
          >
            <div className="max-w-xl">
              <h2
                id="quiz-cta-heading"
                className="font-archivo font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-fg"
              >
                Find the right formula for your Lab
              </h2>
              <p className="text-sm text-fg-muted mt-2 leading-relaxed">
                Answer 6 quick questions about age, size and goals. Get a
                formula and a dose by weight.
              </p>
            </div>
            <Link
              href="/pet/quiz"
              className="min-h-12 py-3 px-8 rounded-full bg-accent text-accent-fg font-extrabold text-sm sm:text-base hover:opacity-95 transition-all shadow-sm whitespace-nowrap text-center w-full md:w-auto"
            >
              Take the 60-second quiz
            </Link>
          </section>
        </div>
      </div>

      {/* Pet FDA and Animal Disclaimer */}
      <PetRegulatoryNotice />
    </main>
  );
}
