import { describe, it, expect } from "vitest";
import { cartProvider, useCartStore } from "@/lib/providers/client";

describe("lib/providers/client entry point", () => {
  it("exports cartProvider conforming to contract", async () => {
    expect(cartProvider).toBeDefined();
    expect(typeof cartProvider.get).toBe("function");
    expect(typeof cartProvider.create).toBe("function");
    expect(typeof cartProvider.addLines).toBe("function");
  });

  it("exports useCartStore conforming to zustand store", () => {
    expect(useCartStore).toBeDefined();
    expect(typeof useCartStore.getState).toBe("function");
    expect(typeof useCartStore.subscribe).toBe("function");
  });
});
