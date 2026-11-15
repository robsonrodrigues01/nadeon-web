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
  hasDesignAnswer: boolean;
}

export const PENDING_FAQ_ANSWER =
  "Our team is finalizing this answer. Contact us at /help.";

// Abas na ordem do design (secao 5.7 do catalogo).
export const FAQ_CATEGORIES: FaqCategoryTab[] = [
  { id: "products", label: "Products" },
  { id: "orders", label: "Orders & Shipping" },
  { id: "subscriptions", label: "Subscriptions" },
  { id: "pets", label: "Pets" },
  { id: "quality", label: "Quality" },
];

export const FAQ_ENTRIES: FaqEntry[] = [
  // ==========================================
  // Products (7 perguntas do design board)
  // ==========================================
  {
    // Source question: design/boards/Conteúdo_Conteúdo__60_Conte_do_FAQ_Desktop.dc.html
    // Source answer: design/boards/Conteúdo_Conteúdo__60_Conte_do_FAQ_Desktop.dc.html
    id: "nmn-vs-nad",
    category: "products",
    question: "What is NMN and how is it different from NAD+?",
    answer:
      "NMN (nicotinamide mononucleotide) is a building block your cells convert into NAD+ in one enzyme step. NAD+ is the coenzyme itself. BioHack, Full Charge and Glow contain NMN. Renew and Prime contain NAD+. Read more on our Science page.",
    hasDesignAnswer: true,
  },
  {
    // Source question: design/boards/Conteúdo_Conteúdo__60_Conte_do_FAQ_Desktop.dc.html
    // Source answer: design/boards/Loja_Loja__10_Loja_CollectionHuman_Desktop.dc.html
    id: "which-formula",
    category: "products",
    question: "Which formula should I start with?",
    answer:
      "Most people start with BioHack for daily NMN. If you are 50 or older, many add Renew for direct NAD+. Not sure? The quiz takes 60 seconds. Talk to your doctor before starting any supplement.",
    hasDesignAnswer: true,
  },
  {
    // Source question: design/boards/Conteúdo_Conteúdo__60_Conte_do_FAQ_Desktop.dc.html
    id: "how-to-take",
    category: "products",
    question: "How do I take it, and when?",
    answer: PENDING_FAQ_ANSWER,
    hasDesignAnswer: false,
  },
  {
    // Source question: design/boards/Conteúdo_Conteúdo__60_Conte_do_FAQ_Desktop.dc.html
    id: "biohack-and-renew",
    category: "products",
    question: "Can I take BioHack and Renew together?",
    answer: PENDING_FAQ_ANSWER,
    hasDesignAnswer: false,
  },
  {
    // Source question: design/boards/Conteúdo_Conteúdo__60_Conte_do_FAQ_Desktop.dc.html
    id: "vegan-gluten-free",
    category: "products",
    question: "Are your products vegan and gluten-free?",
    answer: PENDING_FAQ_ANSWER,
    hasDesignAnswer: false,
  },
  {
    // Source question: design/boards/Conteúdo_Conteúdo__60_Conte_do_FAQ_Desktop.dc.html
    id: "how-long-results",
    category: "products",
    question: "How long until I notice a difference?",
    answer: PENDING_FAQ_ANSWER,
    hasDesignAnswer: false,
  },
  {
    // Source question: design/boards/Conteúdo_Conteúdo__60_Conte_do_FAQ_Desktop.dc.html
    id: "where-made",
    category: "products",
    question: "Where are your products made?",
    answer: PENDING_FAQ_ANSWER,
    hasDesignAnswer: false,
  },

  // ==========================================
  // Orders & Shipping (6 perguntas de boards de design)
  // ==========================================
  {
    // Source question: design/boards/Sistema_Conteúdo2__70_Sistema_Shipping_returns_Desktop_copy.dc.html
    id: "return-policy",
    category: "orders",
    question: "What is your return policy?",
    answer: PENDING_FAQ_ANSWER,
    hasDesignAnswer: false,
  },
  {
    // Source question: design/boards/Sistema_Conteúdo2__70_Sistema_Shipping_returns_Desktop_copy.dc.html
    id: "shipping-time",
    category: "orders",
    question: "When will my order ship?",
    answer: PENDING_FAQ_ANSWER,
    hasDesignAnswer: false,
  },
  {
    // Source question: design/boards/Sistema_Conteúdo2__70_Sistema_Shipping_returns_Desktop_copy.dc.html
    id: "shipping-destinations",
    category: "orders",
    question: "Do you ship outside the US?",
    answer: PENDING_FAQ_ANSWER,
    hasDesignAnswer: false,
  },
  {
    // Source question: design/boards/Sistema_Conteúdo2__70_Sistema_Shipping_returns_Desktop_copy.dc.html
    id: "change-shipping-address",
    category: "orders",
    question: "Can I change my address after ordering?",
    answer: PENDING_FAQ_ANSWER,
    hasDesignAnswer: false,
  },
  {
    // Source question: design/boards/Sistema_Conteúdo2__70_Sistema_Shipping_returns_Desktop_copy.dc.html
    id: "refund-timeline",
    category: "orders",
    question: "How long do refunds take to show up?",
    answer: PENDING_FAQ_ANSWER,
    hasDesignAnswer: false,
  },
  {
    // Source question: design/boards/Sistema_Conteúdo2__70_Sistema_Shipping_returns_Desktop_copy.dc.html
    id: "package-delivered-missing",
    category: "orders",
    question: "What if my package says delivered but I do not have it?",
    answer: PENDING_FAQ_ANSWER,
    hasDesignAnswer: false,
  },

  // ==========================================
  // Subscriptions (5 perguntas de boards de design)
  // ==========================================
  {
    // Source question: design/boards/Loja_Loja__10_Loja_CollectionHuman_Desktop.dc.html
    id: "subscribe-and-save",
    category: "subscriptions",
    question: "How does Subscribe & Save work?",
    answer: PENDING_FAQ_ANSWER,
    hasDesignAnswer: false,
  },
  {
    // Source question: design/boards/Conteúdo_Conteúdo__60_Conte_do_Subscribe_Human_Desktop.dc.html
    // Source answer: design/boards/Conteúdo_Conteúdo__60_Conte_do_Subscribe_Human_Desktop.dc.html
    id: "charge-timing",
    category: "subscriptions",
    question: "When will I be charged?",
    answer:
      "When each box ships. You get an email reminder 3 days before, so you can skip or change it.",
    hasDesignAnswer: true,
  },
  {
    // Source question: design/boards/Conteúdo_Conteúdo__60_Conte_do_Subscribe_Human_Desktop.dc.html
    id: "multiple-subscriptions",
    category: "subscriptions",
    question: "Can I subscribe to more than one formula?",
    answer: PENDING_FAQ_ANSWER,
    hasDesignAnswer: false,
  },
  {
    // Source question: design/boards/Conteúdo_Conteúdo__60_Conte_do_Subscribe_Human_Desktop.dc.html
    id: "discount-stacking",
    category: "subscriptions",
    question: "Does the 15% stack with other offers?",
    answer: PENDING_FAQ_ANSWER,
    hasDesignAnswer: false,
  },
  {
    // Source question: design/boards/Conteúdo_Conteúdo__60_Conte_do_Subscribe_Human_Desktop.dc.html
    id: "not-for-me",
    category: "subscriptions",
    question: "What if it is not for me?",
    answer: PENDING_FAQ_ANSWER,
    hasDesignAnswer: false,
  },

  // ==========================================
  // Pets (6 perguntas de boards de design)
  // ==========================================
  {
    // Source question: design/boards/Home_NadeonLabsBrandKit__03_Home_Pet_Desktop_1_2.dc.html
    id: "pet-dosage-dog",
    category: "pets",
    question: "How many chews should my dog take?",
    answer: PENDING_FAQ_ANSWER,
    hasDesignAnswer: false,
  },
  {
    // Source question: design/boards/Home_NadeonLabsBrandKit__03_Home_Pet_Desktop_1_2.dc.html
    id: "pet-senior-dogs",
    category: "pets",
    question: "Is NMN safe for senior dogs?",
    answer: PENDING_FAQ_ANSWER,
    hasDesignAnswer: false,
  },
  {
    // Source question: design/boards/Home_NadeonLabsBrandKit__03_Home_Pet_Desktop_1_2.dc.html
    id: "pet-combine-chews-oils",
    category: "pets",
    question: "Can I combine chews and oils?",
    answer: PENDING_FAQ_ANSWER,
    hasDesignAnswer: false,
  },
  {
    // Source question: design/boards/Home_NadeonLabsBrandKit__03_Home_Pet_Desktop_1_2.dc.html
    id: "pet-cat-drops",
    category: "pets",
    question: "Are the cat drops flavored?",
    answer: PENDING_FAQ_ANSWER,
    hasDesignAnswer: false,
  },
  {
    // Source question: design/boards/Home_NadeonLabsBrandKit__03_Home_Pet_Desktop_1_2.dc.html
    id: "pet-horse-top-dress",
    category: "pets",
    question: "How do I use the horse top-dress?",
    answer: PENDING_FAQ_ANSWER,
    hasDesignAnswer: false,
  },
  {
    // Source question: design/boards/Loja_Loja__10_Loja_ProductPet_MoreGoodYears_Desktop_2_2.dc.html
    id: "pet-why-nmn",
    category: "pets",
    question: "Why NMN for dogs?",
    answer: PENDING_FAQ_ANSWER,
    hasDesignAnswer: false,
  },

  // ==========================================
  // Quality (4 perguntas de boards de design)
  // ==========================================
  {
    // Source question: design/boards/Home_NadeonLabsBrandKit__02_Home_Human_Desktop_1_2.dc.html
    id: "quality-manufacturing",
    category: "quality",
    question: "Where are your products made and tested?",
    answer: PENDING_FAQ_ANSWER,
    hasDesignAnswer: false,
  },
  {
    // Source question: design/boards/Loja_Loja__10_Loja_ProductHuman_BioHack_Desktop_1_2.dc.html
    id: "quality-lot-testing",
    category: "quality",
    question: "How pure is your NMN and how do you test it?",
    answer: PENDING_FAQ_ANSWER,
    hasDesignAnswer: false,
  },
  {
    // Source question: design/boards/Loja_Loja__10_Loja_CollectionHuman_Desktop.dc.html
    id: "quality-view-lab-results",
    category: "quality",
    question: "How do I find the lab report for my jar?",
    answer: PENDING_FAQ_ANSWER,
    hasDesignAnswer: false,
  },
  {
    // Source question: design/boards/Loja_Loja2__10_Loja_Shop_by_format_Capsules_Desktop_copy.dc.html
    id: "quality-plant-based",
    category: "quality",
    question: "What are the capsules made of?",
    answer: PENDING_FAQ_ANSWER,
    hasDesignAnswer: false,
  },
];

// Apenas itens com resposta aprovada no design entram no JSON-LD schema (FAQPage)
export const DESIGN_FAQ_ENTRIES = FAQ_ENTRIES.filter(
  (entry) => entry.hasDesignAnswer
);
