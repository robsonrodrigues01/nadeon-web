import {
  WholesaleApplicationInputSchema,
  type WholesaleProvider,
} from "@/lib/contracts/wholesale";

export class MockWholesaleProvider implements WholesaleProvider {
  async submit(input: unknown) {
    WholesaleApplicationInputSchema.parse(input);
    return { id: `wholesale_TEST_${Math.random().toString(36).slice(2, 9)}` };
  }
}

export const mockWholesaleProvider = new MockWholesaleProvider();
