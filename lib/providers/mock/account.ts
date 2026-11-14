import {
  type AccountProvider,
  type Address,
  type CustomerProfile,
  type Order,
  type Pet,
  type PetInput,
  type ProfileInput,
  type Session,
  CustomerProfileSchema,
  PetSchema,
  OrderSchema,
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
    id: "ord_100234",
    orderNumber: "NL-100234",
    createdAt: new Date(Date.now() - 86400 * 1000 * 5).toISOString(),
    financialStatus: "paid",
    fulfillmentStatus: "delivered",
    items: [
      {
        title: "BioHack - 2 Jars (60 days)",
        quantity: 1,
        price: { amount: 118, currencyCode: "USD" },
        image: "/images/products/biohack-front.webp",
        variantTitle: "2 Jars",
      },
    ],
    total: { amount: 118, currencyCode: "USD" },
    shippingAddress: mockAddresses[0],
    trackingNumber: "1Z9999999999999999",
    trackingUrl: "https://www.ups.com/track?tracknum=1Z9999999999999999",
  }),
  OrderSchema.parse({
    id: "ord_100189",
    orderNumber: "NL-100189",
    createdAt: new Date(Date.now() - 86400 * 1000 * 20).toISOString(),
    financialStatus: "paid",
    fulfillmentStatus: "in_transit",
    items: [
      {
        title: "More Good Years Soft Chews - 1 Jar",
        quantity: 1,
        price: { amount: 44, currencyCode: "USD" },
        image: "/images/products/more-good-years-front.webp",
        variantTitle: "1 Jar",
      },
    ],
    total: { amount: 44, currencyCode: "USD" },
    shippingAddress: mockAddresses[0],
    trackingNumber: "1Z8888888888888888",
    trackingUrl: "https://www.ups.com/track?tracknum=1Z8888888888888888",
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
    photoUrl: "/images/pets/cooper.webp",
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
