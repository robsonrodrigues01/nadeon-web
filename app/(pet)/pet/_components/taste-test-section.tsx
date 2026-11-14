import React from "react";
import Link from "next/link";
import { Sparkles, Check } from "lucide-react";

export function TasteTestSection() {
  const highlights = [
    {
      title: "Pumpkin & chicken liver",
      subtitle: "The flavor dogs ask for",
    },
    {
      title: "No corn, wheat or soy",
      subtitle: "No artificial colors",
    },
    {
      title: "Soft, star-shaped chew",
      subtitle: "About 8.8 g, easy to break",
    },
  ];

  return (
    <section
      className="w-full bg-bg text-fg py-14 sm:py-20 border-b border-border"
      aria-labelledby="taste-test-heading"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="p-8 sm:p-12 rounded border border-border bg-bg-elevated shadow-card flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="flex-1 text-left">
            <span className="text-xs uppercase tracking-widest font-mono text-fg-muted flex items-center gap-2">
              <Sparkles
                className="w-3.5 h-3.5 text-accent"
                aria-hidden="true"
              />
              TASTE TEST
            </span>
            <h2
              id="taste-test-heading"
              className="mt-2 text-3xl sm:text-4xl font-normal font-sans tracking-tight text-fg"
            >
              A chew they actually want
            </h2>
            <p className="mt-4 text-base text-fg-muted leading-relaxed">
              Formulated with real pumpkin and savory chicken liver so daily
              cellular care feels like a delicious reward, not a chore.
            </p>

            <div className="mt-8">
              <Link
                href="/pet/dogs"
                className="min-h-11 px-8 py-3.5 inline-flex items-center justify-center rounded bg-gradient-gold text-accent-fg font-medium shadow-card hover:brightness-105 active:scale-[0.98] transition-transform"
              >
                Try a jar
              </Link>
            </div>
          </div>

          <div className="flex-1 w-full max-w-md grid grid-cols-1 gap-4">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="p-5 rounded border border-border bg-bg flex items-start gap-4"
              >
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Check
                    className="w-3.5 h-3.5 text-accent"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h3 className="text-base font-medium text-fg">
                    {item.title}
                  </h3>
                  <p className="text-xs text-fg-muted mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
