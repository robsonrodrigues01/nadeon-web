/**
 * Options shown on step 1 of the cancel flow, in the order of the design.
 * The provider receives the chosen label as the cancellation reason.
 */
export const CANCEL_REASONS = [
  "I have too much product",
  "It is too expensive",
  "I am not seeing the results I want",
  "I want a different formula",
  "I need to change my delivery schedule",
  "Other",
] as const;

export type CancelReason = (typeof CANCEL_REASONS)[number];
