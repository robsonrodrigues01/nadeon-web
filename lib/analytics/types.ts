import { z } from "zod";

export const ProductLineEnum = z.enum(["human", "pet"]);
export type ProductLine = z.infer<typeof ProductLineEnum>;

export const ExtendedLineEnum = z.enum(["human", "pet", "mixed"]);
export type ExtendedLine = z.infer<typeof ExtendedLineEnum>;

// 1. view_item
export const ViewItemPayloadSchema = z.object({
  item_id: z.string().min(1),
  item_name: z.string().min(1),
  price: z.number().nonnegative(),
  currency: z.string().min(1),
  line: ProductLineEnum,
  item_category: z.string().optional(),
  species: z.string().optional(),
  format: z.string().optional(),
});
export type ViewItemPayload = z.infer<typeof ViewItemPayloadSchema>;

// 2. add_to_cart
export const AddToCartPayloadSchema = z.object({
  item_id: z.string().min(1),
  item_name: z.string().min(1),
  price: z.number().nonnegative(),
  quantity: z.number().int().positive(),
  currency: z.string().min(1),
  line: ProductLineEnum,
  item_category: z.string().optional(),
  frequency: z.enum(["one-time", "subscription"]).optional(),
  subscription_interval: z.string().optional(),
  plan_id: z.string().optional(),
});
export type AddToCartPayload = z.infer<typeof AddToCartPayloadSchema>;

// 3. begin_checkout
export const BeginCheckoutPayloadSchema = z.object({
  value: z.number().nonnegative(),
  currency: z.string().min(1),
  item_count: z.number().int().positive(),
  line: ExtendedLineEnum.optional(),
  cart_id: z.string().optional(),
  coupon: z.string().optional(),
});
export type BeginCheckoutPayload = z.infer<typeof BeginCheckoutPayloadSchema>;

// 4. subscribe_newsletter
export const SubscribeNewsletterPayloadSchema = z.object({
  list: z.string().min(1),
  source: z.string().optional(),
  line: ProductLineEnum.optional(),
});
export type SubscribeNewsletterPayload = z.infer<
  typeof SubscribeNewsletterPayloadSchema
>;

// 5. quiz_complete
export const QuizCompletePayloadSchema = z.object({
  quiz_id: z.string().optional(),
  line: ProductLineEnum,
  species: z.string().optional(),
  recommended_slug: z.string().optional(),
  answers_count: z.number().int().nonnegative().optional(),
});
export type QuizCompletePayload = z.infer<typeof QuizCompletePayloadSchema>;

// 6. purchase
export const PurchasePayloadSchema = z.object({
  transaction_id: z.string().min(1),
  value: z.number().nonnegative(),
  currency: z.string().min(1),
  item_count: z.number().int().positive(),
  line: ExtendedLineEnum.optional(),
  tax: z.number().nonnegative().optional(),
  shipping: z.number().nonnegative().optional(),
  coupon: z.string().optional(),
});
export type PurchasePayload = z.infer<typeof PurchasePayloadSchema>;

// Extended events from Plan v3 Section 6.5
export const ViewItemListPayloadSchema = z.object({
  item_list_id: z.string().optional(),
  item_list_name: z.string().optional(),
  line: ProductLineEnum.optional(),
});
export type ViewItemListPayload = z.infer<typeof ViewItemListPayloadSchema>;

export const SelectItemPayloadSchema = z.object({
  item_id: z.string().min(1),
  item_name: z.string().min(1),
  item_list_name: z.string().optional(),
  line: ProductLineEnum.optional(),
});
export type SelectItemPayload = z.infer<typeof SelectItemPayloadSchema>;

export const RemoveFromCartPayloadSchema = z.object({
  item_id: z.string().min(1),
  item_name: z.string().min(1),
  quantity: z.number().int().positive().optional(),
  line: ProductLineEnum.optional(),
});
export type RemoveFromCartPayload = z.infer<typeof RemoveFromCartPayloadSchema>;

export const ViewCartPayloadSchema = z.object({
  value: z.number().nonnegative(),
  currency: z.string().min(1),
  item_count: z.number().int().nonnegative(),
});
export type ViewCartPayload = z.infer<typeof ViewCartPayloadSchema>;

export const SignUpPayloadSchema = z.object({
  method: z.string().optional(),
});
export type SignUpPayload = z.infer<typeof SignUpPayloadSchema>;

export const QuizStartPayloadSchema = z.object({
  quiz_id: z.string().optional(),
  line: ProductLineEnum,
});
export type QuizStartPayload = z.infer<typeof QuizStartPayloadSchema>;

export const LabLookupPayloadSchema = z.object({
  lot_number: z.string().min(1),
  line: ProductLineEnum.optional(),
  success: z.boolean().optional(),
});
export type LabLookupPayload = z.infer<typeof LabLookupPayloadSchema>;

export const SearchPayloadSchema = z.object({
  search_term: z.string().min(1),
  line: ProductLineEnum.optional(),
  results_count: z.number().int().nonnegative().optional(),
});
export type SearchPayload = z.infer<typeof SearchPayloadSchema>;

export interface AnalyticsEventMap {
  view_item: ViewItemPayload;
  add_to_cart: AddToCartPayload;
  begin_checkout: BeginCheckoutPayload;
  subscribe_newsletter: SubscribeNewsletterPayload;
  quiz_complete: QuizCompletePayload;
  purchase: PurchasePayload;
  view_item_list: ViewItemListPayload;
  select_item: SelectItemPayload;
  remove_from_cart: RemoveFromCartPayload;
  view_cart: ViewCartPayload;
  sign_up: SignUpPayload;
  quiz_start: QuizStartPayload;
  lab_lookup: LabLookupPayload;
  search: SearchPayload;
}

export type AnalyticsEventName = keyof AnalyticsEventMap;

export interface TrackOptions {
  consent?: boolean;
  debug?: boolean;
}

export interface TrackResult<
  E extends AnalyticsEventName = AnalyticsEventName,
> {
  tracked: boolean;
  event: E;
  reason?: "consent_denied" | "validation_error" | "ssr_disabled";
  payload?: AnalyticsEventMap[E];
  error?: unknown;
}
