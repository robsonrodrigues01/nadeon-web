import type React from "react";
import { FoundationSection } from "./foundation";

export type DevKitSectionComponent = (
  props?: Record<string, unknown>
) => React.ReactNode | Promise<React.ReactNode>;

export interface DevKitSection {
  id: string;
  title: string;
  description?: string;
  Component: DevKitSectionComponent;
}

export const sections: DevKitSection[] = [
  {
    id: "foundation",
    title: "Brand Foundation & Tokens",
    description:
      "Global brand tokens, product colors, typographic scale, and theme comparisons.",
    Component: FoundationSection,
  },
];

export default sections;
