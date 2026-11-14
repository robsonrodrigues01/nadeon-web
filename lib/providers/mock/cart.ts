import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  type AddCartLineInput,
  type Cart,
  type CartDiscountCode,
  type CartLineItem,
  type CartProvider,
  type UpdateCartLineInput,
  CartSchema,
} from "@/lib/contracts/cart";
import type { Kit, Product } from "@/lib/contracts/catalog";
import { mockCatalogProvider } from "./catalog";

const KIT_VARIANT_PREFIX = "kit:";

// Preço do kit pelo plano: o plano precisa existir em um dos produtos do kit.
function resolveKitPrice(
  kit: Kit,
  products: Product[],
  sellingPlanId: string | null | undefined
): { amount: number; planName?: string } {
  if (!sellingPlanId) return { amount: kit.price.amount };
  const plan = kit.products
    .map((ref) => products.find((p) => p.slug === ref.productSlug))
    .flatMap((p) => p?.sellingPlans ?? [])
    .find((sp) => sp.id === sellingPlanId);
  if (!plan) {
    throw new Error(`Selling plan not available for kit: ${sellingPlanId}`);
  }
  return {
    amount: Number(
      (kit.price.amount * ((100 - plan.discountPercentage) / 100)).toFixed(2)
    ),
    planName: plan.name,
  };
}

interface CartStoreState {
  cart: Cart;
  setCart: (cart: Cart) => void;
  resetCart: () => void;
}

const VALID_DISCOUNTS: Record<string, number> = {
  WELCOME10: 10,
  NADEON10: 10,
  SAVE15: 15,
};

function createInitialCart(id?: string): Cart {
  const cartId = id || `cart_${Math.random().toString(36).substring(2, 9)}`;
  return {
    id: cartId,
    lines: [],
    discountCodes: [],
    subtotalPrice: { amount: 0, currencyCode: "USD" },
    totalDiscount: { amount: 0, currencyCode: "USD" },
    totalPrice: { amount: 0, currencyCode: "USD" },
    totalQuantity: 0,
    checkoutUrl: `https://checkout.nadeon.com/mock/${cartId}`,
  };
}

function recalculateCart(
  lines: CartLineItem[],
  discountCodes: CartDiscountCode[],
  id: string
): Cart {
  let subtotal = 0;
  let totalQuantity = 0;

  for (const line of lines) {
    subtotal += line.total.amount;
    totalQuantity += line.quantity;
  }

  // Calculate discounts
  let totalDiscountAmount = 0;
  const updatedDiscounts: CartDiscountCode[] = [];

  for (const dc of discountCodes) {
    const percent = VALID_DISCOUNTS[dc.code.toUpperCase()];
    if (percent !== undefined) {
      const discountVal = Number(((subtotal * percent) / 100).toFixed(2));
      totalDiscountAmount += discountVal;
      updatedDiscounts.push({
        code: dc.code,
        applicable: true,
        discountAmount: { amount: discountVal, currencyCode: "USD" },
      });
    } else {
      updatedDiscounts.push({
        code: dc.code,
        applicable: false,
      });
    }
  }

  const totalPrice = Math.max(
    0,
    Number((subtotal - totalDiscountAmount).toFixed(2))
  );

  const updatedCart: Cart = {
    id,
    lines,
    discountCodes: updatedDiscounts,
    subtotalPrice: { amount: Number(subtotal.toFixed(2)), currencyCode: "USD" },
    totalDiscount: {
      amount: Number(totalDiscountAmount.toFixed(2)),
      currencyCode: "USD",
    },
    totalPrice: { amount: totalPrice, currencyCode: "USD" },
    totalQuantity,
    checkoutUrl: `https://checkout.nadeon.com/mock/${id}`,
  };

  return CartSchema.parse(updatedCart);
}

// Memory fallback storage for Node / SSR
const memoryStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (name: string) => store[name] ?? null,
    setItem: (name: string, value: string) => {
      store[name] = value;
    },
    removeItem: (name: string) => {
      delete store[name];
    },
    clear: () => {
      store = {};
    },
  };
})();

export const useCartStore = create<CartStoreState>()(
  persist(
    (set) => ({
      cart: createInitialCart(),
      setCart: (cart: Cart) => set({ cart }),
      resetCart: () => set({ cart: createInitialCart() }),
    }),
    {
      name: "nadeon-cart-storage",
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined" && window.localStorage) {
          return window.localStorage;
        }
        return memoryStorage;
      }),
    }
  )
);

export class MockCartProvider implements CartProvider {
  async get(): Promise<Cart | null> {
    return useCartStore.getState().cart;
  }

  async create(): Promise<Cart> {
    const freshCart = createInitialCart();
    useCartStore.getState().setCart(freshCart);
    return freshCart;
  }

  async addLines(lines: AddCartLineInput[]): Promise<Cart> {
    const currentCart = useCartStore.getState().cart;
    const allProducts = await mockCatalogProvider.getProducts();

    const newLines = [...currentCart.lines];

    for (const input of lines) {
      // Find matching product variant
      let matchedProduct = null;
      let matchedVariant = null;

      for (const prod of allProducts) {
        const variant = prod.variants.find((v) => v.id === input.variantId);
        if (variant) {
          matchedProduct = prod;
          matchedVariant = variant;
          break;
        }
      }

      if (!matchedProduct || !matchedVariant) {
        throw new Error(`Variant not found: ${input.variantId}`);
      }

      let linePriceAmount = matchedVariant.price.amount;
      let sellingPlanTitle: string | undefined;

      if (input.sellingPlanId) {
        const plan = matchedProduct.sellingPlans.find(
          (sp) => sp.id === input.sellingPlanId
        );
        if (plan) {
          sellingPlanTitle = plan.name;
          const discountMultiplier = (100 - plan.discountPercentage) / 100;
          linePriceAmount = Number(
            (linePriceAmount * discountMultiplier).toFixed(2)
          );
        }
      }

      const existingIndex = newLines.findIndex(
        (l) =>
          l.variantId === input.variantId &&
          l.sellingPlanId === (input.sellingPlanId || null)
      );

      if (existingIndex >= 0) {
        const existing = newLines[existingIndex];
        const newQty = existing.quantity + input.quantity;
        newLines[existingIndex] = {
          ...existing,
          quantity: newQty,
          total: {
            amount: Number((linePriceAmount * newQty).toFixed(2)),
            currencyCode: "USD",
          },
        };
      } else {
        const lineId = `line_${Math.random().toString(36).substring(2, 9)}`;
        newLines.push({
          id: lineId,
          variantId: input.variantId,
          quantity: input.quantity,
          sellingPlanId: input.sellingPlanId || null,
          sellingPlanTitle,
          compareAtPrice: sellingPlanTitle ? matchedVariant.price : undefined,
          product: {
            id: matchedProduct.slug,
            title: matchedProduct.name,
            handle: matchedProduct.handle,
            image: matchedProduct.images[0],
            line: matchedProduct.line,
          },
          price: { amount: linePriceAmount, currencyCode: "USD" },
          total: {
            amount: Number((linePriceAmount * input.quantity).toFixed(2)),
            currencyCode: "USD",
          },
          customAttributes: input.customAttributes,
        });
      }
    }

    const updated = recalculateCart(
      newLines,
      currentCart.discountCodes,
      currentCart.id
    );
    useCartStore.getState().setCart(updated);
    return updated;
  }

  async addKit(
    kitSlug: string,
    quantity: number,
    sellingPlanId?: string | null
  ): Promise<Cart> {
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error(`Invalid kit quantity: ${quantity}`);
    }
    const kit = await mockCatalogProvider.getKit(kitSlug);
    if (!kit) throw new Error(`Kit not found: ${kitSlug}`);

    const allProducts = await mockCatalogProvider.getProducts();
    const plan = sellingPlanId || null;
    const { amount, planName } = resolveKitPrice(kit, allProducts, plan);
    const variantId = `${KIT_VARIANT_PREFIX}${kit.slug}`;

    const currentCart = useCartStore.getState().cart;
    const newLines = [...currentCart.lines];
    const existingIndex = newLines.findIndex(
      (l) => l.variantId === variantId && l.sellingPlanId === plan
    );

    if (existingIndex >= 0) {
      const existing = newLines[existingIndex];
      const newQty = existing.quantity + quantity;
      newLines[existingIndex] = {
        ...existing,
        quantity: newQty,
        total: {
          amount: Number((amount * newQty).toFixed(2)),
          currencyCode: kit.price.currencyCode,
        },
      };
    } else {
      newLines.push({
        id: `line_${Math.random().toString(36).substring(2, 9)}`,
        variantId,
        quantity,
        sellingPlanId: plan,
        sellingPlanTitle: planName,
        compareAtPrice: planName ? kit.price : undefined,
        product: {
          id: kit.slug,
          title: kit.name,
          handle: kit.handle,
          image: kit.images[0],
          line: kit.line,
        },
        kit: {
          slug: kit.slug,
          name: kit.name,
          items: kit.products.map((ref) => ({
            title:
              allProducts.find((p) => p.slug === ref.productSlug)?.name ??
              ref.productSlug,
            quantity: ref.quantity,
          })),
        },
        price: { amount, currencyCode: kit.price.currencyCode },
        total: {
          amount: Number((amount * quantity).toFixed(2)),
          currencyCode: kit.price.currencyCode,
        },
      });
    }

    const updated = recalculateCart(
      newLines,
      currentCart.discountCodes,
      currentCart.id
    );
    useCartStore.getState().setCart(updated);
    return updated;
  }

  async updateLines(lines: UpdateCartLineInput[]): Promise<Cart> {
    const currentCart = useCartStore.getState().cart;
    const allProducts = await mockCatalogProvider.getProducts();

    let updatedLines = [...currentCart.lines];

    for (const update of lines) {
      const idx = updatedLines.findIndex((l) => l.id === update.id);
      if (idx === -1) continue;

      if (update.quantity === 0) {
        updatedLines = updatedLines.filter((l) => l.id !== update.id);
        continue;
      }

      const currentLine = updatedLines[idx];
      const newQty = update.quantity ?? currentLine.quantity;
      const newSellingPlanId =
        update.sellingPlanId !== undefined
          ? update.sellingPlanId
          : currentLine.sellingPlanId;

      if (currentLine.kit) {
        // Linha de kit: o preço base é o do kit, nunca o das fórmulas
        const kit = await mockCatalogProvider.getKit(currentLine.kit.slug);
        if (!kit) throw new Error(`Kit not found: ${currentLine.kit.slug}`);
        const { amount, planName } = resolveKitPrice(
          kit,
          allProducts,
          newSellingPlanId
        );
        updatedLines[idx] = {
          ...currentLine,
          quantity: newQty,
          sellingPlanId: newSellingPlanId || null,
          sellingPlanTitle: planName,
          compareAtPrice: planName ? kit.price : undefined,
          price: { amount, currencyCode: currentLine.price.currencyCode },
          total: {
            amount: Number((amount * newQty).toFixed(2)),
            currencyCode: currentLine.price.currencyCode,
          },
        };
        continue;
      }

      // recalculate price based on variant and selling plan
      let unitPrice = currentLine.price.amount;
      let sellingPlanTitle = currentLine.sellingPlanTitle;
      let compareAtPrice: CartLineItem["compareAtPrice"];

      // look up base variant price
      for (const prod of allProducts) {
        const v = prod.variants.find(
          (variant) => variant.id === currentLine.variantId
        );
        if (v) {
          unitPrice = v.price.amount;
          if (newSellingPlanId) {
            const plan = prod.sellingPlans.find(
              (sp) => sp.id === newSellingPlanId
            );
            if (plan) {
              sellingPlanTitle = plan.name;
              compareAtPrice = v.price;
              unitPrice = Number(
                (
                  v.price.amount *
                  ((100 - plan.discountPercentage) / 100)
                ).toFixed(2)
              );
            }
          } else {
            sellingPlanTitle = undefined;
          }
          break;
        }
      }

      updatedLines[idx] = {
        ...currentLine,
        quantity: newQty,
        sellingPlanId: newSellingPlanId || null,
        sellingPlanTitle,
        compareAtPrice,
        price: { amount: unitPrice, currencyCode: "USD" },
        total: {
          amount: Number((unitPrice * newQty).toFixed(2)),
          currencyCode: "USD",
        },
      };
    }

    const updated = recalculateCart(
      updatedLines,
      currentCart.discountCodes,
      currentCart.id
    );
    useCartStore.getState().setCart(updated);
    return updated;
  }

  async removeLines(lineIds: string[]): Promise<Cart> {
    const currentCart = useCartStore.getState().cart;
    const remainingLines = currentCart.lines.filter(
      (l) => !lineIds.includes(l.id)
    );
    const updated = recalculateCart(
      remainingLines,
      currentCart.discountCodes,
      currentCart.id
    );
    useCartStore.getState().setCart(updated);
    return updated;
  }

  async applyDiscount(code: string): Promise<Cart> {
    const trimmed = code.trim().toUpperCase();
    if (!VALID_DISCOUNTS[trimmed]) {
      throw new Error(`Invalid discount code: "${code}"`);
    }

    const currentCart = useCartStore.getState().cart;
    const discountCodes = [
      ...currentCart.discountCodes.filter(
        (d) => d.code.toUpperCase() !== trimmed
      ),
      { code: trimmed, applicable: true },
    ];

    const updated = recalculateCart(
      currentCart.lines,
      discountCodes,
      currentCart.id
    );
    useCartStore.getState().setCart(updated);
    return updated;
  }

  async setLineSellingPlan(
    lineId: string,
    sellingPlanId: string | null
  ): Promise<Cart> {
    return this.updateLines([{ id: lineId, sellingPlanId }]);
  }

  async checkoutUrl(): Promise<string> {
    const currentCart = useCartStore.getState().cart;
    return currentCart.checkoutUrl;
  }
}

export const mockCartProvider = new MockCartProvider();
