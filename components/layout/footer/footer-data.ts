import type {
  CrossLineCardData,
  FooterLine,
  FooterNavColumn,
  LegalLink,
  SocialLink,
} from "./types";

export const HUMAN_FOOTER_COLUMNS: FooterNavColumn[] = [
  {
    title: "Shop",
    links: [
      { label: "Capsules", href: "/human/shop/capsules" },
      { label: "Powders", href: "/human/shop/powders" },
      { label: "Tinctures", href: "/human/shop/tinctures" },
      { label: "Bundles", href: "/human/kits" },
      { label: "Best sellers", href: "/human/shop" },
      { label: "Gift cards", href: "/gift-card" },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "Science", href: "/science" },
      { label: "NMN vs NAD+", href: "/science" },
      { label: "Ingredients", href: "/ingredients" },
      { label: "Take the quiz", href: "/human/quiz" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Shipping & Returns", href: "/shipping-returns" },
      { label: "Track your order", href: "/track" },
      { label: "Manage subscription", href: "/human/subscribe" },
      { label: "Contact us", href: "/help" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Lab Results", href: "/lab-results" },
      { label: "Rewards", href: "/rewards" },
      { label: "Wholesale", href: "/wholesale" },
      { label: "Affiliates", href: "/affiliates" },
    ],
  },
];

export const PET_FOOTER_COLUMNS: FooterNavColumn[] = [
  {
    title: "Shop",
    links: [
      { label: "Dogs", href: "/pet/dogs" },
      { label: "Cats", href: "/pet/cats" },
      { label: "Horses", href: "/pet/horses" },
      { label: "Soft chews", href: "/pet/dogs" },
      { label: "Oils & drops", href: "/pet/dogs" },
      { label: "Bundles", href: "/pet/kits" },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "Why NMN for pets", href: "/science" },
      { label: "Dose by weight", href: "/pet/dose-calculator" },
      { label: "Veterinarians", href: "/professionals" },
      { label: "Take the quiz", href: "/pet/quiz" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Shipping & Returns", href: "/shipping-returns" },
      { label: "Track your order", href: "/track" },
      { label: "Manage subscription", href: "/pet/subscribe" },
      { label: "Contact us", href: "/help" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Lab Results", href: "/lab-results" },
      { label: "Rewards", href: "/rewards" },
      { label: "Wholesale", href: "/wholesale" },
      { label: "Affiliates", href: "/affiliates" },
    ],
  },
];

export const CROSS_PROMO_CARD: Record<FooterLine, CrossLineCardData> = {
  human: {
    targetLine: "pet",
    href: "/pet",
    title: "Nadeon Pet",
    description: "NMN for dogs, cats & horses",
    ariaLabel: "Switch to Nadeon Pet: NMN for dogs, cats and horses",
  },
  pet: {
    targetLine: "human",
    href: "/human",
    title: "Nadeon Human",
    description: "Capsules, powders & tinctures",
    ariaLabel: "Switch to Nadeon Human: Capsules, powders and tinctures",
  },
};

export const SOCIAL_LINKS: SocialLink[] = [
  {
    key: "ig",
    label: "IG",
    name: "Instagram",
    href: "https://instagram.com/nadeonlabs",
  },
  {
    key: "tt",
    label: "TT",
    name: "TikTok",
    href: "https://tiktok.com/@nadeonlabs",
  },
  {
    key: "fb",
    label: "FB",
    name: "Facebook",
    href: "https://facebook.com/nadeonlabs",
  },
  {
    key: "yt",
    label: "YT",
    name: "YouTube",
    href: "https://youtube.com/@nadeonlabs",
  },
];

export const LEGAL_LINKS: LegalLink[] = [
  { label: "Terms", href: "/legal/terms" },
  { label: "Privacy", href: "/legal/privacy" },
  { label: "Do Not Sell My Info", href: "/legal/do-not-sell" },
  { label: "Accessibility", href: "/legal/accessibility" },
];

export const PAYMENT_METHODS = [
  "VISA",
  "MC",
  "AMEX",
  "PAYPAL",
  "APPLE PAY",
  "SHOP PAY",
] as const;

export const REGULATORY_STATEMENTS = {
  human:
    "*These statements have not been evaluated by the Food and Drug Administration. These products are not intended to diagnose, treat, cure or prevent any disease.",
  pet: "*These statements have not been evaluated by the Food and Drug Administration. These products are not intended to diagnose, treat, cure or prevent any disease. For animal use only. Equine products: not for horses intended for food.",
} as const;

export const COMPANY_IDENTITY = {
  copyrightYear: "2026",
  companyName: "Nadeon Labs",
  address: "1081 Paulison Ave, Suite 3B, Clifton, NJ 07011",
} as const;
