/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  CatalogFilter,
  CatalogProvider,
  CatalogSort,
  Collection,
  Kit,
  Product,
  ProductLine,
} from "@/lib/contracts/catalog";
import type {
  AddCartLineInput,
  Cart,
  CartProvider,
  UpdateCartLineInput,
} from "@/lib/contracts/cart";
import type {
  AccountProvider,
  Address,
  CustomerProfile,
  GuestOrderLookupInput,
  Order,
  OrderLine,
  Pet,
  PetInput,
  ProfileInput,
  Session,
} from "@/lib/contracts/account";
import type {
  Subscription,
  SubscriptionCapabilities,
  SubscriptionProvider,
} from "@/lib/contracts/subscription";
import type {
  Review,
  ReviewSummary,
  ReviewsFilter,
  ReviewsProvider,
  SubmitReviewInput,
} from "@/lib/contracts/reviews";
import type {
  ApplicationInput,
  ApplicationType,
  ContactInput,
  FormSubmissionResult,
  FormsProvider,
  PrivacyRequestInput,
} from "@/lib/contracts/forms";
import type { LabLot, LabsFilter, LabsProvider } from "@/lib/contracts/labs";
import type { Campaign, CampaignConfig } from "@/lib/contracts/campaign";

const NOT_IMPLEMENTED_MSG = "not implemented: onda 4";

export class LiveCatalogProvider implements CatalogProvider {
  async getProducts(_filter?: CatalogFilter): Promise<Product[]> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async getProduct(_slug: string): Promise<Product | null> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async getCollection(
    _handle: string,
    _filter?: CatalogFilter,
    _sort?: CatalogSort
  ): Promise<Collection | null> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async getKits(_line?: ProductLine): Promise<Kit[]> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async getKit(_slug: string): Promise<Kit | null> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async search(_q: string): Promise<Product[]> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
}

export class LiveCartProvider implements CartProvider {
  async get(): Promise<Cart | null> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async create(): Promise<Cart> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async addLines(_lines: AddCartLineInput[]): Promise<Cart> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async addKit(
    _kitSlug: string,
    _quantity: number,
    _sellingPlanId?: string | null
  ): Promise<Cart> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async updateLines(_lines: UpdateCartLineInput[]): Promise<Cart> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async removeLines(_lineIds: string[]): Promise<Cart> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async applyDiscount(_code: string): Promise<Cart> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async setLineSellingPlan(
    _lineId: string,
    _sellingPlanId: string | null
  ): Promise<Cart> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async checkoutUrl(): Promise<string> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
}

export class LiveAccountProvider implements AccountProvider {
  async getSession(): Promise<Session | null> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async signInUrl(_returnTo?: string): Promise<string> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async signOut(): Promise<void> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async getCustomer(): Promise<CustomerProfile | null> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async getOrders(): Promise<Order[]> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async getOrder(_id: string): Promise<Order | null> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async lookupGuestOrder(
    _orderNumberOrInput: string | GuestOrderLookupInput,
    _email?: string
  ): Promise<Order | null> {
    // TODO: Shopify Storefront / Orders API guest lookup in Onda 4
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async reorder(_orderId: string): Promise<OrderLine[]> {
    // TODO: Shopify Storefront order reorder in Onda 4
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async getAddresses(): Promise<Address[]> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async updateProfile(_input: ProfileInput): Promise<CustomerProfile> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async getPets(): Promise<Pet[]> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async savePet(_pet: PetInput): Promise<Pet> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
}

export class LiveSubscriptionProvider implements SubscriptionProvider {
  async list(): Promise<Subscription[]> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async get(_id: string): Promise<Subscription | null> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async capabilities(): Promise<SubscriptionCapabilities> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async skip(_id: string): Promise<Subscription> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async reschedule(
    _id: string,
    _nextBillingDate: string
  ): Promise<Subscription> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async changeFrequency(
    _id: string,
    _intervalDays: number
  ): Promise<Subscription> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async swapProduct(
    _id: string,
    _lineId: string,
    _newVariantId: string
  ): Promise<Subscription> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async changeQuantity(
    _id: string,
    _lineId: string,
    _quantity: number
  ): Promise<Subscription> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async pause(_id: string): Promise<Subscription> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async resume(_id: string): Promise<Subscription> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async cancel(
    _id: string,
    _reason: string,
    _feedback?: string
  ): Promise<Subscription> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
}

export class LiveReviewsProvider implements ReviewsProvider {
  async list(
    _filter?: ReviewsFilter
  ): Promise<{ reviews: Review[]; total: number }> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async summary(_productSlug: string): Promise<ReviewSummary> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async submit(_payload: SubmitReviewInput): Promise<Review> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
}

export class LiveFormsProvider implements FormsProvider {
  async subscribe(
    _list: string,
    _email: string,
    _consent: boolean
  ): Promise<FormSubmissionResult> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async sendContact(_payload: ContactInput): Promise<FormSubmissionResult> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async sendPrivacyRequest(
    _payload: PrivacyRequestInput
  ): Promise<FormSubmissionResult> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async sendApplication(
    _type: ApplicationType,
    _payload: ApplicationInput
  ): Promise<FormSubmissionResult> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async trackEvent(
    _name: string,
    _email: string | null,
    _properties?: Record<string, unknown>
  ): Promise<{ success: boolean }> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
}

export class LiveLabsProvider implements LabsProvider {
  async findLot(_lotNumber: string): Promise<LabLot | null> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
  async listLots(_filter?: LabsFilter): Promise<LabLot[]> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
}

export class LiveCampaignConfig implements CampaignConfig {
  async getActiveCampaign(): Promise<Campaign | null> {
    throw new Error(NOT_IMPLEMENTED_MSG);
  }
}

export const liveCatalogProvider = new LiveCatalogProvider();
export const liveCartProvider = new LiveCartProvider();
export const liveAccountProvider = new LiveAccountProvider();
export const liveSubscriptionProvider = new LiveSubscriptionProvider();
export const liveReviewsProvider = new LiveReviewsProvider();
export const liveFormsProvider = new LiveFormsProvider();
export const liveLabsProvider = new LiveLabsProvider();
export const liveCampaignConfig = new LiveCampaignConfig();
