import { describe, it, expect, beforeEach } from "vitest";
import { MockCartProvider } from "@/lib/providers/mock/cart";
import { CartSchema } from "@/lib/contracts/cart";

describe("CartProvider Contract", () => {
  let cartProvider: MockCartProvider;

  beforeEach(async () => {
    cartProvider = new MockCartProvider();
    await cartProvider.create();
  });

  it("satisfies CartSchema on empty cart (edge case: carrinho vazio)", async () => {
    const cart = await cartProvider.get();
    expect(cart).not.toBeNull();
    expect(() => CartSchema.parse(cart)).not.toThrow();
    expect(cart?.lines).toEqual([]);
    expect(cart?.totalQuantity).toBe(0);
    expect(cart?.subtotalPrice.amount).toBe(0);
    expect(cart?.totalDiscount.amount).toBe(0);
    expect(cart?.totalPrice.amount).toBe(0);
    expect(cart?.checkoutUrl).toContain("checkout.nadeon.com");
  });

  it("adds lines to cart and calculates subtotal correctly", async () => {
    const updated = await cartProvider.addLines([
      { variantId: "var_biohack_1", quantity: 2 },
    ]);

    expect(() => CartSchema.parse(updated)).not.toThrow();
    expect(updated.lines.length).toBe(1);
    expect(updated.lines[0].variantId).toBe("var_biohack_1");
    expect(updated.lines[0].quantity).toBe(2);
    expect(updated.lines[0].price.amount).toBe(65);
    expect(updated.lines[0].total.amount).toBe(130);
    expect(updated.totalQuantity).toBe(2);
    expect(updated.totalPrice.amount).toBe(130);
  });

  it("applies 15% discount when adding lines with sellingPlanId", async () => {
    const updated = await cartProvider.addLines([
      {
        variantId: "var_biohack_1",
        quantity: 1,
        sellingPlanId: "plan_biohack_30d",
      },
    ]);

    expect(updated.lines.length).toBe(1);
    expect(updated.lines[0].sellingPlanId).toBe("plan_biohack_30d");
    // $65 * 0.85 = $55.25
    expect(updated.lines[0].price.amount).toBe(55.25);
    expect(updated.totalPrice.amount).toBe(55.25);
  });

  it("updates line quantities and removes line when quantity is 0", async () => {
    const cart = await cartProvider.addLines([
      { variantId: "var_biohack_1", quantity: 1 },
      { variantId: "var_mgy_1", quantity: 2 },
    ]);

    const line1Id = cart.lines[0].id;
    const line2Id = cart.lines[1].id;

    const modified = await cartProvider.updateLines([
      { id: line1Id, quantity: 3 },
      { id: line2Id, quantity: 0 },
    ]);

    expect(modified.lines.length).toBe(1);
    expect(modified.lines[0].id).toBe(line1Id);
    expect(modified.lines[0].quantity).toBe(3);
  });

  it("removes lines via removeLines", async () => {
    const cart = await cartProvider.addLines([
      { variantId: "var_biohack_1", quantity: 1 },
      { variantId: "var_mgy_1", quantity: 1 },
    ]);

    const lineIdToRemove = cart.lines[0].id;
    const afterRemoval = await cartProvider.removeLines([lineIdToRemove]);

    expect(afterRemoval.lines.length).toBe(1);
    expect(afterRemoval.lines[0].id).not.toBe(lineIdToRemove);
  });

  it("throws error on invalid discount code (edge case: cupom inválido)", async () => {
    await cartProvider.addLines([{ variantId: "var_biohack_1", quantity: 1 }]);

    await expect(
      cartProvider.applyDiscount("INVALID_COUPON_CODE")
    ).rejects.toThrow(/Invalid discount code/);
  });

  it("applies valid discount coupon and reduces total", async () => {
    await cartProvider.addLines([{ variantId: "var_biohack_1", quantity: 2 }]); // $130

    const discountedCart = await cartProvider.applyDiscount("WELCOME10");
    expect(() => CartSchema.parse(discountedCart)).not.toThrow();
    expect(discountedCart.discountCodes.length).toBe(1);
    expect(discountedCart.discountCodes[0].applicable).toBe(true);
    // 10% of $130 is $13.00
    expect(discountedCart.totalDiscount.amount).toBe(13);
    expect(discountedCart.totalPrice.amount).toBe(117);
  });

  it("changes selling plan on an existing line item", async () => {
    const initial = await cartProvider.addLines([
      { variantId: "var_biohack_1", quantity: 1 },
    ]);
    const lineId = initial.lines[0].id;

    // Switch to subscription plan
    const updated = await cartProvider.setLineSellingPlan(
      lineId,
      "plan_biohack_30d"
    );
    expect(updated.lines[0].sellingPlanId).toBe("plan_biohack_30d");
    expect(updated.lines[0].price.amount).toBe(55.25);

    // Switch back to one-time
    const backToOneTime = await cartProvider.setLineSellingPlan(lineId, null);
    expect(backToOneTime.lines[0].sellingPlanId).toBeNull();
    expect(backToOneTime.lines[0].price.amount).toBe(65);
  });

  it("returns checkoutUrl", async () => {
    const url = await cartProvider.checkoutUrl();
    expect(url).toMatch(/^https:\/\/checkout\.nadeon\.com\/mock\/cart_/);
  });
});
