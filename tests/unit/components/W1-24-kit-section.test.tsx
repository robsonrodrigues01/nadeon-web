// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import {
  render,
  screen,
  cleanup,
  within,
  waitFor,
} from "@testing-library/react";
import W124Section from "@/app/(shared)/dev/kit/sections/W1-24";
import { cartProvider } from "@/lib/providers/client";
import { formatMoneyWithMarket } from "@/lib/market/formatter";
import { DEFAULT_MARKET } from "@/lib/market/markets";

// Valores esperados vêm do carrinho (catálogo), não de números fixos.
async function loadLines() {
  const cart = await cartProvider.get();
  const lines = cart?.lines ?? [];
  const human = lines.find((l) => l.kit?.slug === "energy-duo");
  const pet = lines.find((l) => l.kit?.slug === "chew-oil");
  return { human, pet };
}

describe("Cart kit line vitrine (W1-24)", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the section with a labelled landmark", async () => {
    render(<W124Section />);

    const section = screen.getByRole("region", {
      name: "Kit line in cart drawer (Human & Pet)",
    });
    expect(section.tagName).toBe("SECTION");
    await waitFor(() =>
      expect(
        screen.getByRole("list", { name: "Human kit cart lines" }).children
      ).toHaveLength(1)
    );
  });

  it("shows the Human kit at the kit price with its included items", async () => {
    render(<W124Section />);
    const list = await screen.findByRole("list", {
      name: "Human kit cart lines",
    });
    await screen.findByRole("heading", { name: "Energy Duo" });
    const { human } = await loadLines();
    expect(human).toBeDefined();

    const scope = within(list);
    expect(scope.getByRole("heading", { name: "Energy Duo" })).toBeTruthy();
    expect(
      scope.getByText(formatMoneyWithMarket(human!.total, DEFAULT_MARKET))
    ).toBeTruthy();
    expect(
      scope.getByRole("list", { name: "Items in Energy Duo" })
    ).toBeTruthy();
    for (const item of human!.kit!.items) {
      expect(scope.getByText(`${item.quantity}× ${item.title}`)).toBeTruthy();
    }
  });

  it("shows the Pet kit subscription price with the original price struck through", async () => {
    render(<W124Section />);
    const list = await screen.findByRole("list", {
      name: "Pet kit cart lines",
    });
    await screen.findByRole("heading", { name: "Chew + Oil" });
    const { pet } = await loadLines();
    expect(pet?.sellingPlanId).toBe("plan_more_good_years_30d");

    const scope = within(list);
    expect(scope.getByRole("heading", { name: "Chew + Oil" })).toBeTruthy();
    expect(
      scope.getByText(formatMoneyWithMarket(pet!.total, DEFAULT_MARKET))
    ).toBeTruthy();
    expect(
      scope.getByText(
        formatMoneyWithMarket(pet!.compareAtPrice!, DEFAULT_MARKET)
      )
    ).toBeTruthy();
    expect(scope.getByText("Subscribe & save 15%")).toBeTruthy();
  });

  it("exposes quantity and remove controls as buttons with accessible names", async () => {
    render(<W124Section />);

    expect(
      await screen.findByRole("button", {
        name: "Increase quantity of Energy Duo",
      })
    ).toBeTruthy();
    expect(
      screen.getByRole("button", {
        name: "Decrease quantity of Energy Duo",
      })
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Remove Energy Duo from cart" })
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Remove Chew + Oil from cart" })
    ).toBeTruthy();
  });

  it("hides the plan switch on kit lines, since kits have no selling plans yet", async () => {
    render(<W124Section />);
    await screen.findByRole("button", {
      name: "Remove Energy Duo from cart",
    });

    expect(
      screen.queryByRole("button", {
        name: "Switch Energy Duo to subscription and save 15%",
      })
    ).toBeNull();
    expect(
      screen.queryByRole("button", {
        name: "Change subscription frequency for Chew + Oil",
      })
    ).toBeNull();
  });
});
