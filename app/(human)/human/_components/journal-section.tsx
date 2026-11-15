import React from "react";

export function JournalSection() {
  const articles = [
    {
      slug: "nmn-vs-nad",
      tag: "Science · 6 min",
      title: "NMN vs NAD⁺: what is the difference?",
      href: "/journal/nmn-vs-nad",
    },
    {
      slug: "why-nad-declines",
      tag: "Science · 5 min",
      title: "Why NAD⁺ declines with age",
      href: "/journal/why-nad-declines",
    },
    {
      slug: "simple-longevity-routine",
      tag: "Routine · 4 min",
      title: "How to build a simple longevity routine",
      href: "/journal/simple-longevity-routine",
    },
  ];

  return (
    <section
      aria-labelledby="journal-section-title"
      className="w-full border-b border-border bg-bg text-fg py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="inline-block rounded-full bg-bg-elevated px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent border border-border">
              JOURNAL
            </span>
            <h2
              id="journal-section-title"
              className="mt-4 font-archivo text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-fg"
            >
              Read before you buy
            </h2>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((art) => (
            <article
              key={art.slug}
              className="group flex flex-col justify-between rounded-card border border-border bg-bg-elevated p-8 shadow-card transition-all hover:shadow-elevated"
            >
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-accent">
                  {art.tag}
                </span>
                <h3 className="mt-4 font-archivo text-xl sm:text-2xl font-bold uppercase text-fg group-hover:text-accent transition-colors">
                  {art.title}
                </h3>
              </div>
              <div className="mt-8 pt-4 border-t border-border">
                <span className="text-xs font-bold uppercase tracking-wider text-fg-muted">
                  Coming soon
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
