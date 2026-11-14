import {
  type CatalogFilter,
  type CatalogProvider,
  type CatalogSort,
  type Collection,
  type Kit,
  type Product,
  type ProductLine,
  ProductSchema,
  KitSchema,
} from "@/lib/contracts/catalog";

const MOCK_PRODUCTS_DATA: Product[] = [
  {
    slug: "biohack",
    handle: "biohack",
    name: "BioHack",
    technicalName: "Cellular Longevity & NAD+ Optimizer",
    line: "human",
    species: null,
    format: "Capsules",
    color: "#2C3E50",
    images: [
      "/images/products/biohack-front.webp",
      "/images/products/biohack-back.webp",
    ],
    actives: [
      { name: "Nicotinamide Adenine Dinucleotide (NAD+)", amount: "300 mg" },
      { name: "Trans-Resveratrol (98% Pure)", amount: "200 mg" },
      { name: "Quercetin Phytosome", amount: "100 mg" },
    ],
    serving: "2 capsules daily with morning water",
    servingsPerJar: 30,
    netWeight: "60 vegetable capsules",
    variants: [
      {
        id: "var_biohack_1",
        jars: 1,
        title: "1 Jar (30 days)",
        price: { amount: 65, currencyCode: "USD" },
        compareAtPrice: { amount: 65, currencyCode: "USD" },
        sku: "NAD-HUM-BIO-1",
      },
      {
        id: "var_biohack_2",
        jars: 2,
        title: "2 Jars (60 days)",
        price: { amount: 118, currencyCode: "USD" },
        compareAtPrice: { amount: 130, currencyCode: "USD" },
        sku: "NAD-HUM-BIO-2",
      },
      {
        id: "var_biohack_3",
        jars: 3,
        title: "3 Jars (90 days)",
        price: { amount: 165, currencyCode: "USD" },
        compareAtPrice: { amount: 195, currencyCode: "USD" },
        sku: "NAD-HUM-BIO-3",
      },
    ],
    sellingPlans: [
      {
        id: "plan_biohack_30d",
        name: "Delivery every 30 days (15% off)",
        intervalDays: 30,
        discountPercentage: 15,
      },
      {
        id: "plan_biohack_60d",
        name: "Delivery every 60 days (15% off)",
        intervalDays: 60,
        discountPercentage: 15,
      },
      {
        id: "plan_biohack_90d",
        name: "Delivery every 90 days (15% off)",
        intervalDays: 90,
        discountPercentage: 15,
      },
    ],
    benefits: [
      "Replenishes cellular NAD+ levels",
      "Activates sirtuins and mitochondrial biogenesis",
      "Supports mental clarity and sustained daily energy",
    ],
    howToUse:
      "Take 2 capsules each morning on an empty stomach or with a light meal.",
    faq: [
      {
        question: "When should I take BioHack?",
        answer:
          "Take 2 capsules each morning with a glass of water for optimal cellular circadian alignment.",
      },
      {
        question: "Is BioHack third-party lab tested?",
        answer:
          "Yes. Every lot is independently verified for purity, potency, heavy metals, and microbiological safety.",
      },
    ],
    related: ["powerhouse", "renew", "glow"],
    claims: [
      {
        text: "Supports healthy cellular aging and DNA repair*",
        isClaim: true,
      },
      {
        text: "Non-GMO, vegan, gluten-free, third-party certified",
        isClaim: false,
      },
    ],
    dosingByWeight: [],
  },
  {
    slug: "more-good-years",
    handle: "more-good-years",
    name: "More Good Years",
    technicalName: "Senior Canine Longevity & Cellular Vitality Chews",
    line: "pet",
    species: "dog",
    format: "Soft chews",
    color: "#D97706",
    images: [
      "/images/products/more-good-years-front.webp",
      "/images/products/more-good-years-label.webp",
    ],
    actives: [
      { name: "Pure NMN (β-Nicotinamide Mononucleotide)", amount: "75 mg" },
      { name: "Organic Lion's Mane Extract", amount: "100 mg" },
      { name: "Glucosamine HCl (Plant-sourced)", amount: "250 mg" },
    ],
    serving: "1 to 4 soft chews depending on canine weight",
    servingsPerJar: 60,
    netWeight: "60 savory duck flavor soft chews",
    variants: [
      {
        id: "var_mgy_1",
        jars: 1,
        title: "1 Jar",
        price: { amount: 44, currencyCode: "USD" },
        compareAtPrice: { amount: 44, currencyCode: "USD" },
        sku: "NAD-PET-MGY-1",
      },
      {
        id: "var_mgy_2",
        jars: 2,
        title: "2 Jars",
        price: { amount: 80, currencyCode: "USD" },
        compareAtPrice: { amount: 88, currencyCode: "USD" },
        sku: "NAD-PET-MGY-2",
      },
      {
        id: "var_mgy_3",
        jars: 3,
        title: "3 Jars",
        price: { amount: 108, currencyCode: "USD" },
        compareAtPrice: { amount: 132, currencyCode: "USD" },
        sku: "NAD-PET-MGY-3",
      },
    ],
    sellingPlans: [
      {
        id: "plan_mgy_30d",
        name: "Delivery every 30 days (15% off)",
        intervalDays: 30,
        discountPercentage: 15,
      },
      {
        id: "plan_mgy_60d",
        name: "Delivery every 60 days (15% off)",
        intervalDays: 60,
        discountPercentage: 15,
      },
      {
        id: "plan_mgy_90d",
        name: "Delivery every 90 days (15% off)",
        intervalDays: 90,
        discountPercentage: 15,
      },
    ],
    benefits: [
      "Maintains youthful energy, mobility, and playfulness in senior dogs",
      "Supports cognitive function, alertness, and restful sleep",
      "Formulated by veterinary biochemists with cold-pressed natural duck flavor",
    ],
    howToUse:
      "Administer daily as a treat or crumbled into your dog's regular meal.",
    faq: [
      {
        question: "How long before I notice results in my dog?",
        answer:
          "Pet parents typically report noticeable improvements in mobility and alert energy within 14 to 28 days.",
      },
    ],
    related: ["golden-years", "still-sharp", "shine-on"],
    claims: [
      {
        text: "For animal use only. Keep out of reach of children and other animals.",
        isClaim: false,
      },
      {
        text: "Supports healthy cellular metabolism and joint comfort in mature dogs*",
        isClaim: true,
      },
    ],
    dosingByWeight: [
      {
        minWeightLbs: 0,
        maxWeightLbs: 20,
        dose: "1 chew daily",
        servingDescription: "Up to 20 lbs",
      },
      {
        minWeightLbs: 21,
        maxWeightLbs: 50,
        dose: "2 chews daily",
        servingDescription: "21 to 50 lbs",
      },
      {
        minWeightLbs: 51,
        maxWeightLbs: 90,
        dose: "3 chews daily",
        servingDescription: "51 to 90 lbs",
      },
      {
        minWeightLbs: 91,
        maxWeightLbs: null,
        dose: "4 chews daily",
        servingDescription: "Over 90 lbs",
      },
    ],
  },
  {
    slug: "renew",
    handle: "renew",
    name: "Renew",
    technicalName: "NAD+ & Resveratrol Cellular Restorative",
    line: "human",
    species: null,
    format: "Capsules",
    color: "#1E3A8A",
    images: ["/images/products/renew-front.webp"],
    actives: [
      { name: "NAD+", amount: "250 mg" },
      { name: "Resveratrol", amount: "150 mg" },
    ],
    serving: "2 capsules daily",
    servingsPerJar: 30,
    netWeight: "60 capsules",
    variants: [
      {
        id: "var_renew_1",
        jars: 1,
        title: "1 Jar",
        price: { amount: 65, currencyCode: "USD" },
      },
    ],
    sellingPlans: [
      {
        id: "plan_renew_30d",
        name: "Every 30 days (15% off)",
        intervalDays: 30,
        discountPercentage: 15,
      },
    ],
    benefits: ["Cellular restoration", "Antioxidant defense"],
    howToUse: "Take 2 capsules in the morning.",
    faq: [],
    related: ["biohack"],
    claims: [{ text: "Cellular renewal support*", isClaim: true }],
    dosingByWeight: [],
  },
  {
    slug: "glow",
    handle: "glow",
    name: "Glow",
    technicalName: "Collagen & NMN Skin Elasticity Matrix",
    line: "human",
    species: null,
    format: "Powders",
    color: "#BE185D",
    images: ["/images/products/glow-front.webp"],
    actives: [
      { name: "Marine Collagen Peptides", amount: "5000 mg" },
      { name: "NMN", amount: "200 mg" },
    ],
    serving: "1 scoop in water daily",
    servingsPerJar: 30,
    netWeight: "300 g",
    variants: [
      {
        id: "var_glow_1",
        jars: 1,
        title: "1 Jar",
        price: { amount: 59, currencyCode: "USD" },
      },
    ],
    sellingPlans: [
      {
        id: "plan_glow_30d",
        name: "Every 30 days (15% off)",
        intervalDays: 30,
        discountPercentage: 15,
      },
    ],
    benefits: ["Skin elasticity", "Hydration", "Nail strength"],
    howToUse: "Stir 1 scoop into water or smoothie.",
    faq: [],
    related: ["biohack"],
    claims: [{ text: "Supports collagen production*", isClaim: true }],
    dosingByWeight: [],
  },
  {
    slug: "powerhouse",
    handle: "powerhouse",
    name: "Powerhouse",
    technicalName: "Mitochondrial Lipid Complex",
    line: "human",
    species: null,
    format: "Tinctures",
    color: "#047857",
    images: ["/images/products/powerhouse-front.webp"],
    actives: [
      { name: "Ubiquinol CoQ10", amount: "100 mg" },
      { name: "Astaxanthin", amount: "4 mg" },
    ],
    serving: "1 ml daily",
    servingsPerJar: 30,
    netWeight: "30 ml",
    variants: [
      {
        id: "var_powerhouse_1",
        jars: 1,
        title: "1 Bottle",
        price: { amount: 45, currencyCode: "USD" },
      },
    ],
    sellingPlans: [
      {
        id: "plan_powerhouse_30d",
        name: "Every 30 days (15% off)",
        intervalDays: 30,
        discountPercentage: 15,
      },
    ],
    benefits: ["Mitochondrial energy", "Antioxidant protection"],
    howToUse: "Place 1 dropper directly under tongue or mix in liquid.",
    faq: [],
    related: ["biohack"],
    claims: [{ text: "Mitochondrial optimization*", isClaim: true }],
    dosingByWeight: [],
  },
  {
    slug: "high-jump",
    handle: "high-jump",
    name: "High Jump",
    technicalName: "Feline Joint Comfort & Flexibility Drops",
    line: "pet",
    species: "cat",
    format: "Drops",
    color: "#6D28D9",
    images: ["/images/products/high-jump-front.webp"],
    actives: [
      { name: "NMN", amount: "25 mg" },
      { name: "Green Lipped Mussel Extract", amount: "50 mg" },
    ],
    serving: "5 drops in food daily",
    servingsPerJar: 60,
    netWeight: "30 ml",
    variants: [
      {
        id: "var_high_jump_1",
        jars: 1,
        title: "1 Bottle",
        price: { amount: 32, currencyCode: "USD" },
      },
    ],
    sellingPlans: [
      {
        id: "plan_hj_30d",
        name: "Every 30 days (15% off)",
        intervalDays: 30,
        discountPercentage: 15,
      },
    ],
    benefits: ["Feline joint mobility", "Easy drop administration"],
    howToUse: "Add to wet food once daily.",
    faq: [],
    related: ["purr-mode"],
    claims: [
      { text: "For feline animal use only.", isClaim: false },
      { text: "Supports feline joint agility*", isClaim: true },
    ],
    dosingByWeight: [],
  },
  {
    slug: "long-stride",
    handle: "long-stride",
    name: "Long Stride",
    technicalName: "Equine Joint & Connective Tissue Top-Dress",
    line: "pet",
    species: "horse",
    format: "Top-dress",
    color: "#B45309",
    images: ["/images/products/long-stride-front.webp"],
    actives: [
      { name: "NMN", amount: "500 mg" },
      { name: "Glucosamine + MSM", amount: "5000 mg" },
    ],
    serving: "1 scoop daily with grain",
    servingsPerJar: 30,
    netWeight: "900 g",
    variants: [
      {
        id: "var_long_stride_1",
        jars: 1,
        title: "1 Bucket",
        price: { amount: 59, currencyCode: "USD" },
      },
    ],
    sellingPlans: [
      {
        id: "plan_ls_30d",
        name: "Every 30 days (15% off)",
        intervalDays: 30,
        discountPercentage: 15,
      },
    ],
    benefits: ["Equine joint integrity", "Connective tissue strength"],
    howToUse: "Top dress feed once daily.",
    faq: [],
    related: ["solid-ground"],
    claims: [
      {
        text: "For equine animal use only. Not for horses intended for human consumption.",
        isClaim: false,
      },
      { text: "Supports joint and tendon resilience*", isClaim: true },
    ],
    dosingByWeight: [],
  },
];

const MOCK_KITS_DATA: Kit[] = [
  {
    slug: "the-duo",
    handle: "the-duo",
    name: "The Duo: BioHack + Powerhouse",
    line: "human",
    description:
      "Synergistic cellular optimization combining daily NAD+ capsules with mitochondrial lipid complex.",
    products: [
      { productSlug: "biohack", quantity: 1 },
      { productSlug: "powerhouse", quantity: 1 },
    ],
    price: { amount: 98, currencyCode: "USD" },
    compareAtPrice: { amount: 110, currencyCode: "USD" },
    images: ["/images/kits/the-duo.webp"],
  },
  {
    slug: "pet-vitality-duo",
    handle: "pet-vitality-duo",
    name: "Pet Vitality Duo",
    line: "pet",
    description:
      "Comprehensive longevity system for senior canines addressing both internal cellular metabolism and joints.",
    products: [{ productSlug: "more-good-years", quantity: 1 }],
    price: { amount: 78, currencyCode: "USD" },
    compareAtPrice: { amount: 88, currencyCode: "USD" },
    images: ["/images/kits/pet-vitality-duo.webp"],
  },
];

// Validate all mock products at runtime initialization to ensure strict adherence to Zod schemas
const validatedProducts: Product[] = MOCK_PRODUCTS_DATA.map((p) =>
  ProductSchema.parse(p)
);
const validatedKits: Kit[] = MOCK_KITS_DATA.map((k) => KitSchema.parse(k));

export class MockCatalogProvider implements CatalogProvider {
  async getProducts(filter?: CatalogFilter): Promise<Product[]> {
    let list = [...validatedProducts];
    if (filter?.line) {
      list = list.filter((p) => p.line === filter.line);
    }
    if (filter?.species !== undefined) {
      list = list.filter((p) => p.species === filter.species);
    }
    if (filter?.format) {
      list = list.filter(
        (p) => p.format.toLowerCase() === filter.format?.toLowerCase()
      );
    }
    return list;
  }

  async getProduct(slug: string): Promise<Product | null> {
    const found = validatedProducts.find(
      (p) => p.slug === slug || p.handle === slug
    );
    return found ? { ...found } : null;
  }

  async getCollection(
    handle: string,
    filter?: CatalogFilter,
    sort?: CatalogSort
  ): Promise<Collection | null> {
    let products: Product[] = [];
    let title = "";

    switch (handle) {
      case "all":
        title = "All Products";
        products = [...validatedProducts];
        break;
      case "human":
        title = "Nadeon Human Longevity";
        products = validatedProducts.filter((p) => p.line === "human");
        break;
      case "pet":
        title = "Nadeon Pet Longevity";
        products = validatedProducts.filter((p) => p.line === "pet");
        break;
      case "dogs":
        title = "Canine Formulas";
        products = validatedProducts.filter((p) => p.species === "dog");
        break;
      case "cats":
        title = "Feline Formulas";
        products = validatedProducts.filter((p) => p.species === "cat");
        break;
      case "horses":
        title = "Equine Formulas";
        products = validatedProducts.filter((p) => p.species === "horse");
        break;
      default:
        return null;
    }

    if (filter?.line) {
      products = products.filter((p) => p.line === filter.line);
    }
    if (filter?.species !== undefined) {
      products = products.filter((p) => p.species === filter.species);
    }
    if (filter?.format) {
      products = products.filter(
        (p) => p.format.toLowerCase() === filter.format?.toLowerCase()
      );
    }

    if (sort === "price-asc") {
      products.sort(
        (a, b) => a.variants[0].price.amount - b.variants[0].price.amount
      );
    } else if (sort === "price-desc") {
      products.sort(
        (a, b) => b.variants[0].price.amount - a.variants[0].price.amount
      );
    } else if (sort === "title-asc") {
      products.sort((a, b) => a.name.localeCompare(b.name));
    }

    return {
      handle,
      title,
      products,
    };
  }

  async getKits(line?: ProductLine): Promise<Kit[]> {
    if (line) {
      return validatedKits.filter((k) => k.line === line);
    }
    return [...validatedKits];
  }

  async getKit(slug: string): Promise<Kit | null> {
    const found = validatedKits.find(
      (k) => k.slug === slug || k.handle === slug
    );
    return found ? { ...found } : null;
  }

  async search(q: string): Promise<Product[]> {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return validatedProducts.filter((p) => {
      return (
        p.name.toLowerCase().includes(term) ||
        p.technicalName.toLowerCase().includes(term) ||
        p.format.toLowerCase().includes(term) ||
        p.actives.some((a) => a.name.toLowerCase().includes(term))
      );
    });
  }
}

export const mockCatalogProvider = new MockCatalogProvider();
