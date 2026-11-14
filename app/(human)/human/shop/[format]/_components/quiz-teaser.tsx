import { Button } from "@/components/ui/button";

export function QuizTeaser() {
  return (
    <section
      aria-labelledby="quiz-teaser-heading"
      className="bg-bg px-4 py-12 text-fg sm:px-10 lg:px-[72px] lg:py-16"
    >
      <div className="flex flex-col gap-6 rounded-card border border-border bg-bg-elevated p-6 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="inline-block rounded-pill bg-accent px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] text-accent-fg">
            Quiz
          </p>
          <h2
            id="quiz-teaser-heading"
            className="title mt-4 text-3xl font-extrabold uppercase leading-none tracking-tight sm:text-5xl"
          >
            Not sure which one?
          </h2>
        </div>
        <div>
          <Button href="/human/quiz" variant="primary" size="lg">
            Take the quiz
          </Button>
        </div>
      </div>
    </section>
  );
}
