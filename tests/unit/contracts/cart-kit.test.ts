import { describe, it, expect, beforeEach } from "vitest";
import { MockCartProvider } from "@/lib/providers/mock/cart";
import { CartSchema } from "@/lib/contracts/cart";
import { LiveCartProvider } from "@/lib/providers/live";

// Energy Duo = BioHack ($59) + Renew ($65), kit price $105 (compare-at $124).
const ENERGY_DUO_PRICE = 105;
const ENERGY_DUO_SUBSCRIPTION = 89.25; // 105 * 0.85, plan_biohack_30d

describe("CartProvider addKit contract", () => {
  let cartProvider: MockCartProvider;

  beforeEach(async () => {
    cartProvider = new MockCartProvider();
    await cartProvider.create();
  });

  it("charges the kit price, not the sum of the single formulas", async () => {
    const cart = await cartProvider.addKit("energy-duo", 1);

    expect(() => CartSchema.parse(cart)).not.toThrow();
    expect(cart.lines).toHaveLength(1);
    const [line] = cart.lines;
    expect(line.price.amount).toBe(ENERGY_DUO_PRICE);
    expect(line.total.amount).toBe(ENERGY_DUO_PRICE);
    expect(cart.totalPrice.amount).toBe(ENERGY_DUO_PRICE);
    expect(cart.subtotalPrice.amount).not.toBe(124);
  });

  it("creates a kit line with the included items", async () => {
    const cart = await cartProvider.addKit("energy-duo", 1);
    const [line] = cart.lines;

    expect(line.product.title).toBe("Energy Duo");
    expect(line.kit).toEqual({
      slug: "energy-duo",
      name: "Energy Duo",
      items: [
        { title: "BioHack", quantity: 1 },
        { title: "Renew", quantity: 1 },
      ],
    });
  });

  it("multiplies the kit price by quantity", async () => {
    const cart = await cartProvider.addKit("energy-duo", 2);

    expect(cart.lines[0].quantity).toBe(2);
    expect(cart.lines[0].total.amount).toBe(210);
    expect(cart.totalQuantity).toBe(2);
    expect(cart.totalPrice.amount).toBe(210);
  });

  it("merges repeated adds of the same kit into one line", async () => {
    await cartProvider.addKit("energy-duo", 1);
    const cart = await cartProvider.addKit("energy-duo", 2);

    expect(cart.lines).toHaveLength(1);
    expect(cart.lines[0].quantity).toBe(3);
    expect(cart.lines[0].total.amount).toBe(315);
  });

  it("keeps the kit price when quantity changes via updateLines", async () => {
    const cart = await cartProvider.addKit("energy-duo", 1);
    const updated = await cartProvider.updateLines([
      { id: cart.lines[0].id, quantity: 3 },
    ]);

    expect(updated.lines[0].price.amount).toBe(ENERGY_DUO_PRICE);
    expect(updated.lines[0].total.amount).toBe(315);
  });

  it("removes a kit line via removeLines", async () => {
    const cart = await cartProvider.addKit("energy-duo", 1);
    const afterRemoval = await cartProvider.removeLines([cart.lines[0].id]);

    expect(afterRemoval.lines).toHaveLength(0);
    expect(afterRemoval.totalPrice.amount).toBe(0);
  });

  it("removes a kit line when quantity is set to 0", async () => {
    const cart = await cartProvider.addKit("energy-duo", 1);
    const updated = await cartProvider.updateLines([
      { id: cart.lines[0].id, quantity: 0 },
    ]);

    expect(updated.lines).toHaveLength(0);
  });

  it("applies the plan discount to the kit price when sellingPlanId is given", async () => {
    const cart = await cartProvider.addKit("energy-duo", 1, "plan_biohack_30d");

    expect(cart.lines[0].sellingPlanId).toBe("plan_biohack_30d");
    expect(cart.lines[0].sellingPlanTitle).toBeTruthy();
    expect(cart.lines[0].price.amount).toBe(ENERGY_DUO_SUBSCRIPTION);
    expect(cart.totalPrice.amount).toBe(ENERGY_DUO_SUBSCRIPTION);
  });

  it("switches a kit line between subscription and one-time with the kit price", async () => {
    const initial = await cartProvider.addKit("energy-duo", 1);
    const lineId = initial.lines[0].id;

    const subscribed = await cartProvider.setLineSellingPlan(
      lineId,
      "plan_biohack_30d"
    );
    expect(subscribed.lines[0].price.amount).toBe(ENERGY_DUO_SUBSCRIPTION);

    const oneTime = await cartProvider.setLineSellingPlan(lineId, null);
    expect(oneTime.lines[0].sellingPlanId).toBeNull();
    expect(oneTime.lines[0].sellingPlanTitle).toBeUndefined();
    expect(oneTime.lines[0].price.amount).toBe(ENERGY_DUO_PRICE);
  });

  it("does not merge a one-time kit line with a subscription kit line", async () => {
    await cartProvider.addKit("energy-duo", 1);
    const cart = await cartProvider.addKit("energy-duo", 1, "plan_biohack_30d");

    expect(cart.lines).toHaveLength(2);
  });

  it("rejects a selling plan that the kit's products do not offer", async () => {
    await expect(
      cartProvider.addKit("energy-duo", 1, "plan_unknown_30d")
    ).rejects.toThrow(/Selling plan not available/);
  });

  it("rejects an unknown kit slug", async () => {
    await expect(cartProvider.addKit("no-such-kit", 1)).rejects.toThrow(
      /Kit not found/
    );
  });

  it("rejects a non-positive or fractional quantity", async () => {
    await expect(cartProvider.addKit("energy-duo", 0)).rejects.toThrow(
      /Invalid kit quantity/
    );
    await expect(cartProvider.addKit("energy-duo", 1.5)).rejects.toThrow(
      /Invalid kit quantity/
    );
  });

  it("live provider stub reports not implemented for addKit", async () => {
    const live = new LiveCartProvider();
    await expect(live.addKit("energy-duo", 1)).rejects.toThrow(
      /not implemented: onda 4/
    );
  });
});
