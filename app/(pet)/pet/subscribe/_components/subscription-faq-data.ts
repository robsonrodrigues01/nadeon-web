export interface SubscriptionFaqItem {
  question: string;
  answer: string;
}

export function buildSubscriptionFaqs(
  discountPercentage: number | null = null
): SubscriptionFaqItem[] {
  const stackOffersQuestion = discountPercentage
    ? `Does the ${discountPercentage}% stack with other offers?`
    : "Does the subscription discount stack with other offers?";

  const stackOffersAnswer = discountPercentage
    ? `The ${discountPercentage}% discount applies automatically to every recurring delivery. Promotional coupon codes apply to initial one-time checkout.`
    : "The subscription discount applies automatically to every recurring delivery. Promotional coupon codes apply to initial one-time checkout.";

  return [
    {
      question: "When will I be charged?",
      answer:
        "When each order ships. You get an email reminder 3 days before, so you can skip or change it.",
    },
    {
      question: "Can I subscribe to more than one product?",
      answer:
        "Yes. You can subscribe to multiple products across dogs, cats and horses, and manage them all in one account.",
    },
    {
      question: stackOffersQuestion,
      answer: stackOffersAnswer,
    },
    {
      question: "What if my dog does not like the chews?",
      answer:
        "All our products are covered by our 60-day guarantee. If your dog is not thriving or dislikes the taste, we will issue a full refund.",
    },
    {
      question: "How do I change the delivery address?",
      answer:
        "You can update your shipping address, billing details or payment method anytime in your account dashboard before the next order ships.",
    },
  ];
}
