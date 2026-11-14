// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import W124Section from "@/app/(shared)/dev/kit/sections/W1-24";

describe("Cart kit line vitrine (W1-24)", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the section with a labelled landmark", () => {
    render(<W124Section />);

    const section = screen.getByRole("region", {
      name: "Kit line in cart drawer (Human & Pet)",
    });
    expect(section.tagName).toBe("SECTION");
  });

  it("shows the Human kit at the kit price with its included items", () => {
    render(<W124Section />);

    const list = screen.getByRole("list", { name: "Human kit cart lines" });
    const scope = within(list);
    expect(scope.getByRole("heading", { name: "Energy Duo" })).toBeTruthy();
    expect(scope.getByText("$105.00")).toBeTruthy();
    expect(
      scope.getByRole("list", { name: "Items in Energy Duo" })
    ).toBeTruthy();
    expect(scope.getByText("1× BioHack")).toBeTruthy();
    expect(scope.getByText("1× Renew")).toBeTruthy();
  });

  it("shows the Pet kit subscription price with the original price struck through", () => {
    render(<W124Section />);

    const list = screen.getByRole("list", { name: "Pet kit cart lines" });
    const scope = within(list);
    expect(scope.getByRole("heading", { name: "Chew + Oil" })).toBeTruthy();
    expect(scope.getByText("$63.75")).toBeTruthy();
    expect(scope.getByText("$75.00")).toBeTruthy();
    expect(scope.getByText("Subscribe & save 15%")).toBeTruthy();
  });

  it("exposes quantity and remove controls as buttons with accessible names", () => {
    render(<W124Section />);

    expect(
      screen.getByRole("button", {
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

  it("hides the plan switch on kit lines, since kits have no selling plans yet", () => {
    render(<W124Section />);

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
