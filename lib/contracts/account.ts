import { z } from "zod";
import { MoneySchema } from "./catalog";

export const AddressSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  company: z.string().optional(),
  address1: z.string(),
  address2: z.string().optional(),
  city: z.string(),
  province: z.string().optional(),
  zip: z.string(),
  country: z.string().default("US"),
  phone: z.string().optional(),
  isDefault: z.boolean().default(false),
});
export type Address = z.infer<typeof AddressSchema>;

export const PetSpeciesSchema = z.enum(["dog", "cat", "horse"]);
export type PetSpecies = z.infer<typeof PetSpeciesSchema>;

export const PetActivityLevelSchema = z.enum(["low", "moderate", "high"]);
export type PetActivityLevel = z.infer<typeof PetActivityLevelSchema>;

export const PetSchema = z.object({
  id: z.string(),
  name: z.string(),
  species: PetSpeciesSchema,
  breed: z.string(),
  birthDate: z.string().optional(),
  weightLbs: z.number().positive().optional(),
  activityLevel: PetActivityLevelSchema.optional(),
  concerns: z.array(z.string()).default([]),
  photoUrl: z.string().optional(),
});
export type Pet = z.infer<typeof PetSchema>;

export const PetInputSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  species: PetSpeciesSchema,
  breed: z.string().min(1),
  birthDate: z.string().optional(),
  weightLbs: z.number().positive().optional(),
  activityLevel: PetActivityLevelSchema.optional(),
  concerns: z.array(z.string()).optional(),
  photoUrl: z.string().optional(),
});
export type PetInput = z.infer<typeof PetInputSchema>;

export const CustomerProfileTypeSchema = z.enum(["Human", "Pet", "Both"]);
export type CustomerProfileType = z.infer<typeof CustomerProfileTypeSchema>;

export const CustomerProfileSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
  profileType: CustomerProfileTypeSchema.default("Both"),
  defaultAddressId: z.string().optional(),
});
export type CustomerProfile = z.infer<typeof CustomerProfileSchema>;

export const ProfileInputSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
  profileType: CustomerProfileTypeSchema.optional(),
  defaultAddressId: z.string().optional(),
});
export type ProfileInput = z.infer<typeof ProfileInputSchema>;

export const OrderItemSchema = z.object({
  title: z.string(),
  quantity: z.number().int().positive(),
  price: MoneySchema,
  image: z.string().optional(),
  variantTitle: z.string().optional(),
});
export type OrderItem = z.infer<typeof OrderItemSchema>;

export const FulfillmentStatusSchema = z.enum([
  "processing",
  "in_transit",
  "delivered",
]);
export type FulfillmentStatus = z.infer<typeof FulfillmentStatusSchema>;

export const FinancialStatusSchema = z.enum(["paid", "pending", "refunded"]);
export type FinancialStatus = z.infer<typeof FinancialStatusSchema>;

export const OrderSchema = z.object({
  id: z.string(),
  orderNumber: z.string(),
  createdAt: z.string(),
  financialStatus: FinancialStatusSchema,
  fulfillmentStatus: FulfillmentStatusSchema,
  items: z.array(OrderItemSchema),
  total: MoneySchema,
  shippingAddress: AddressSchema.optional(),
  trackingNumber: z.string().optional(),
  trackingUrl: z.string().optional(),
});
export type Order = z.infer<typeof OrderSchema>;

export const SessionSchema = z.object({
  accessToken: z.string(),
  expiresAt: z.string(),
  customerId: z.string(),
});
export type Session = z.infer<typeof SessionSchema>;

export interface AccountProvider {
  getSession(): Promise<Session | null>;
  signInUrl(returnTo?: string): Promise<string>;
  signOut(): Promise<void>;
  getCustomer(): Promise<CustomerProfile | null>;
  getOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | null>;
  getAddresses(): Promise<Address[]>;
  updateProfile(input: ProfileInput): Promise<CustomerProfile>;
  getPets(): Promise<Pet[]>;
  savePet(pet: PetInput): Promise<Pet>;
}
