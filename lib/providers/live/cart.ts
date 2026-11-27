import {
  type AddCartLineInput,
  type Cart,
  type CartDiscountCode,
  type CartLineItem,
  type CartProvider,
  type UpdateCartLineInput,
  CartSchema,
} from "@/lib/contracts/cart";
import { useCartStore } from "../cart-store";

const STOREFRONT_API_VERSION = "2026-10";
export const CART_STORAGE_KEY = "nadeon-shopify-cart-id";

export interface LiveCartProviderOptions {
  domain?: string;
  publicToken?: string;
  fetchImpl?: typeof fetch;
  storage?: Storage | null;
}

interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

interface ShopifyCartLineNode {
  id: string;
  quantity: number;
  sellingPlanAllocation?: {
    sellingPlan?: {
      id: string;
      name: string;
      options?: Array<{ name: string; value: string }>;
      priceAdjustments?: Array<{
        adjustmentValue?: {
          adjustmentPercentage?: number;
        };
      }>;
    } | null;
    compareAtPrice?: ShopifyMoney | null;
    price?: ShopifyMoney | null;
    perDeliveryPrice?: ShopifyMoney | null;
    unitPrice?: ShopifyMoney | null;
  } | null;
  cost?: {
    amountPerQuantity?: ShopifyMoney | null;
    compareAtAmountPerQuantity?: ShopifyMoney | null;
    subtotalAmount?: ShopifyMoney | null;
    totalAmount?: ShopifyMoney | null;
  } | null;
  merchandise?: {
    id: string;
    title: string;
    sku?: string | null;
    price?: ShopifyMoney | null;
    compareAtPrice?: ShopifyMoney | null;
    product?: {
      id: string;
      title: string;
      handle: string;
      lineMetafield?: {
        value?: string | null;
        type?: string | null;
      } | null;
      metafield?: {
        value?: string | null;
        type?: string | null;
      } | null;
      images?: {
        nodes?: Array<{
          url: string;
          altText?: string | null;
        }>;
      } | null;
    } | null;
  } | null;
  attributes?: Array<{
    key: string;
    value: string;
  }> | null;
}

interface ShopifyDiscountCode {
  code: string;
  applicable: boolean;
}

interface ShopifyDiscountAllocation {
  discountedAmount?: ShopifyMoney | null;
  code?: string | null;
}

interface ShopifyRawCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost?: {
    subtotalAmount?: ShopifyMoney | null;
    totalAmount?: ShopifyMoney | null;
    totalDiscountAmount?: ShopifyMoney | null;
  } | null;
  discountCodes?: ShopifyDiscountCode[] | null;
  discountAllocations?: ShopifyDiscountAllocation[] | null;
  lines?: {
    nodes?: ShopifyCartLineNode[];
  } | null;
}

interface ShopifyUserError {
  code?: string | null;
  field?: string[] | null;
  message: string;
}

const CART_FRAGMENT = `
fragment CartFragment on Cart {
  id
  checkoutUrl
  totalQuantity
  lines(first: 250) {
    nodes {
      id
      quantity
      sellingPlanAllocation {
        sellingPlan {
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
        compareAtPrice {
          amount
          currencyCode
        }
        price {
          amount
          currencyCode
        }
        perDeliveryPrice {
          amount
          currencyCode
        }
        unitPrice {
          amount
          currencyCode
        }
      }
      cost {
        amountPerQuantity {
          amount
          currencyCode
        }
        compareAtAmountPerQuantity {
          amount
          currencyCode
        }
        subtotalAmount {
          amount
          currencyCode
        }
        totalAmount {
          amount
          currencyCode
        }
      }
      merchandise {
        ... on ProductVariant {
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
          product {
            id
            title
            handle
            lineMetafield: metafield(namespace: "nadeon", key: "line") {
              value
              type
            }
            images(first: 1) {
              nodes {
                url
                altText
              }
            }
          }
        }
      }
      attributes {
        key
        value
      }
    }
  }
  discountCodes {
    code
    applicable
  }
  discountAllocations {
    discountedAmount {
      amount
      currencyCode
    }
    ... on CartCodeDiscountAllocation {
      code
    }
  }
  cost {
    subtotalAmount {
      amount
      currencyCode
    }
    totalAmount {
      amount
      currencyCode
    }
    totalDiscountAmount {
      amount
      currencyCode
    }
  }
}
`;

const GET_CART_QUERY = `
${CART_FRAGMENT}
query GetCart($id: ID!) @inContext(country: US) {
  cart(id: $id) {
    ...CartFragment
  }
}
`;

const CART_CREATE_MUTATION = `
${CART_FRAGMENT}
mutation CartCreate($input: CartInput = {}) @inContext(country: US) {
  cartCreate(input: $input) {
    cart {
      ...CartFragment
    }
    userErrors {
      code
      field
      message
    }
  }
}
`;

const CART_LINES_ADD_MUTATION = `
${CART_FRAGMENT}
mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) @inContext(country: US) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart {
      ...CartFragment
    }
    userErrors {
      code
      field
      message
    }
  }
}
`;

const CART_LINES_UPDATE_MUTATION = `
${CART_FRAGMENT}
mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) @inContext(country: US) {
  cartLinesUpdate(cartId: $cartId, lines: $lines) {
    cart {
      ...CartFragment
    }
    userErrors {
      code
      field
      message
    }
  }
}
`;

const CART_LINES_REMOVE_MUTATION = `
${CART_FRAGMENT}
mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) @inContext(country: US) {
  cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
    cart {
      ...CartFragment
    }
    userErrors {
      code
      field
      message
    }
  }
}
`;

const CART_DISCOUNT_CODES_UPDATE_MUTATION = `
${CART_FRAGMENT}
mutation CartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]) @inContext(country: US) {
  cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
    cart {
      ...CartFragment
    }
    userErrors {
      code
      field
      message
    }
  }
}
`;

function checkUserErrors(userErrors?: ShopifyUserError[] | null): void {
  if (userErrors && userErrors.length > 0) {
    throw new Error(
      `Shopify Cart error: ${userErrors.map((e) => e.message).join("; ")}`
    );
  }
}

export function normalizeShopifyCart(raw: ShopifyRawCart): Cart {
  const discountAmountsByCode = new Map<string, number>();
  for (const da of raw.discountAllocations ?? []) {
    if (da?.code && da.discountedAmount?.amount) {
      const codeKey = da.code.toUpperCase();
      const current = discountAmountsByCode.get(codeKey) ?? 0;
      discountAmountsByCode.set(
        codeKey,
        current + parseFloat(da.discountedAmount.amount)
      );
    }
  }

  const discountCodes: CartDiscountCode[] = (raw.discountCodes ?? []).map(
    (dc) => {
      const allocatedAmount = discountAmountsByCode.get(dc.code.toUpperCase());
      return {
        code: dc.code,
        applicable: dc.applicable,
        ...(allocatedAmount !== undefined
          ? {
              discountAmount: {
                amount: Number(allocatedAmount.toFixed(2)),
                currencyCode: raw.cost?.totalAmount?.currencyCode ?? "USD",
              },
            }
          : {}),
      };
    }
  );

  const lines: CartLineItem[] = (raw.lines?.nodes ?? []).map((line) => {
    const merchandise = line.merchandise;
    const product = merchandise?.product;
    const metafieldVal = (
      product?.lineMetafield?.value ?? product?.metafield?.value
    )?.toLowerCase();
    const productLine = metafieldVal === "pet" ? "pet" : "human";

    const unitPriceAmount = line.cost?.amountPerQuantity?.amount
      ? parseFloat(line.cost.amountPerQuantity.amount)
      : merchandise?.price?.amount
        ? parseFloat(merchandise.price.amount)
        : 0;
    const currencyCode =
      line.cost?.amountPerQuantity?.currencyCode ??
      merchandise?.price?.currencyCode ??
      "USD";

    const totalPriceAmount = line.cost?.totalAmount?.amount
      ? parseFloat(line.cost.totalAmount.amount)
      : unitPriceAmount * line.quantity;

    let compareAtPriceAmount: number | undefined;
    if (line.cost?.compareAtAmountPerQuantity?.amount) {
      compareAtPriceAmount = parseFloat(
        line.cost.compareAtAmountPerQuantity.amount
      );
    } else if (line.sellingPlanAllocation?.compareAtPrice?.amount) {
      compareAtPriceAmount = parseFloat(
        line.sellingPlanAllocation.compareAtPrice.amount
      );
    } else if (merchandise?.compareAtPrice?.amount) {
      const merCompare = parseFloat(merchandise.compareAtPrice.amount);
      if (merCompare > unitPriceAmount) {
        compareAtPriceAmount = merCompare;
      }
    }

    let subscriptionDiscountPercentage: number | undefined;
    const plan = line.sellingPlanAllocation?.sellingPlan;
    const planAdjustment =
      plan?.priceAdjustments?.[0]?.adjustmentValue?.adjustmentPercentage;
    if (typeof planAdjustment === "number" && planAdjustment > 0) {
      subscriptionDiscountPercentage = planAdjustment;
    } else if (compareAtPriceAmount && compareAtPriceAmount > unitPriceAmount) {
      subscriptionDiscountPercentage = Math.min(
        100,
        Math.max(
          0,
          Math.round(
            ((compareAtPriceAmount - unitPriceAmount) / compareAtPriceAmount) *
              100
          )
        )
      );
    }

    let customAttributes: Record<string, string> | undefined;
    if (line.attributes?.length) {
      customAttributes = {};
      for (const attr of line.attributes) {
        if (attr?.key) {
          customAttributes[attr.key] = attr.value ?? "";
        }
      }
    }

    const item: CartLineItem = {
      id: line.id,
      variantId: merchandise?.id ?? "",
      quantity: line.quantity,
      sellingPlanId: plan?.id ?? null,
      ...(plan?.name ? { sellingPlanTitle: plan.name } : {}),
      product: {
        id: product?.id ?? "",
        title: product?.title ?? merchandise?.title ?? "",
        handle: product?.handle ?? "",
        line: productLine,
        ...(product?.images?.nodes?.[0]?.url
          ? { image: product.images.nodes[0].url }
          : {}),
      },
      price: {
        amount: Number(unitPriceAmount.toFixed(2)),
        currencyCode,
      },
      total: {
        amount: Number(totalPriceAmount.toFixed(2)),
        currencyCode,
      },
      ...(compareAtPriceAmount !== undefined &&
      compareAtPriceAmount > unitPriceAmount
        ? {
            compareAtPrice: {
              amount: Number(compareAtPriceAmount.toFixed(2)),
              currencyCode,
            },
          }
        : {}),
      ...(subscriptionDiscountPercentage !== undefined
        ? { subscriptionDiscountPercentage }
        : {}),
      ...(customAttributes ? { customAttributes } : {}),
    };

    return item;
  });

  const cartCurrency =
    raw.cost?.totalAmount?.currencyCode ??
    raw.cost?.subtotalAmount?.currencyCode ??
    "USD";

  const subtotal = raw.cost?.subtotalAmount?.amount
    ? parseFloat(raw.cost.subtotalAmount.amount)
    : 0;

  const totalDiscount = raw.cost?.totalDiscountAmount?.amount
    ? parseFloat(raw.cost.totalDiscountAmount.amount)
    : 0;

  const total = raw.cost?.totalAmount?.amount
    ? parseFloat(raw.cost.totalAmount.amount)
    : 0;

  const cart: Cart = {
    id: raw.id,
    lines,
    discountCodes,
    subtotalPrice: {
      amount: Number(subtotal.toFixed(2)),
      currencyCode: cartCurrency,
    },
    totalDiscount: {
      amount: Number(totalDiscount.toFixed(2)),
      currencyCode: cartCurrency,
    },
    totalPrice: {
      amount: Number(total.toFixed(2)),
      currencyCode: cartCurrency,
    },
    totalQuantity: raw.totalQuantity ?? 0,
    checkoutUrl: raw.checkoutUrl,
  };

  return CartSchema.parse(cart);
}

export class LiveCartProvider implements CartProvider {
  constructor(private options?: LiveCartProviderOptions) {}

  private getCredentials(): { domain: string; publicToken: string } {
    const domain =
      this.options?.domain ?? process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_DOMAIN;
    const publicToken =
      this.options?.publicToken ??
      process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    if (!domain || !publicToken) {
      throw new Error(
        "Shopify Storefront configuration error: NEXT_PUBLIC_SHOPIFY_STOREFRONT_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN are required."
      );
    }

    return { domain, publicToken };
  }

  private async executeQuery<T>(
    query: string,
    variables: Record<string, unknown> = {}
  ): Promise<T> {
    const { domain, publicToken } = this.getCredentials();
    const endpoint = `https://${domain}/api/${STOREFRONT_API_VERSION}/graphql.json`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": publicToken,
    };

    const fetchFn = this.options?.fetchImpl ?? fetch;
    const response = await fetchFn(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
    });

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

  private getStoredCartId(): string | null {
    try {
      if (this.options?.storage) {
        return this.options.storage.getItem(CART_STORAGE_KEY);
      }
      if (typeof window !== "undefined" && window.localStorage) {
        return window.localStorage.getItem(CART_STORAGE_KEY);
      }
    } catch {
      // Storage access in restricted context
    }
    return null;
  }

  private setStoredCartId(id: string): void {
    try {
      if (this.options?.storage) {
        this.options.storage.setItem(CART_STORAGE_KEY, id);
        return;
      }
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(CART_STORAGE_KEY, id);
      }
    } catch {
      // Storage access in restricted context
    }
  }

  private clearStoredCartId(): void {
    try {
      if (this.options?.storage) {
        this.options.storage.removeItem(CART_STORAGE_KEY);
        return;
      }
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(CART_STORAGE_KEY);
      }
    } catch {
      // Storage access in restricted context
    }
  }

  private updateClientStore(cart: Cart): void {
    try {
      useCartStore.getState().setCart(cart);
    } catch {
      // Non-browser / test environment
    }
  }

  private resetClientStore(): void {
    try {
      useCartStore.getState().resetCart();
    } catch {
      // Non-browser / test environment
    }
  }

  private async getOrCreateCartId(): Promise<string> {
    const stored = this.getStoredCartId();
    if (stored) return stored;
    const fresh = await this.create();
    return fresh.id;
  }

  async get(): Promise<Cart | null> {
    this.getCredentials();
    const storedCartId = this.getStoredCartId();
    if (!storedCartId) {
      return null;
    }

    const data = await this.executeQuery<{
      cart?: ShopifyRawCart | null;
    }>(GET_CART_QUERY, { id: storedCartId });

    if (!data.cart) {
      this.clearStoredCartId();
      this.resetClientStore();
      return null;
    }

    const cart = normalizeShopifyCart(data.cart);
    this.updateClientStore(cart);
    return cart;
  }

  async create(): Promise<Cart> {
    const data = await this.executeQuery<{
      cartCreate?: {
        cart?: ShopifyRawCart | null;
        userErrors?: ShopifyUserError[];
      };
    }>(CART_CREATE_MUTATION, { input: {} });

    checkUserErrors(data.cartCreate?.userErrors);
    if (!data.cartCreate?.cart) {
      throw new Error("Failed to create cart.");
    }

    const cart = normalizeShopifyCart(data.cartCreate.cart);
    this.setStoredCartId(cart.id);
    this.updateClientStore(cart);
    return cart;
  }

  async addLines(lines: AddCartLineInput[]): Promise<Cart> {
    if (lines.length === 0) {
      const c = await this.get();
      return c ?? (await this.create());
    }

    const formattedLines = lines.map((l) => ({
      merchandiseId: l.variantId,
      quantity: l.quantity,
      ...(l.sellingPlanId ? { sellingPlanId: l.sellingPlanId } : {}),
      ...(l.customAttributes
        ? {
            attributes: Object.entries(l.customAttributes).map(
              ([key, value]) => ({ key, value })
            ),
          }
        : {}),
    }));

    const storedCartId = this.getStoredCartId();

    if (!storedCartId) {
      const data = await this.executeQuery<{
        cartCreate?: {
          cart?: ShopifyRawCart | null;
          userErrors?: ShopifyUserError[];
        };
      }>(CART_CREATE_MUTATION, {
        input: { lines: formattedLines },
      });

      checkUserErrors(data.cartCreate?.userErrors);
      if (!data.cartCreate?.cart) {
        throw new Error("Failed to create cart with lines.");
      }

      const cart = normalizeShopifyCart(data.cartCreate.cart);
      this.setStoredCartId(cart.id);
      this.updateClientStore(cart);
      return cart;
    }

    try {
      const data = await this.executeQuery<{
        cartLinesAdd?: {
          cart?: ShopifyRawCart | null;
          userErrors?: ShopifyUserError[];
        };
      }>(CART_LINES_ADD_MUTATION, {
        cartId: storedCartId,
        lines: formattedLines,
      });

      checkUserErrors(data.cartLinesAdd?.userErrors);
      if (!data.cartLinesAdd?.cart) {
        throw new Error("Failed to add lines to cart.");
      }

      const cart = normalizeShopifyCart(data.cartLinesAdd.cart);
      this.setStoredCartId(cart.id);
      this.updateClientStore(cart);
      return cart;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (
        msg.includes("does not exist") ||
        msg.includes("Cart not found") ||
        msg.includes("invalid id")
      ) {
        this.clearStoredCartId();
        return this.addLines(lines);
      }
      throw err;
    }
  }

  async addKit(
    _kitSlug?: string,
    _quantity?: number,
    _sellingPlanId?: string | null
  ): Promise<Cart> {
    void _kitSlug;
    void _quantity;
    void _sellingPlanId;
    throw new Error(
      "Kits are not available at launch in live mode (not implemented: onda 4)."
    );
  }

  async updateLines(lines: UpdateCartLineInput[]): Promise<Cart> {
    if (lines.length === 0) {
      const c = await this.get();
      return c ?? (await this.create());
    }

    const cartId = await this.getOrCreateCartId();

    const zeroQuantityLineIds = lines
      .filter((l) => l.quantity === 0)
      .map((l) => l.id);
    const nonZeroLines = lines.filter((l) => l.quantity !== 0);

    let lastCart: Cart | null = null;

    if (zeroQuantityLineIds.length > 0) {
      lastCart = await this.removeLines(zeroQuantityLineIds);
    }

    if (nonZeroLines.length > 0) {
      const formattedLines = nonZeroLines.map((l) => ({
        id: l.id,
        ...(l.quantity !== undefined ? { quantity: l.quantity } : {}),
        ...(l.sellingPlanId !== undefined
          ? { sellingPlanId: l.sellingPlanId }
          : {}),
      }));

      const data = await this.executeQuery<{
        cartLinesUpdate?: {
          cart?: ShopifyRawCart | null;
          userErrors?: ShopifyUserError[];
        };
      }>(CART_LINES_UPDATE_MUTATION, {
        cartId,
        lines: formattedLines,
      });

      checkUserErrors(data.cartLinesUpdate?.userErrors);
      if (!data.cartLinesUpdate?.cart) {
        throw new Error("Failed to update lines: no cart returned.");
      }

      lastCart = normalizeShopifyCart(data.cartLinesUpdate.cart);
      this.updateClientStore(lastCart);
    }

    return lastCart ?? (await this.get()) ?? (await this.create());
  }

  async removeLines(lineIds: string[]): Promise<Cart> {
    if (lineIds.length === 0) {
      const c = await this.get();
      return c ?? (await this.create());
    }

    const cartId = await this.getOrCreateCartId();
    const data = await this.executeQuery<{
      cartLinesRemove?: {
        cart?: ShopifyRawCart | null;
        userErrors?: ShopifyUserError[];
      };
    }>(CART_LINES_REMOVE_MUTATION, {
      cartId,
      lineIds,
    });

    checkUserErrors(data.cartLinesRemove?.userErrors);
    if (!data.cartLinesRemove?.cart) {
      throw new Error("Failed to remove lines from cart.");
    }

    const cart = normalizeShopifyCart(data.cartLinesRemove.cart);
    this.updateClientStore(cart);
    return cart;
  }

  async applyDiscount(code: string): Promise<Cart> {
    const cart = (await this.get()) ?? (await this.create());
    const existingCodes = (cart.discountCodes ?? []).map((d) => d.code);
    const normalized = code.trim();

    if (
      !existingCodes.some((c) => c.toLowerCase() === normalized.toLowerCase())
    ) {
      existingCodes.push(normalized);
    }

    const data = await this.executeQuery<{
      cartDiscountCodesUpdate?: {
        cart?: ShopifyRawCart | null;
        userErrors?: ShopifyUserError[];
      };
    }>(CART_DISCOUNT_CODES_UPDATE_MUTATION, {
      cartId: cart.id,
      discountCodes: existingCodes,
    });

    checkUserErrors(data.cartDiscountCodesUpdate?.userErrors);
    if (!data.cartDiscountCodesUpdate?.cart) {
      throw new Error("Failed to update discount codes.");
    }

    const updated = normalizeShopifyCart(data.cartDiscountCodesUpdate.cart);
    this.updateClientStore(updated);
    return updated;
  }

  async setLineSellingPlan(
    lineId: string,
    sellingPlanId: string | null
  ): Promise<Cart> {
    const cartId = await this.getOrCreateCartId();
    const data = await this.executeQuery<{
      cartLinesUpdate?: {
        cart?: ShopifyRawCart | null;
        userErrors?: ShopifyUserError[];
      };
    }>(CART_LINES_UPDATE_MUTATION, {
      cartId,
      lines: [
        {
          id: lineId,
          sellingPlanId: sellingPlanId || null,
        },
      ],
    });

    checkUserErrors(data.cartLinesUpdate?.userErrors);
    if (!data.cartLinesUpdate?.cart) {
      throw new Error("Failed to update selling plan: no cart returned.");
    }

    const updated = normalizeShopifyCart(data.cartLinesUpdate.cart);
    this.updateClientStore(updated);
    return updated;
  }

  async checkoutUrl(): Promise<string> {
    const cart = (await this.get()) ?? (await this.create());
    return cart.checkoutUrl;
  }
}

export const liveCartProvider = new LiveCartProvider();
