// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, within, cleanup } from "@testing-library/react";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { TrustStrip } from "@/components/brand/trust-strip";
import { MarketProvider } from "@/lib/market/context";
import FreeShippingSection from "@/app/(shared)/dev/kit/sections/W1-26";

describe("W1-26: announcement bar uses the market free shipping threshold", () => {
  afterEach(() => {
    cleanup();
  });

  it("Human bar links the threshold, subscription and quiz as semantic links", () => {
    render(<AnnouncementBar line="human" />);

    const nav = screen.getByRole("navigation", {
      name: /announcement notices/i,
    });
    expect(
      within(nav)
        .getByRole("link", { name: /free shipping over \$75/i })
        .getAttribute("href")
    ).toBe("/faq");
    expect(
      within(nav).getByRole("link", { name: /subscribe & save 15%/i })
    ).toBeTruthy();
    expect(
      within(nav)
        .getByRole("link", { name: "TAKE THE QUIZ" })
        .getAttribute("href")
    ).toBe("/human/quiz");
  });

  it("Pet bar uses the Pet threshold ($49) and the Pet quiz", () => {
    render(<AnnouncementBar line="pet" />);

    const nav = screen.getByRole("navigation", {
      name: /announcement notices/i,
    });
    expect(
      within(nav).getByRole("link", { name: /free shipping over \$49/i })
    ).toBeTruthy();
    expect(
      within(nav)
        .getByRole("link", { name: "FIND THE RIGHT FORMULA" })
        .getAttribute("href")
    ).toBe("/pet/quiz");
  });

  it("hides the shipping link in a market without free shipping, keeping the others", () => {
    render(
      <MarketProvider initialMarket="gb">
        <AnnouncementBar line="human" />
      </MarketProvider>
    );

    const nav = screen.getByRole("navigation", {
      name: /announcement notices/i,
    });
    expect(
      within(nav).queryByRole("link", { name: /free shipping/i })
    ).toBeNull();
    expect(within(nav).queryByText(/free shipping/i)).toBeNull();
    expect(
      within(nav).getByRole("link", { name: /subscribe & save 15%/i })
    ).toBeTruthy();
    expect(
      within(nav).getByRole("link", { name: "TAKE THE QUIZ" })
    ).toBeTruthy();
  });
});

describe("W1-26: trust strip uses the market free shipping threshold", () => {
  afterEach(() => {
    cleanup();
  });

  it("shows Over $75 for Human and Over $49 for Pet in the US", () => {
    const { unmount } = render(<TrustStrip line="human" />);
    expect(screen.getByText("Over $75")).toBeTruthy();
    unmount();

    render(<TrustStrip line="pet" />);
    expect(screen.getByText("Over $49")).toBeTruthy();
  });

  it("drops the Free shipping item in a market without free shipping", () => {
    render(
      <MarketProvider initialMarket="gb">
        <TrustStrip line="human" />
      </MarketProvider>
    );

    const list = screen.getByRole("list");
    expect(within(list).getAllByRole("listitem")).toHaveLength(3);
    expect(screen.queryByText("Free shipping")).toBeNull();
    expect(screen.getByText("60-day guarantee")).toBeTruthy();
  });
});

describe("W1-26: DevKit vitrine section", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the Human and Pet variants and the threshold by market", () => {
    render(<FreeShippingSection />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /free shipping threshold/i,
      })
    ).toBeTruthy();
    expect(screen.getByText("Human storefront variant")).toBeTruthy();
    expect(screen.getByText("Pet storefront variant")).toBeTruthy();
    expect(
      screen.getByRole("link", { name: /free shipping over \$75/i })
    ).toBeTruthy();
    expect(
      screen.getByRole("link", { name: /free shipping over \$49/i })
    ).toBeTruthy();
    expect(screen.getByText("Threshold by market")).toBeTruthy();
    expect(screen.getAllByText(/no free shipping/i).length).toBeGreaterThan(0);
  });
});
