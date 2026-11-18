import type { Metadata } from "next";
import Link from "next/link";
import { contentProvider } from "@/lib/providers";
import { buildMetadata } from "@/lib/seo";
import { ProfessionalApplicationForm } from "./_components/professional-application-form";

const benefitTitles = [
  "Professional discount",
  "Personal referral code",
  "Free samples",
  "Technical sheets and lab reports",
  "Product training",
  "Education library",
];

const questions = [
  "Who qualifies for Nadeon for Professionals?",
  "How is my license verified?",
  "How and when are commissions paid?",
  "What discount do my patients or clients get?",
  "Can I sell Nadeon in my clinic or gym?",
  "What can I say about the products?",
];

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Nadeon for Professionals | Nadeon Labs",
    description:
      "Partner with Nadeon. A program for the people your patients and clients already trust.",
    pathname: "/professionals",
  });
}

export default async function ProfessionalsPage() {
  const [expertsPage, humanExperts, petExperts] = await Promise.all([
    contentProvider.getExpertsPage(),
    contentProvider.listExperts("human"),
    contentProvider.listExperts("pet"),
  ]);
  const experts = [...humanExperts, ...petExperts];

  return (
    <main id="main-content" className="flex-1" tabIndex={-1}>
      <section className="border-b border-border bg-bg px-5 py-14 text-fg sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
              NADEON FOR PROFESSIONALS
            </p>
            <h1 className="font-archivo text-4xl font-extrabold uppercase sm:text-6xl">
              Partner with Nadeon.
            </h1>
            <p className="max-w-3xl text-lg leading-relaxed text-fg-muted">
              A program for the people your patients and clients already trust.
              Program details: To be confirmed.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#application"
                className="inline-flex min-h-11 items-center rounded-full bg-gradient-gold px-6 py-3 font-bold uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Apply now
              </a>
              <a
                href="#how-it-works"
                className="inline-flex min-h-11 items-center rounded-full border border-border px-6 py-3 font-bold uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                How it works
              </a>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {benefitTitles.slice(0, 3).map((title) => (
              <div
                key={title}
                className="flex items-center justify-between gap-4 rounded-card border border-border bg-bg-elevated p-5"
              >
                <span className="font-bold">{title}</span>
                <span className="text-sm text-fg-muted">To be confirmed</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-16 px-5 py-14 sm:px-8 sm:py-20">
        <section aria-labelledby="audiences-title" className="space-y-7">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
              TWO AUDIENCES, ONE PROGRAM
            </p>
            <h2
              id="audiences-title"
              className="font-archivo text-3xl font-extrabold uppercase sm:text-4xl"
            >
              Who it is for
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <AudienceCard
              id="human-health"
              title="Human health"
              description="Human health program details: To be confirmed."
              professions={[
                "Medical doctors (MD, DO)",
                "Nutritionists and dietitians",
                "Personal trainers",
                "Health coaches",
              ]}
            />
            <AudienceCard
              id="pet-health"
              title="Pet health"
              description="Pet health program details: To be confirmed."
              professions={[
                "Veterinarians",
                "Vet techs",
                "Dog and horse trainers",
                "Groomers",
              ]}
            />
          </div>
        </section>

        <section aria-labelledby="benefits-title" className="space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
              PROGRAM BENEFITS
            </p>
            <h2
              id="benefits-title"
              className="font-archivo text-3xl font-extrabold uppercase sm:text-4xl"
            >
              What you get
            </h2>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {benefitTitles.map((title) => (
              <li
                key={title}
                className="min-h-36 rounded-card border border-border bg-bg-elevated p-6"
              >
                <h3 className="font-archivo text-xl font-bold">{title}</h3>
                <p className="mt-3 text-fg-muted">To be confirmed</p>
              </li>
            ))}
          </ul>
          <p className="text-sm text-fg-muted">
            Program terms and details: To be confirmed.
          </p>
        </section>

        <section
          id="how-it-works"
          aria-labelledby="how-title"
          className="scroll-mt-8 space-y-6 border-y border-border py-12"
        >
          <div className="space-y-3">
            <h2
              id="how-title"
              className="font-archivo text-3xl font-extrabold uppercase sm:text-4xl"
            >
              Three steps to your code
            </h2>
          </div>
          <ol className="grid gap-4 md:grid-cols-3">
            {["Apply", "Verification", "To be confirmed"].map((step, index) => (
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

        <section aria-labelledby="experts-title" className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
            {expertsPage.eyebrow}
          </p>
          <h2
            id="experts-title"
            className="font-archivo text-3xl font-extrabold uppercase sm:text-4xl"
          >
            {experts.length ? expertsPage.title : "To be confirmed"}
          </h2>
          {experts.length ? (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {experts.map((expert, index) => (
                <li
                  key={`${expert.name}-${index}`}
                  className="rounded-card border border-border p-6"
                >
                  <h3 className="font-archivo text-xl font-bold">
                    {expert.name}
                  </h3>
                  <p className="mt-2 text-sm text-fg-muted">
                    {expert.credential}
                  </p>
                  <p className="mt-3 text-fg-muted">{expert.bio}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-card border border-border p-6 text-fg-muted">
              To be confirmed
            </p>
          )}
          <Link
            href="/experts"
            className="inline-flex min-h-11 items-center rounded-full border border-border px-5 py-3 font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            See our experts
          </Link>
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
            Join the program
          </h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-fg-muted">
            Application and verification details: To be confirmed.
          </p>
          <div className="mt-8">
            <ProfessionalApplicationForm />
          </div>
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
            Questions first? To be confirmed.
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

function AudienceCard({
  id,
  title,
  description,
  professions,
}: {
  id: string;
  title: string;
  description: string;
  professions: string[];
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="rounded-card border border-border p-6 sm:p-8"
    >
      <h3
        id={`${id}-title`}
        className="font-archivo text-2xl font-extrabold uppercase"
      >
        {title}
      </h3>
      <p className="mt-3 text-fg-muted">{description}</p>
      <ul className="mt-5 list-disc space-y-2 pl-5 text-fg-muted">
        {professions.map((profession) => (
          <li key={profession}>{profession}</li>
        ))}
      </ul>
    </section>
  );
}
