// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, within, cleanup } from "@testing-library/react";
import { TrustStrip, getTrustItems } from "@/components/brand/trust-strip";
import { DEFAULT_MARKET, getMarket } from "@/lib/market";
import TrustStripSection from "@/app/(shared)/dev/kit/sections/W1-07";

describe("W1-07: TrustStrip Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders a semantic section with default accessible name and semantic list", () => {
    render(<TrustStrip line="human" />);

    const section = screen.getByRole("region", { name: "Trust highlights" });
    expect(section).toBeTruthy();
    expect(section.tagName.toLowerCase()).toBe("section");

    const list = within(section).getByRole("list");
    expect(list).toBeTruthy();
    expect(list.tagName.toLowerCase()).toBe("ul");

    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(4);
  });

  it("renders Human variant with $75 free shipping threshold and exact catalog copy", () => {
    render(<TrustStrip line="human" />);

    expect(screen.getByText("Made in Clifton, NJ")).toBeTruthy();
    expect(screen.getByText("Our own lab")).toBeTruthy();

    expect(screen.getByText("Tested every lot")).toBeTruthy();
    expect(screen.getByText("Public lab reports")).toBeTruthy();

    expect(screen.getByText("Free shipping")).toBeTruthy();
    expect(screen.getByText("Over $75")).toBeTruthy();

    expect(screen.getByText("60-day guarantee")).toBeTruthy();
    expect(screen.getByText("Love it or refund")).toBeTruthy();
  });

  it("renders Pet variant with $49 free shipping threshold and exact catalog copy", () => {
    render(<TrustStrip line="pet" />);

    expect(screen.getByText("Made in Clifton, NJ")).toBeTruthy();
    expect(screen.getByText("Our own lab")).toBeTruthy();

    expect(screen.getByText("Tested every lot")).toBeTruthy();
    expect(screen.getByText("Public lab reports")).toBeTruthy();

    expect(screen.getByText("Free shipping")).toBeTruthy();
    expect(screen.getByText("Over $49")).toBeTruthy();

    expect(screen.getByText("60-day guarantee")).toBeTruthy();
    expect(screen.getByText("Love it or refund")).toBeTruthy();
  });

  it("proves component is purely informative with zero interactive buttons or inputs (So informativo)", () => {
    render(<TrustStrip line="human" />);

    // Verifies no button elements exist
    const buttons = screen.queryAllByRole("button");
    expect(buttons).toHaveLength(0);

    // Verifies no link elements exist
    const links = screen.queryAllByRole("link");
    expect(links).toHaveLength(0);

    // Verifies no input or textbox elements exist
    const textboxes = screen.queryAllByRole("textbox");
    expect(textboxes).toHaveLength(0);

    // Verifies no combobox or select elements exist
    const comboboxes = screen.queryAllByRole("combobox");
    expect(comboboxes).toHaveLength(0);
  });

  it("ensures decorative icon containers are hidden from assistive technology with aria-hidden", () => {
    const { container } = render(<TrustStrip line="human" />);

    const iconContainers = container.querySelectorAll(
      'div[aria-hidden="true"]'
    );
    expect(iconContainers).toHaveLength(4);

    iconContainers.forEach((iconDiv) => {
      expect(iconDiv.getAttribute("aria-hidden")).toBe("true");
      expect(iconDiv.querySelector("svg")).not.toBeNull();
    });
  });

  it("renders custom trust items when provided via props", () => {
    const customItems = [
      {
        id: "custom-1",
        title: "Same-Day Dispatch",
        description: "Orders before 2 PM EST",
      },
      {
        id: "custom-2",
        title: "Cold-Chain Stored",
        description: "Preserved potency",
      },
    ];

    render(<TrustStrip items={customItems} aria-label="Custom features" />);

    const section = screen.getByRole("region", { name: "Custom features" });
    expect(section).toBeTruthy();

    const items = within(section).getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(screen.getByText("Same-Day Dispatch")).toBeTruthy();
    expect(screen.getByText("Orders before 2 PM EST")).toBeTruthy();
    expect(screen.getByText("Cold-Chain Stored")).toBeTruthy();
    expect(screen.getByText("Preserved potency")).toBeTruthy();
  });

  it("builds Human and Pet items from the market threshold ($75 / $49 in the US)", () => {
    const human = getTrustItems("human", DEFAULT_MARKET);
    const pet = getTrustItems("pet", DEFAULT_MARKET);

    expect(human).toHaveLength(4);
    expect(pet).toHaveLength(4);
    expect(human[2].description).toBe("Over $75");
    expect(pet[2].description).toBe("Over $49");
  });

  it("drops the free shipping item in a market that advertises none", () => {
    const gb = getMarket("gb");
    expect(gb).toBeDefined();
    const items = getTrustItems("human", gb!);

    expect(items).toHaveLength(3);
    expect(items.some((item) => item.title === "Free shipping")).toBe(false);
  });
});

describe("W1-07: DevKit Section (TrustStripSection)", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the devkit vitrine section with Human and Pet showcases", () => {
    render(<TrustStripSection />);

    const vitrineSection = screen.getByRole("region", {
      name: /Trust Strip \(Faixa de Confianca\)/i,
    });
    expect(vitrineSection).toBeTruthy();

    expect(screen.getByText("Human Storefront Variant")).toBeTruthy();
    expect(screen.getByText("Pet Storefront Variant")).toBeTruthy();

    // Verify both shipping copy are rendered within the vitrine
    expect(screen.getByText("Over $75")).toBeTruthy();
    expect(screen.getByText("Over $49")).toBeTruthy();
  });
});
