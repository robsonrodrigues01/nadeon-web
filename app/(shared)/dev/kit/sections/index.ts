import type React from "react";
import { FoundationSection } from "./foundation";
import SW1_12 from "./W1-12";
import SW1_06 from "./W1-06";
import SW1_03 from "./W1-03";

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
  { id: "W1-03", title: "Header", Component: SW1_03 },
  { id: "W1-06", title: "Newsletter", Component: SW1_06 },
  { id: "W1-12", title: "Product card", Component: SW1_12 },
];

export default sections;
