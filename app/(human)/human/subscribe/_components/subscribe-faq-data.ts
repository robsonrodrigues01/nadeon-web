export interface FaqItem {
  question: string;
  answer: string;
}

export function getSubscribeFaqs(
  discountPercentage: number | null = null
): FaqItem[] {
  const customStackSave = discountPercentage
    ? `save ${discountPercentage}% across all of them.`
    : "save across all of them.";

  const stackOffersQuestion = discountPercentage
    ? `Does the ${discountPercentage}% stack with other offers?`
    : "Does the subscription discount stack with other offers?";

  const stackOffersAnswer = discountPercentage
    ? `The ${discountPercentage}% subscription discount is our best ongoing rate and cannot be combined with one-time discount codes.`
    : "The subscription discount is our best ongoing rate and cannot be combined with one-time discount codes.";

  return [
    {
      question: "When will I be charged?",
      answer:
        "When each box ships. You get an email reminder 3 days before, so you can skip or change it.",
    },
    {
      question: "Can I subscribe to more than one formula?",
      answer: `Yes. You can build a custom stack with multiple formulas in one box and ${customStackSave}`,
    },
    {
      question: stackOffersQuestion,
      answer: stackOffersAnswer,
    },
    {
      question: "Is shipping really free?",
      answer:
        "Yes. Shipping is free on every recurring subscription delivery, regardless of cart value.",
    },
    {
      question: "What if it is not for me?",
      answer:
        "You can pause or cancel anytime with one click in your account, plus your first order is backed by our 60-day guarantee.",
    },
  ];
}
