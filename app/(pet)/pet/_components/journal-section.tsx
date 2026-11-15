import React from "react";

export function JournalSection() {
  const articles = [
    {
      category: "Joints",
      readTime: "5 min",
      title: "7 signs your dog's joints need support",
      slug: "7-signs-your-dogs-joints-need-support",
      description:
        "Subtle early indicators that mobility is slowing down, and how cellular replenishment helps.",
    },
    {
      category: "Calm",
      readTime: "6 min",
      title: "Senior dog, anxious nights: what helps",
      slug: "senior-dog-anxious-nights-what-helps",
      description:
        "Practical nighttime routines and calming botanical pairings for restless older dogs.",
    },
    {
      category: "Guide",
      readTime: "4 min",
      title: "How to dose supplements by weight",
      slug: "how-to-dose-supplements-by-weight",
      description:
        "Understanding weight tiers and titration to maximize bioavailability and safety.",
    },
  ];

  return (
    <section
      className="w-full bg-bg text-fg py-14 sm:py-20 border-b border-border"
      aria-labelledby="journal-heading"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs uppercase tracking-widest font-mono text-fg-muted">
              JOURNAL
            </span>
            <h2
              id="journal-heading"
              className="mt-2 text-2xl sm:text-3xl font-normal font-sans tracking-tight text-fg"
            >
              For pet parents
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article) => (
            <article
              key={article.slug}
              className="group p-6 rounded border border-border bg-bg-elevated shadow-card hover:border-accent transition-colors flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-mono text-accent uppercase">
                  {article.category} · {article.readTime}
                </span>
                <h3 className="text-lg font-medium mt-2 text-fg group-hover:text-accent transition-colors leading-snug">
                  {article.title}
                </h3>
                <p className="mt-3 text-sm text-fg-muted leading-relaxed">
                  {article.description}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-medium text-fg group-hover:text-accent">
                <span>Read article</span>
                <span>Coming soon</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
