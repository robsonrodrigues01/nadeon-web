import type {
  ActiveIngredient,
  CatalogFilter,
  CatalogProvider,
  CatalogSort,
  Collection,
  DosingRange,
  Kit,
  Money,
  Product,
  ProductFaq,
  ProductLine,
  ProductVariant,
  SellingPlan,
  Species,
} from "@/lib/contracts/catalog";

const STOREFRONT_API_VERSION = "2026-10";

export interface LiveCatalogProviderOptions {
  domain?: string;
  privateToken?: string;
  publicToken?: string;
  fetchImpl?: typeof fetch;
}

interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

interface ShopifySelectedOption {
  name: string;
  value: string;
}

interface ShopifyVariantNode {
  id: string;
  title: string;
  sku?: string | null;
  price?: ShopifyMoney | null;
  compareAtPrice?: ShopifyMoney | null;
  selectedOptions?: ShopifySelectedOption[];
}

interface ShopifySellingPlanNode {
  id: string;
  name: string;
  options?: Array<{ name: string; value: string }>;
  priceAdjustments?: Array<{
    adjustmentValue?: {
      adjustmentPercentage?: number;
    };
  }>;
}

interface ShopifySellingPlanGroupNode {
  sellingPlans?: {
    nodes?: ShopifySellingPlanNode[];
  };
}

interface ShopifyMetafieldNode {
  key: string;
  value?: string | null;
  type?: string | null;
}

interface ShopifyImageNode {
  url: string;
  altText?: string | null;
}

interface ShopifyRawProduct {
  id: string;
  handle: string;
  title: string;
  description?: string | null;
  images?: {
    nodes?: ShopifyImageNode[];
  };
  variants?: {
    nodes?: ShopifyVariantNode[];
  };
  sellingPlanGroups?: {
    nodes?: ShopifySellingPlanGroupNode[];
  };
  metafields?: Array<ShopifyMetafieldNode | null>;
}

const PRODUCT_FIELDS_FRAGMENT = `
fragment ProductFields on Product {
  id
  handle
  title
  description
  images(first: 20) {
    nodes {
      url
      altText
    }
  }
  variants(first: 50) {
    nodes {
      id
      title
      sku
      price {
        amount
        currencyCode
      }
      compareAtPrice {
        amount
        currencyCode
      }
      selectedOptions {
        name
        value
      }
    }
  }
  sellingPlanGroups(first: 10) {
    nodes {
      sellingPlans(first: 20) {
        nodes {
          id
          name
          options {
            name
            value
          }
          priceAdjustments {
            adjustmentValue {
              ... on SellingPlanPercentagePriceAdjustment {
                adjustmentPercentage
              }
            }
          }
        }
      }
    }
  }
  metafields(
    identifiers: [
      { namespace: "nadeon", key: "technical_name" }
      { namespace: "nadeon", key: "line" }
      { namespace: "nadeon", key: "species" }
      { namespace: "nadeon", key: "format" }
      { namespace: "nadeon", key: "color" }
      { namespace: "nadeon", key: "serving" }
      { namespace: "nadeon", key: "servings_per_jar" }
      { namespace: "nadeon", key: "net_weight" }
      { namespace: "nadeon", key: "how_to_use" }
      { namespace: "nadeon", key: "benefits" }
      { namespace: "nadeon", key: "claims" }
      { namespace: "nadeon", key: "related" }
      { namespace: "nadeon", key: "actives" }
      { namespace: "nadeon", key: "faq" }
      { namespace: "nadeon", key: "dosing_by_weight" }
    ]
  ) {
    key
    value
    type
  }
}
`;

const GET_PRODUCTS_QUERY = `
${PRODUCT_FIELDS_FRAGMENT}
query GetProducts($first: Int = 100) @inContext(country: US) {
  products(first: $first) {
    nodes {
      ...ProductFields
    }
  }
}
`;

const GET_PRODUCT_QUERY = `
${PRODUCT_FIELDS_FRAGMENT}
query GetProduct($handle: String!) @inContext(country: US) {
  product(handle: $handle) {
    ...ProductFields
  }
}
`;

function ensureAsterisk(text: string): string {
  const trimmed = text.trim();
  return trimmed.endsWith("*") ? trimmed : `${trimmed}*`;
}

function parseJsonList(val?: string | null): string[] {
  if (!val) return [];
  try {
    const parsed: unknown = JSON.parse(val);
    return Array.isArray(parsed) ? parsed.map((item) => String(item)) : [];
  } catch {
    return [];
  }
}

function parseIntervalDays(
  name: string,
  options?: { name: string; value: string }[]
): number {
  const combined = [
    name,
    ...(options?.map((o) => `${o.name}: ${o.value}`) ?? []),
  ].join(" ");

  const monthMatch = combined.match(/(\d+)\s*months?/i);
  if (monthMatch) {
    return Number(monthMatch[1]) * 30;
  }

  const weekMatch = combined.match(/(\d+)\s*weeks?/i);
  if (weekMatch) {
    return Number(weekMatch[1]) * 7;
  }

  const dayMatch = combined.match(/(\d+)\s*days?/i);
  if (dayMatch) {
    return Number(dayMatch[1]);
  }

  const freqOpt = options?.find((o) =>
    /frequency|delivery/i.test(o.name)
  )?.value;
  if (freqOpt) {
    const digits = freqOpt.match(/\d+/);
    if (digits) return Number(digits[0]);
  }

  return 30;
}

const KNOWN_LOCAL_RENDERS = new Set([
  "biohack",
  "daylight",
  "full-charge",
  "golden-years",
  "more-good-years",
  "powerhouse",
  "renew",
  "shine-on",
  "still-sharp",
]);

function hasLocalRender(handle: string): boolean {
  return KNOWN_LOCAL_RENDERS.has(handle);
}

function normalizeShopifyProduct(raw: ShopifyRawProduct): Product {
  const metaMap = new Map<string, string>();
  if (Array.isArray(raw.metafields)) {
    for (const m of raw.metafields) {
      if (m && m.key && m.value != null) {
        metaMap.set(m.key, m.value);
      }
    }
  }

  const line: ProductLine =
    metaMap.get("line")?.toLowerCase() === "pet" ? "pet" : "human";

  const rawSpecies = metaMap.get("species")?.toLowerCase();
  const species: Species =
    rawSpecies === "dog" || rawSpecies === "cat" || rawSpecies === "horse"
      ? rawSpecies
      : null;

  const rawBenefits = parseJsonList(metaMap.get("benefits"));
  const benefits = rawBenefits.map(ensureAsterisk);

  const rawClaims = parseJsonList(metaMap.get("claims"));
  const claims =
    rawClaims.length > 0
      ? rawClaims.map((item) => ({
          text: ensureAsterisk(item),
          isClaim: true,
        }))
      : benefits.map((b) => ({
          text: b,
          isClaim: true,
        }));

  let actives: ActiveIngredient[] = [];
  const activesRaw = metaMap.get("actives");
  if (activesRaw) {
    try {
      const parsed: unknown = JSON.parse(activesRaw);
      if (Array.isArray(parsed)) {
        actives = parsed.map((item) => {
          const a = item as Record<string, unknown>;
          return {
            name: String(a?.name ?? ""),
            amount: String(a?.amount ?? ""),
          };
        });
      }
    } catch {
      actives = [];
    }
  }

  let faq: ProductFaq[] = [];
  const faqRaw = metaMap.get("faq");
  if (faqRaw) {
    try {
      const parsed: unknown = JSON.parse(faqRaw);
      if (Array.isArray(parsed)) {
        faq = parsed.map((item) => {
          const f = item as Record<string, unknown>;
          return {
            question: String(f?.question ?? ""),
            answer: String(f?.answer ?? ""),
          };
        });
      }
    } catch {
      faq = [];
    }
  }

  let dosingByWeight: DosingRange[] = [];
  const dosingRaw = metaMap.get("dosing_by_weight");
  if (dosingRaw) {
    try {
      const parsed: unknown = JSON.parse(dosingRaw);
      if (Array.isArray(parsed)) {
        dosingByWeight = parsed.map((item) => {
          const d = item as Record<string, unknown>;
          return {
            minWeightLbs: Number(d?.minWeightLbs ?? 0),
            maxWeightLbs:
              d?.maxWeightLbs != null ? Number(d.maxWeightLbs) : null,
            dose: String(d?.dose ?? ""),
            servingDescription: String(d?.servingDescription ?? ""),
          };
        });
      }
    } catch {
      dosingByWeight = [];
    }
  }

  let images: string[] = [];
  if (hasLocalRender(raw.handle)) {
    images = [`/renders/${raw.handle}.png`];
  } else if (raw.images?.nodes?.length) {
    images = raw.images.nodes.map((img) => img.url);
  } else {
    images = ["/renders/placeholder.svg"];
  }

  const variants: ProductVariant[] = (raw.variants?.nodes ?? []).map((v) => {
    const quantityOpt = v.selectedOptions?.find((o) =>
      /quantity/i.test(o.name)
    )?.value;
    const match =
      (quantityOpt || "").match(/^\s*(\d+)/) ||
      (v.title || "").match(/^\s*(\d+)/);
    const parsedJars = match ? Number(match[1]) : 1;
    const jars = Math.min(3, Math.max(1, parsedJars)) as 1 | 2 | 3;

    const priceAmount = Number(v.price?.amount ?? 0);
    const priceCurrency = v.price?.currencyCode ?? "USD";

    let compareAtPrice: Money | undefined;
    if (v.compareAtPrice?.amount != null) {
      const capAmount = Number(v.compareAtPrice.amount);
      if (!isNaN(capAmount)) {
        compareAtPrice = {
          amount: capAmount,
          currencyCode: v.compareAtPrice.currencyCode ?? "USD",
        };
      }
    }

    return {
      id: v.id,
      jars,
      title: v.title ?? `${jars} jar`,
      price: {
        amount: priceAmount,
        currencyCode: priceCurrency,
      },
      compareAtPrice,
      sku: v.sku || undefined,
    };
  });

  const sellingPlans: SellingPlan[] = [];
  if (raw.sellingPlanGroups?.nodes) {
    for (const group of raw.sellingPlanGroups.nodes) {
      for (const plan of group.sellingPlans?.nodes ?? []) {
        const intervalDays = parseIntervalDays(plan.name, plan.options);
        const adj = plan.priceAdjustments?.[0]?.adjustmentValue;
        const discountPercentage =
          typeof adj?.adjustmentPercentage === "number"
            ? adj.adjustmentPercentage
            : 0;

        sellingPlans.push({
          id: plan.id,
          name: plan.name,
          intervalDays,
          discountPercentage,
        });
      }
    }
  }

  const rawServingsPerJar = metaMap.get("servings_per_jar");
  const servingsPerJar =
    rawServingsPerJar &&
    !isNaN(Number(rawServingsPerJar)) &&
    Number(rawServingsPerJar) > 0
      ? Number(rawServingsPerJar)
      : undefined;

  return {
    slug: raw.handle,
    handle: raw.handle,
    name: raw.title,
    technicalName: metaMap.get("technical_name") ?? "",
    line,
    species,
    format: metaMap.get("format") ?? "",
    color: metaMap.get("color") ?? "#000000",
    images,
    actives,
    serving: metaMap.get("serving") || undefined,
    servingsPerJar,
    netWeight: metaMap.get("net_weight") || undefined,
    variants,
    sellingPlans,
    benefits,
    howToUse: metaMap.get("how_to_use") ?? "",
    faq,
    related: parseJsonList(metaMap.get("related")),
    claims,
    dosingByWeight,
  };
}

export class LiveCatalogProvider implements CatalogProvider {
  constructor(private options?: LiveCatalogProviderOptions) {}

  private async executeQuery<T>(
    query: string,
    variables: Record<string, unknown> = {},
    tags: string[] = ["catalog"]
  ): Promise<T> {
    const domain = this.options?.domain ?? process.env.SHOPIFY_STORE_DOMAIN;
    const privateToken =
      this.options?.privateToken ??
      process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN;
    const publicToken =
      this.options?.publicToken ?? process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    if (!domain || (!privateToken && !publicToken)) {
      throw new Error(
        "Shopify Storefront configuration error: SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_PRIVATE_TOKEN or SHOPIFY_STOREFRONT_ACCESS_TOKEN are required."
      );
    }

    const endpoint = `https://${domain}/api/${STOREFRONT_API_VERSION}/graphql.json`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (privateToken) {
      headers["Shopify-Storefront-Private-Token"] = privateToken;
    } else if (publicToken) {
      headers["X-Shopify-Storefront-Access-Token"] = publicToken;
    }

    const fetchFn = this.options?.fetchImpl ?? fetch;
    const requestOptions: RequestInit & {
      next?: { revalidate?: number; tags?: string[] };
    } = {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
      next: {
        revalidate: 300,
        tags,
      },
    };

    const response = await fetchFn(endpoint, requestOptions);
    if (!response.ok) {
      throw new Error(
        `Shopify Storefront request failed (${response.status}): ${await response.text()}`
      );
    }

    const body = (await response.json()) as {
      data?: T;
      errors?: Array<{ message: string }>;
    };

    if (body.errors?.length) {
      throw new Error(
        `Shopify Storefront GraphQL error: ${body.errors.map((e) => e.message).join("; ")}`
      );
    }

    return body.data as T;
  }

  async getProducts(filter?: CatalogFilter): Promise<Product[]> {
    const data = await this.executeQuery<{
      products?: { nodes?: ShopifyRawProduct[] };
    }>(GET_PRODUCTS_QUERY, { first: 100 }, ["catalog"]);

    const rawList = data?.products?.nodes ?? [];
    let list = rawList.map(normalizeShopifyProduct);

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
    const data = await this.executeQuery<{
      product?: ShopifyRawProduct | null;
    }>(GET_PRODUCT_QUERY, { handle: slug }, ["catalog", `product-${slug}`]);

    if (!data?.product) {
      return null;
    }

    return normalizeShopifyProduct(data.product);
  }

  async getCollection(
    handle: string,
    filter?: CatalogFilter,
    sort?: CatalogSort
  ): Promise<Collection | null> {
    const all = await this.getProducts();
    let products: Product[] = [];
    let title = "";

    switch (handle) {
      case "all":
        title = "All Products";
        products = [...all];
        break;
      case "human":
        title = "Nadeon Human Longevity";
        products = all.filter((p) => p.line === "human");
        break;
      case "pet":
        title = "Nadeon Pet Longevity";
        products = all.filter((p) => p.line === "pet");
        break;
      case "dogs":
        title = "Canine Formulas";
        products = all.filter((p) => p.species === "dog");
        break;
      case "cats":
        title = "Feline Formulas";
        products = all.filter((p) => p.species === "cat");
        break;
      case "horses":
        title = "Equine Formulas";
        products = all.filter((p) => p.species === "horse");
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
        (a, b) =>
          (a.variants[0]?.price.amount ?? 0) -
          (b.variants[0]?.price.amount ?? 0)
      );
    } else if (sort === "price-desc") {
      products.sort(
        (a, b) =>
          (b.variants[0]?.price.amount ?? 0) -
          (a.variants[0]?.price.amount ?? 0)
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

  async getKits(_line?: ProductLine): Promise<Kit[]> {
    void _line;
    return [];
  }

  async getKit(_slug: string): Promise<Kit | null> {
    void _slug;
    return null;
  }

  async search(q: string): Promise<Product[]> {
    const term = q.trim().toLowerCase();
    if (!term) return [];

    const all = await this.getProducts();
    return all.filter((p) => {
      return (
        p.name.toLowerCase().includes(term) ||
        p.technicalName.toLowerCase().includes(term) ||
        p.format.toLowerCase().includes(term) ||
        p.actives.some((a) => a.name.toLowerCase().includes(term))
      );
    });
  }
}
