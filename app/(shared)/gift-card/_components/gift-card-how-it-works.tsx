const HOW_IT_WORKS_STEPS = [
  {
    step: "1",
    title: "Pick and personalize",
    description:
      "Choose an amount and a design, then add their name and a note.",
  },
  {
    step: "2",
    title: "We email it",
    description: "The card arrives on the date you choose, with a unique code.",
  },
  {
    step: "3",
    title: "They shop",
    description: "They use the code at checkout on any To be confirmed.",
  },
];

export function GiftCardHowItWorks() {
  return (
    <section
      aria-labelledby="how-it-works-heading"
      className="py-16 sm:py-20 border-t border-border/40"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-xs font-bold tracking-widest uppercase text-accent mb-2">
          HOW IT WORKS
        </div>
        <h2
          id="how-it-works-heading"
          className="font-archivo font-extrabold text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-fg mb-10"
        >
          Three simple steps
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {HOW_IT_WORKS_STEPS.map((item) => (
            <div
              key={item.step}
              className="rounded-2xl bg-bg-elevated/40 border border-border/80 p-6 sm:p-8 flex flex-col items-start gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-fg text-bg flex items-center justify-center font-archivo font-extrabold text-xl">
                {item.step}
              </div>
              <h3 className="font-archivo font-extrabold text-xl sm:text-2xl uppercase text-fg mt-2">
                {item.title}
              </h3>
              <p className="text-sm sm:text-base text-fg-muted leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
