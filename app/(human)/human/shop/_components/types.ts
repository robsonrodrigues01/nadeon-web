import type { Product, Kit } from "@/lib/contracts/catalog";

export interface ShopCollectionProps {
  products: Product[];
  locale?: string;
}

export interface BetterTogetherProps {
  kits: Kit[];
  products: Product[];
  locale?: string;
}

export interface ShoppingFaqItem {
  question: string;
  answer: string;
}

export const SHOPPING_FAQS: ShoppingFaqItem[] = [
  {
    question: "Which formula should I start with?",
    answer:
      "Most people start with BioHack for daily NMN. If you are 50 or older, many add Renew for direct NAD+. Not sure? The quiz takes 60 seconds. Talk to your doctor before starting any supplement.",
  },
  {
    question: "Can I take more than one formula?",
    answer:
      "Yes. Many customers stack formulas such as BioHack with Renew or Glow. Check our recommended duos above or consult the product directions.",
  },
  {
    question: "How does Subscribe & Save work?",
    answer:
      "Enjoy 15% off every order with flexible delivery intervals. You can skip, modify, or cancel your subscription anytime through your account.",
  },
  {
    question: "How do I find the lab report for my jar?",
    answer:
      "Every jar features a unique lot number. Visit our Labs page and enter your lot number to view third-party certificates of analysis.",
  },
];
