import {
  type AccountProvider,
  type Address,
  type CustomerProfile,
  type GuestOrderLookupInput,
  type GuestOrderTracking,
  type Order,
  type OrderLine,
  type Pet,
  type PetInput,
  type ProfileInput,
  type Session,
  CustomerProfileSchema,
  PetSchema,
  OrderSchema,
  GuestOrderTrackingSchema,
  AddressSchema,
  SessionSchema,
} from "@/lib/contracts/account";

let mockSession: Session | null = SessionSchema.parse({
  accessToken: "mock_tok_alex_123456789",
  expiresAt: new Date(Date.now() + 86400 * 1000 * 30).toISOString(),
  customerId: "cust_alex_example",
});

let mockCustomer: CustomerProfile = CustomerProfileSchema.parse({
  id: "cust_alex_example",
  firstName: "Alex",
  lastName: "Morgan",
  email: "alex.morgan@example.com",
  phone: "+1 (555) 234-5678",
  birthDate: "1988-05-14",
  profileType: "Both",
  defaultAddressId: "addr_alex_primary",
});

const mockAddresses: Address[] = [
  AddressSchema.parse({
    id: "addr_alex_primary",
    firstName: "Alex",
    lastName: "Morgan",
    company: "Acme Bio Labs",
    address1: "742 Evergreen Terrace",
    address2: "Apt 4B",
    city: "Austin",
    province: "TX",
    zip: "78701",
    country: "US",
    phone: "+1 (555) 234-5678",
    isDefault: true,
  }),
];

const mockOrders: Order[] = [
  OrderSchema.parse({
    id: "ord_TEST_0001",
    orderNumber: "TEST-NL-0001",
    createdAt: new Date(Date.now() - 86400 * 1000 * 5).toISOString(),
    financialStatus: "paid",
    fulfillmentStatus: "delivered",
    email: "test@example.com",
    items: [
      {
        title: "BioHack - 2 Jars (60 days)",
        quantity: 1,
        price: { amount: 118, currencyCode: "USD" },
        image: "/renders/biohack.png",
        variantTitle: "2 Jars",
        variantId: "var_biohack_1",
      },
    ],
    lines: [
      {
        variantId: "var_biohack_1",
        quantity: 1,
        image: "/renders/biohack.png",
        title: "BioHack - 2 Jars (60 days)",
        price: { amount: 118, currencyCode: "USD" },
      },
    ],
    total: { amount: 118, currencyCode: "USD" },
    shippingAddress: mockAddresses[0],
    trackingNumber: "1Z9999999999999999",
    trackingUrl: "https://www.ups.com/track?tracknum=1Z9999999999999999",
    url: "/account/orders/ord_TEST_0001",
    copyLink: "/account/orders/ord_TEST_0001",
    statusUrl: "https://track.nadeonlabs.com/orders/TEST-NL-0001",
    canReorder: true,
  }),
  OrderSchema.parse({
    id: "ord_TEST_0002",
    orderNumber: "TEST-NL-0002",
    createdAt: new Date(Date.now() - 86400 * 1000 * 20).toISOString(),
    financialStatus: "paid",
    fulfillmentStatus: "in_transit",
    email: "test@example.com",
    items: [
      {
        title: "More Good Years Soft Chews - 1 Jar",
        quantity: 1,
        price: { amount: 44, currencyCode: "USD" },
        image: "/renders/more-good-years.png",
        variantTitle: "1 Jar",
        variantId: "var_mgy_2",
      },
    ],
    lines: [
      {
        variantId: "var_mgy_2",
        quantity: 1,
        image: "/renders/more-good-years.png",
        title: "More Good Years Soft Chews - 1 Jar",
        price: { amount: 44, currencyCode: "USD" },
      },
    ],
    total: { amount: 44, currencyCode: "USD" },
    shippingAddress: mockAddresses[0],
    trackingNumber: "1Z8888888888888888",
    trackingUrl: "https://www.ups.com/track?tracknum=1Z8888888888888888",
    url: "/account/orders/ord_TEST_0002",
    copyLink: "/account/orders/ord_TEST_0002",
    statusUrl: "https://track.nadeonlabs.com/orders/TEST-NL-0002",
    canReorder: true,
  }),
];

const mockPets: Pet[] = [
  PetSchema.parse({
    id: "pet_cooper",
    name: "Cooper",
    species: "dog",
    breed: "Golden Retriever",
    birthDate: "2019-06-15",
    weightLbs: 68,
    activityLevel: "moderate",
    concerns: ["Joint comfort", "Healthy aging", "Mental sharpness"],
    photoUrl: "/renders/placeholder.svg",
  }),
];

export class MockAccountProvider implements AccountProvider {
  async getSession(): Promise<Session | null> {
    return mockSession ? { ...mockSession } : null;
  }

  async signInUrl(returnTo: string = "/account"): Promise<string> {
    return `/account/login?returnTo=${encodeURIComponent(returnTo)}`;
  }

  async signOut(): Promise<void> {
    mockSession = null;
  }

  async getCustomer(): Promise<CustomerProfile | null> {
    return mockCustomer ? { ...mockCustomer } : null;
  }

  async getOrders(): Promise<Order[]> {
    return [...mockOrders];
  }

  async getOrder(id: string): Promise<Order | null> {
    const found = mockOrders.find((o) => o.id === id || o.orderNumber === id);
    return found ? { ...found } : null;
  }

  async lookupGuestOrder(
    orderNumberOrInput: string | GuestOrderLookupInput,
    emailArg?: string
  ): Promise<GuestOrderTracking | null> {
    let orderNumber: string;
    let email: string;

    if (typeof orderNumberOrInput === "object" && orderNumberOrInput !== null) {
      orderNumber = orderNumberOrInput.orderNumber;
      email = orderNumberOrInput.email;
    } else {
      orderNumber = orderNumberOrInput;
      email = emailArg ?? "";
    }

    if (!orderNumber || !email) {
      return null;
    }
    const normNumber = orderNumber.trim().toLowerCase();
    const normEmail = email.trim().toLowerCase();
    const found = mockOrders.find((o) => {
      const matchNumber =
        o.orderNumber.toLowerCase() === normNumber ||
        o.id.toLowerCase() === normNumber;
      const matchEmail = o.email
        ? o.email.trim().toLowerCase() === normEmail
        : false;
      return matchNumber && matchEmail;
    });
    return found ? GuestOrderTrackingSchema.parse(found) : null;
  }

  async reorder(orderId: string): Promise<OrderLine[]> {
    const order = await this.getOrder(orderId);
    if (!order) {
      throw new Error(`Order not found: ${orderId}`);
    }
    if (order.lines && order.lines.length > 0) {
      return [...order.lines];
    }
    return order.items
      .filter((item) => Boolean(item.variantId))
      .map((item) => ({
        variantId: item.variantId!,
        quantity: item.quantity,
        image: item.image,
        title: item.title,
        price: item.price,
      }));
  }

  async getAddresses(): Promise<Address[]> {
    return [...mockAddresses];
  }

  async updateProfile(input: ProfileInput): Promise<CustomerProfile> {
    mockCustomer = CustomerProfileSchema.parse({
      ...mockCustomer,
      ...input,
    });
    return { ...mockCustomer };
  }

  async getPets(): Promise<Pet[]> {
    return [...mockPets];
  }

  async savePet(petInput: PetInput): Promise<Pet> {
    const petId =
      petInput.id || `pet_${Math.random().toString(36).substring(2, 9)}`;
    const newPet = PetSchema.parse({
      id: petId,
      name: petInput.name,
      species: petInput.species,
      breed: petInput.breed,
      birthDate: petInput.birthDate,
      weightLbs: petInput.weightLbs,
      activityLevel: petInput.activityLevel,
      concerns: petInput.concerns || [],
      photoUrl: petInput.photoUrl,
    });

    const existingIdx = mockPets.findIndex((p) => p.id === petId);
    if (existingIdx >= 0) {
      mockPets[existingIdx] = newPet;
    } else {
      mockPets.push(newPet);
    }

    return { ...newPet };
  }
}

export const mockAccountProvider = new MockAccountProvider();
