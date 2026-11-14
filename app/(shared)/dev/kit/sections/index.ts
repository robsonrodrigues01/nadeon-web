import React from "react";
import { FoundationSection } from "./foundation";
import SW1_20 from "./W1-20";
import SW1_14 from "./W1-14";
import SW1_13 from "./W1-13";
import SW1_10 from "./W1-10";
import SW1_09 from "./W1-09";
import SW1_08 from "./W1-08";
import SW1_05 from "./W1-05";
import SW1_04 from "./W1-04";
import SW1_07 from "./W1-07";
import SW1_02 from "./W1-02";
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
  { id: "W1-02", title: "Announcement bar", Component: SW1_02 },
  { id: "W1-07", title: "Trust strip", Component: SW1_07 },
  { id: "W1-04", title: "Footer", Component: SW1_04 },
  { id: "W1-05", title: "Country selector", Component: SW1_05 },
  { id: "W1-08", title: "Cookie banner", Component: SW1_08 },
  {
    id: "W1-09",
    title: "First-visit popup",
    Component: () => React.createElement(SW1_09),
  },
  { id: "W1-10", title: "Analytics", Component: SW1_10 },
  { id: "W1-13", title: "Weight ]; dosing", Component: SW1_13 },
  { id: "W1-14", title: "Cart drawer", Component: SW1_14 },
  { id: "W1-20", title: "Shopify handles & renders", Component: SW1_20 },
];

export default sections;
