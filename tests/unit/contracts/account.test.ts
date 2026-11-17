import { describe, it, expect } from "vitest";
import { mockAccountProvider } from "@/lib/providers/mock/account";
import {
  CustomerProfileSchema,
  OrderSchema,
  AddressSchema,
  PetSchema,
  SessionSchema,
} from "@/lib/contracts/account";

describe("AccountProvider Contract", () => {
  it("getSession returns valid session or null", async () => {
    const session = await mockAccountProvider.getSession();
    if (session) {
      expect(() => SessionSchema.parse(session)).not.toThrow();
      expect(session.customerId).toBe("cust_alex_example");
    }
  });

  it("signInUrl returns valid login redirection URL", async () => {
    const url = await mockAccountProvider.signInUrl("/account/orders");
    expect(url).toContain("/account/login?returnTo=");
    expect(url).toContain("%2Faccount%2Forders");
  });

  it("getCustomer returns realistic Alex (example) profile satisfying schema", async () => {
    const customer = await mockAccountProvider.getCustomer();
    expect(customer).not.toBeNull();
    expect(() => CustomerProfileSchema.parse(customer)).not.toThrow();
    expect(customer?.firstName).toBe("Alex");
    expect(customer?.lastName).toBe("Morgan");
    expect(customer?.email).toBe("alex.morgan@example.com");
    expect(customer?.profileType).toBe("Both");
  });

  it("updateProfile updates customer profile fields", async () => {
    const updated = await mockAccountProvider.updateProfile({
      firstName: "Alexander",
      phone: "+1 (555) 999-0000",
    });

    expect(() => CustomerProfileSchema.parse(updated)).not.toThrow();
    expect(updated.firstName).toBe("Alexander");
    expect(updated.phone).toBe("+1 (555) 999-0000");

    // reset back
    await mockAccountProvider.updateProfile({
      firstName: "Alex",
      phone: "+1 (555) 234-5678",
    });
  });

  it("getOrders returns realistic orders satisfying OrderSchema", async () => {
    const orders = await mockAccountProvider.getOrders();
    expect(orders.length).toBeGreaterThan(0);

    for (const order of orders) {
      expect(() => OrderSchema.parse(order)).not.toThrow();
      expect(order.orderNumber).toMatch(/^(TEST-)?NL-\d+$/);
      expect(order.items.length).toBeGreaterThan(0);
      expect(order.total).toHaveProperty("amount");
      expect(order.total).toHaveProperty("currencyCode");
    }
  });

  it("getOrder returns order by id or orderNumber", async () => {
    const order = await mockAccountProvider.getOrder("TEST-NL-0001");
    expect(order).not.toBeNull();
    expect(order?.orderNumber).toBe("TEST-NL-0001");
    expect(order?.trackingUrl).toContain("ups.com");

    const nonExistent = await mockAccountProvider.getOrder("TEST-NL-0000");
    expect(nonExistent).toBeNull();
  });

  it("getAddresses returns valid addresses satisfying AddressSchema", async () => {
    const addresses = await mockAccountProvider.getAddresses();
    expect(addresses.length).toBeGreaterThan(0);

    for (const addr of addresses) {
      expect(() => AddressSchema.parse(addr)).not.toThrow();
      expect(addr.address1).toBeTruthy();
      expect(addr.city).toBeTruthy();
      expect(addr.country).toBe("US");
    }
  });

  it("getPets returns customer pets and savePet creates/updates pet", async () => {
    const pets = await mockAccountProvider.getPets();
    expect(pets.length).toBeGreaterThan(0);

    for (const pet of pets) {
      expect(() => PetSchema.parse(pet)).not.toThrow();
      expect(pet.name).toBe("Cooper");
      expect(pet.species).toBe("dog");
    }

    // Save a new pet
    const newPet = await mockAccountProvider.savePet({
      name: "Luna",
      species: "cat",
      breed: "Siamese",
      weightLbs: 9,
      activityLevel: "high",
      concerns: ["Coat shine"],
    });

    expect(() => PetSchema.parse(newPet)).not.toThrow();
    expect(newPet.name).toBe("Luna");
    expect(newPet.species).toBe("cat");

    const petsAfterAdd = await mockAccountProvider.getPets();
    expect(petsAfterAdd.some((p) => p.name === "Luna")).toBe(true);
  });

  it("removes a pet profile by id", async () => {
    const pet = await mockAccountProvider.savePet({
      id: "pet_TEST_remove",
      name: "TEST Pet",
      species: "dog",
      breed: "Mixed",
    });

    await mockAccountProvider.removePet(pet.id);

    expect(
      (await mockAccountProvider.getPets()).some((item) => item.id === pet.id)
    ).toBe(false);
  });
});
