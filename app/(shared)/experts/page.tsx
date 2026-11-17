import type { Metadata } from "next";
import Link from "next/link";
import { contentProvider } from "@/lib/providers";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Our Experts | Nadeon Labs",
    description: "To be confirmed",
    pathname: "/experts",
  });
}

export default async function ExpertsPage() {
  const [page, humanExperts, petExperts, process] = await Promise.all([
    contentProvider.getExpertsPage(),
    contentProvider.listExperts("human"),
    contentProvider.listExperts("pet"),
    contentProvider.getExpertReviewProcess(),
  ]);

  return (
    <main id="main-content" className="flex-1" tabIndex={-1}>
      <section className="border-b border-border bg-bg px-5 py-14 text-fg sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl space-y-5">
          <nav aria-label="Breadcrumb" className="text-sm text-fg-muted">
            <Link href="/">Home</Link> / <Link href="/about">About</Link> / Our
            experts
          </nav>
          <p className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
            {page.eyebrow}
          </p>
          <h1 className="font-archivo text-4xl font-extrabold uppercase sm:text-5xl">
            {page.title}
          </h1>
          <p className="max-w-3xl text-base leading-relaxed text-fg-muted sm:text-lg">
            {page.description}
          </p>
          <nav aria-label="Expert groups" className="flex flex-wrap gap-3 pt-2">
            <a
              className="min-h-11 rounded-full border border-border px-5 py-3 font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              href="#human-advisors"
            >
              Human advisors
            </a>
            <a
              className="min-h-11 rounded-full border border-border px-5 py-3 font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              href="#pet-advisors"
            >
              Pet advisors
            </a>
          </nav>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-14 px-5 py-14 sm:px-8 sm:py-20">
        <ExpertSection
          id="human-advisors"
          eyebrow="NADEON HUMAN"
          title={page.humanSection}
          description={page.humanDescription}
          experts={humanExperts}
        />
        <ExpertSection
          id="pet-advisors"
          eyebrow="NADEON PET"
          title={page.petSection}
          description={page.petDescription}
          experts={petExperts}
        />

        <section aria-labelledby="clinic-title" className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
            IN THE CLINIC
          </p>
          <h2
            id="clinic-title"
            className="font-archivo text-3xl font-extrabold uppercase"
          >
            {page.clinicSection}
          </h2>
          <p className="max-w-3xl leading-relaxed text-fg-muted">
            {page.clinicDescription}
          </p>
          <p className="rounded-card border border-border p-6 text-fg-muted">
            To be confirmed
          </p>
        </section>

        <section
          aria-labelledby="process-title"
          className="space-y-6 border-y border-border py-12"
        >
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
              OUR PROCESS
            </p>
            <h2
              id="process-title"
              className="font-archivo text-3xl font-extrabold uppercase"
            >
              How experts shape every formula
            </h2>
          </div>
          <ol className="grid gap-4 sm:grid-cols-2">
            {process.map((step) => (
              <li
                key={step.step}
                className="rounded-card border border-border p-6"
              >
                <p className="text-sm font-semibold text-fg-muted">
                  {String(step.step).padStart(2, "0")}
                </p>
                <h3 className="mt-2 font-archivo text-xl font-bold">
                  {step.title}
                </h3>
                <p className="mt-2 leading-relaxed text-fg-muted">
                  {step.step === 4 ? "To be confirmed" : step.description}
                </p>
              </li>
            ))}
          </ol>
          <p role="note" className="text-xs leading-relaxed text-fg-muted">
            *These statements have not been evaluated by the Food and Drug
            Administration. These products are not intended to diagnose, treat,
            cure or prevent any disease.
          </p>
        </section>

        <section aria-labelledby="proof-title" className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
            SEE FOR YOURSELF
          </p>
          <h2
            id="proof-title"
            className="font-archivo text-3xl font-extrabold uppercase"
          >
            Don’t take our word for it. Check the work.
          </h2>
          <p className="max-w-3xl text-fg-muted">
            Read the research we build on and the lab report for every lot.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              className="min-h-11 rounded-full bg-gradient-gold px-6 py-3 font-bold uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              href="/lab-results"
            >
              See lab results
            </Link>
            <Link
              className="min-h-11 rounded-full border-2 border-border px-6 py-3 font-bold uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              href="/science"
            >
              Read the science
            </Link>
          </div>
        </section>

        <section
          aria-labelledby="professional-title"
          className="rounded-card border border-border bg-bg-elevated p-6 sm:p-10"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
            To be confirmed
          </p>
          <h2
            id="professional-title"
            className="mt-3 font-archivo text-2xl font-extrabold uppercase"
          >
            Are you a health professional?
          </h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-fg-muted">
            Doctors, vets, nutritionists and trainers get practitioner pricing,
            dosing guides and patient resources.
          </p>
        </section>
      </div>
    </main>
  );
}

function ExpertSection({
  id,
  eyebrow,
  title,
  description,
  experts,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  experts: Awaited<ReturnType<typeof contentProvider.listExperts>>;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-8 space-y-5"
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
        {eyebrow}
      </p>
      <h2
        id={`${id}-title`}
        className="font-archivo text-3xl font-extrabold uppercase"
      >
        {title}
      </h2>
      <p className="max-w-3xl leading-relaxed text-fg-muted">{description}</p>
      {experts.length ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {experts.map((expert, index) => (
            <li
              key={`${expert.name}-${index}`}
              className="rounded-card border border-border p-6"
            >
              <p className="mb-4 grid aspect-square place-items-center rounded-card bg-bg-elevated text-sm text-fg-muted">
                To be confirmed
              </p>
              <h3 className="font-archivo text-xl font-bold">{expert.name}</h3>
              <p className="mt-1 text-sm text-fg-muted">{expert.specialty}</p>
              <p className="mt-1 text-sm text-fg-muted">{expert.credential}</p>
              <p className="mt-3 leading-relaxed text-fg-muted">{expert.bio}</p>
              <p className="mt-3 border-t border-border pt-3 text-sm italic text-fg-muted">
                To be confirmed
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-card border border-border p-6 text-fg-muted">
          To be confirmed
        </p>
      )}
    </section>
  );
}
