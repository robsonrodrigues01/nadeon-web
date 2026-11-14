export type FaqCategory =
  "products" | "orders" | "subscriptions" | "pets" | "quality";

export interface FaqCategoryTab {
  id: FaqCategory;
  label: string;
}

export interface FaqEntry {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
}

// Abas na ordem do design (seção 5.7 do catálogo).
export const FAQ_CATEGORIES: FaqCategoryTab[] = [
  { id: "products", label: "Products" },
  { id: "orders", label: "Orders & Shipping" },
  { id: "subscriptions", label: "Subscriptions" },
  { id: "pets", label: "Pets" },
  { id: "quality", label: "Quality" },
];

export const FAQ_ENTRIES: FaqEntry[] = [
  // Products (7 perguntas, exatamente como no design board)
  {
    id: "nmn-vs-nad",
    category: "products",
    question: "What is NMN and how is it different from NAD+?",
    answer:
      "NMN (nicotinamide mononucleotide) is a building block your cells convert into NAD+ in one enzyme step. NAD+ is the coenzyme itself. BioHack, Full Charge and Glow contain NMN. Renew and Prime contain NAD+. Read more on our Science page.",
  },
  {
    id: "which-formula",
    category: "products",
    question: "Which formula should I start with?",
    answer:
      "Most people start with BioHack for daily NMN. If you are 50 or older, many add Renew for direct NAD+. Not sure? The quiz takes 60 seconds. Talk to your doctor before starting any supplement.*",
  },
  {
    id: "how-to-take",
    category: "products",
    question: "How do I take it, and when?",
    answer:
      "Take 2 capsules each morning with a glass of water for optimal cellular circadian alignment.",
  },
  {
    id: "biohack-and-renew",
    category: "products",
    question: "Can I take BioHack and Renew together?",
    answer:
      "Yes. BioHack provides NMN in the morning and Renew provides direct NAD+ with lunch for comprehensive routine support.",
  },
  {
    id: "vegan-gluten-free",
    category: "products",
    question: "Are your products vegan and gluten-free?",
    answer:
      "Yes. We use 100% plant-based hypromellose capsules, no animal byproducts, and all formulas are gluten free.",
  },
  {
    id: "how-long-results",
    category: "products",
    question: "How long until I notice a difference?",
    answer:
      "Most customers report subtle improvements in daily vitality and morning alertness within 2 to 4 weeks of consistent daily use.",
  },
  {
    id: "where-made",
    category: "products",
    question: "Where are your products made?",
    answer:
      "Manufactured and tested in our own cGMP facility located in Clifton, New Jersey.",
  },

  // Orders & Shipping (6 perguntas, alinhadas à contagem do design)
  {
    id: "return-policy",
    category: "orders",
    question: "What is your return policy?",
    answer:
      "We offer a 60-day money-back guarantee. If you are not fully satisfied, contact us for a hassle-free refund.",
  },
  {
    id: "shipping-destinations",
    category: "orders",
    question: "Where do you ship?",
    answer:
      "We currently ship across the United States. International shipping options will be announced soon.",
  },
  {
    id: "shipping-time",
    category: "orders",
    question: "How long does shipping take?",
    answer:
      "Standard shipping typically takes 3 to 5 business days after order processing.",
  },
  {
    id: "order-tracking",
    category: "orders",
    question: "How do I track my order?",
    answer:
      "You will receive a tracking link by email as soon as your order ships, or you can track it anytime via our Track page.",
  },
  {
    id: "shipping-cost",
    category: "orders",
    question: "How much is shipping?",
    answer:
      "Orders qualifying for the free shipping threshold in your market ship free. Real-time rates are displayed at checkout.",
  },
  {
    id: "change-shipping-address",
    category: "orders",
    question: "Can I change my shipping address?",
    answer:
      "If your order has not yet been processed by our warehouse, contact support immediately and we will update it.",
  },

  // Subscriptions (5 perguntas, alinhadas à contagem do design)
  {
    id: "subscribe-and-save",
    category: "subscriptions",
    question: "How does Subscribe & Save work?",
    answer:
      "Enjoy 15% off every order with flexible delivery intervals. You can skip, modify, or cancel your subscription anytime through your account.",
  },
  {
    id: "change-frequency",
    category: "subscriptions",
    question: "Can I change my delivery frequency?",
    answer:
      "Yes, you can adjust your delivery interval, next charge date, or skip a cycle anytime in your account settings.",
  },
  {
    id: "cancel-subscription",
    category: "subscriptions",
    question: "How do I cancel my subscription?",
    answer:
      "You can cancel anytime before your next renewal order directly from your account with no cancellation fees.",
  },
  {
    id: "add-one-time-items",
    category: "subscriptions",
    question: "Can I add one-time items to my subscription?",
    answer:
      "Yes, you can add products to your upcoming shipment in your account dashboard.",
  },
  {
    id: "subscription-discounts",
    category: "subscriptions",
    question: "Do subscription discounts apply to all items?",
    answer:
      "Subscriptions offer 15% savings across all qualifying recurring products.",
  },

  // Pets (6 perguntas, alinhadas à contagem do design e regras de conformidade)
  {
    id: "pet-dosage-dog",
    category: "pets",
    question: "How many chews should my dog take?",
    answer:
      "Dosage depends on your dog's weight. Refer to the weight chart on the back of the jar or product page. For animal use only.",
  },
  {
    id: "pet-senior-dogs",
    category: "pets",
    question: "Is NMN safe for senior dogs?",
    answer:
      "Yes, our pet formulations are specifically designed for dogs of all life stages, especially seniors. For animal use only.",
  },
  {
    id: "pet-combine-chews-oils",
    category: "pets",
    question: "Can I combine chews and oils?",
    answer:
      "Yes, our pet chews and oils can be stacked following the weight-based serving guidelines. For animal use only.",
  },
  {
    id: "pet-cat-drops",
    category: "pets",
    question: "Are the cat drops flavored?",
    answer:
      "Our cat drops are unflavored and formulated for easy blending into wet food. For animal use only.",
  },
  {
    id: "pet-horse-top-dress",
    category: "pets",
    question: "How do I use the horse top-dress?",
    answer:
      "Add the recommended scoop directly to your horse's daily grain or feed ration. For animal use only. Not for horses intended for food.",
  },
  {
    id: "pet-human-consumption",
    category: "pets",
    question: "Are pet formulas suitable for human consumption?",
    answer:
      "No. For animal use only. Keep out of reach of children and other animals.",
  },

  // Quality (4 perguntas, alinhadas à contagem do design)
  {
    id: "quality-manufacturing",
    category: "quality",
    question: "Where are your products manufactured?",
    answer:
      "Manufactured in our own state-of-the-art cGMP facility located in Clifton, New Jersey.",
  },
  {
    id: "quality-lot-testing",
    category: "quality",
    question: "How do you test each lot?",
    answer:
      "Every production lot undergoes third-party testing for purity, potency, and safety. Lab certificates are published online.",
  },
  {
    id: "quality-view-lab-results",
    category: "quality",
    question: "How do I view the lab results for my bottle?",
    answer:
      "Enter your lot number on our Lab Results page to view the third-party certificate of analysis. First lots publishing soon.",
  },
  {
    id: "quality-plant-based",
    category: "quality",
    question: "Are your capsules plant-based?",
    answer:
      "Yes. We use 100% plant-based hypromellose capsules without animal byproducts or gelatin.",
  },
];
