import { z } from "zod";
import { MoneySchema, ProductLineSchema } from "./catalog";

export const CartKitSchema = z.object({
  slug: z.string(),
  name: z.string(),
  items: z.array(
    z.object({
      title: z.string(),
      quantity: z.number().int().positive(),
    })
  ),
});
export type CartKit = z.infer<typeof CartKitSchema>;

export const CartLineItemSchema = z.object({
  id: z.string(),
  variantId: z.string(),
  quantity: z.number().int().positive(),
  sellingPlanId: z.string().nullable().optional(),
  sellingPlanTitle: z.string().optional(),
  product: z.object({
    id: z.string(),
    title: z.string(),
    handle: z.string(),
    image: z.string().optional(),
    line: ProductLineSchema,
  }),
  // Presente só em linhas de kit: preço e itens vêm do kit, não das fórmulas avulsas.
  kit: CartKitSchema.optional(),
  // Preço sem plano por unidade; vem do catálogo e só existe com sellingPlanId.
  compareAtPrice: MoneySchema.optional(),
  // Desconto do plano da linha (ou do primeiro plano do produto na compra avulsa): alimenta os textos de assinatura da gaveta.
  subscriptionDiscountPercentage: z.number().min(0).max(100).optional(),
  price: MoneySchema,
  total: MoneySchema,
  customAttributes: z.record(z.string(), z.string()).optional(),
});
export type CartLineItem = z.infer<typeof CartLineItemSchema>;

export const CartDiscountCodeSchema = z.object({
  code: z.string(),
  applicable: z.boolean(),
  discountAmount: MoneySchema.optional(),
});
export type CartDiscountCode = z.infer<typeof CartDiscountCodeSchema>;

export const CartSchema = z.object({
  id: z.string(),
  lines: z.array(CartLineItemSchema),
  discountCodes: z.array(CartDiscountCodeSchema),
  subtotalPrice: MoneySchema,
  totalDiscount: MoneySchema,
  totalPrice: MoneySchema,
  totalQuantity: z.number().int().nonnegative(),
  checkoutUrl: z.string(),
});
export type Cart = z.infer<typeof CartSchema>;

export const AddCartLineInputSchema = z.object({
  variantId: z.string(),
  quantity: z.number().int().positive(),
  sellingPlanId: z.string().nullable().optional(),
  customAttributes: z.record(z.string(), z.string()).optional(),
});
export type AddCartLineInput = z.infer<typeof AddCartLineInputSchema>;

export const UpdateCartLineInputSchema = z.object({
  id: z.string(),
  quantity: z.number().int().nonnegative().optional(),
  sellingPlanId: z.string().nullable().optional(),
});
export type UpdateCartLineInput = z.infer<typeof UpdateCartLineInputSchema>;

export interface CartProvider {
  get(): Promise<Cart | null>;
  create(): Promise<Cart>;
  addLines(lines: AddCartLineInput[]): Promise<Cart>;
  // Cobra o preço do kit (com o desconto do plano, se houver), não a soma das fórmulas.
  addKit(
    kitSlug: string,
    quantity: number,
    sellingPlanId?: string | null
  ): Promise<Cart>;
  updateLines(lines: UpdateCartLineInput[]): Promise<Cart>;
  removeLines(lineIds: string[]): Promise<Cart>;
  applyDiscount(code: string): Promise<Cart>;
  setLineSellingPlan(
    lineId: string,
    sellingPlanId: string | null
  ): Promise<Cart>;
  checkoutUrl(): Promise<string>;
}
