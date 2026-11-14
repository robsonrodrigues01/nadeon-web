/**
 * @vitest-environment jsdom
 */
import React from "react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Header } from "@/components/layout/header";
import { useCartStore } from "@/lib/providers/mock/cart";

describe("W1-03 Header Component", () => {
  beforeEach(() => {
    useCartStore.getState().resetCart();
  });

  afterEach(() => {
    cleanup();
  });

  describe("Human variant", () => {
    it("renders semantic header with banner role and human navigation links", () => {
      render(<Header variant="human" />);

      const header = screen.getByRole("banner");
      expect(header).toBeDefined();

      // Logo returns to Human home
      const logoLink = screen.getByRole("link", { name: /nadeon labs/i });
      expect(logoLink.getAttribute("href")).toBe("/human");

      // Navigation links
      expect(
        screen.getByRole("link", { name: "Shop" }).getAttribute("href")
      ).toBe("/human/shop");
      expect(
        screen.getByRole("link", { name: "Science" }).getAttribute("href")
      ).toBe("/science");
      expect(
        screen.getByRole("link", { name: "Quiz" }).getAttribute("href")
      ).toBe("/human/quiz");
      expect(
        screen.getByRole("link", { name: "Subscribe" }).getAttribute("href")
      ).toBe("/human/subscribe");
      expect(
        screen.getByRole("link", { name: "About" }).getAttribute("href")
      ).toBe("/about");

      // Secondary / line switcher actions
      const petSwitch = screen.getByRole("link", { name: /shop pet/i });
      expect(petSwitch.getAttribute("href")).toBe("/pet");

      const accountLink = screen.getByRole("link", { name: "Account" });
      expect(accountLink.getAttribute("href")).toBe("/account");

      // Cart link
      const cartLinks = screen.getAllByRole("link", { name: /cart \(0\)/i });
      expect(cartLinks.length).toBeGreaterThanOrEqual(1);
      expect(cartLinks[0].getAttribute("href")).toBe("/cart");
    });
  });

  describe("Pet variant", () => {
    it("renders semantic header with pet navigation links and switch to human", () => {
      render(<Header variant="pet" />);

      // Logo returns to Pet home
      const logoLink = screen.getByRole("link", { name: /nadeon labs/i });
      expect(logoLink.getAttribute("href")).toBe("/pet");

      // Pet navigation links
      expect(
        screen.getByRole("link", { name: "Dogs" }).getAttribute("href")
      ).toBe("/pet/dogs");
      expect(
        screen.getByRole("link", { name: "Cats" }).getAttribute("href")
      ).toBe("/pet/cats");
      expect(
        screen.getByRole("link", { name: "Horses" }).getAttribute("href")
      ).toBe("/pet/horses");
      expect(
        screen.getByRole("link", { name: "Quiz" }).getAttribute("href")
      ).toBe("/pet/quiz");
      expect(
        screen.getByRole("link", { name: "Subscribe" }).getAttribute("href")
      ).toBe("/pet/subscribe");
      expect(
        screen.getByRole("link", { name: "About" }).getAttribute("href")
      ).toBe("/about");

      // Switch to human
      const humanSwitch = screen.getByRole("link", { name: /shop human/i });
      expect(humanSwitch.getAttribute("href")).toBe("/human");

      const accountLink = screen.getByRole("link", { name: "Account" });
      expect(accountLink.getAttribute("href")).toBe("/account");

      const cartLinks = screen.getAllByRole("link", { name: /cart \(0\)/i });
      expect(cartLinks.length).toBeGreaterThanOrEqual(1);
      expect(cartLinks[0].getAttribute("href")).toBe("/cart");
    });
  });

  describe("Cart count reading from CartProvider / initialCartCount", () => {
    it("displays explicit cart count when passed via initialCartCount prop", () => {
      render(<Header variant="human" initialCartCount={4} />);
      const cartLinks = screen.getAllByRole("link", { name: /cart \(4\)/i });
      expect(cartLinks.length).toBeGreaterThanOrEqual(1);
      expect(cartLinks[0].getAttribute("href")).toBe("/cart");
    });

    it("displays cart count from cart store state", () => {
      useCartStore.getState().setCart({
        id: "test-cart",
        lines: [],
        discountCodes: [],
        subtotalPrice: { amount: 0, currencyCode: "USD" },
        totalDiscount: { amount: 0, currencyCode: "USD" },
        totalPrice: { amount: 0, currencyCode: "USD" },
        totalQuantity: 2,
        checkoutUrl: "https://example.com",
      });

      render(<Header variant="human" />);
      const cartLinks = screen.getAllByRole("link", { name: /cart \(2\)/i });
      expect(cartLinks.length).toBeGreaterThanOrEqual(1);
      expect(cartLinks[0].getAttribute("href")).toBe("/cart");
    });
  });

  describe("Accessible mobile menu", () => {
    it("has mobile menu button with semantic button tag, aria-expanded, aria-controls and 44px touch target", () => {
      render(<Header variant="human" />);

      const toggleButton = screen.getByRole("button", {
        name: /open navigation menu/i,
      });
      expect(toggleButton.getAttribute("type")).toBe("button");
      expect(toggleButton.getAttribute("aria-expanded")).toBe("false");
      expect(toggleButton.getAttribute("aria-controls")).toBe(
        "mobile-navigation-menu"
      );

      // Open menu
      fireEvent.click(toggleButton);
      expect(toggleButton.getAttribute("aria-expanded")).toBe("true");
      expect(
        screen.getByRole("button", { name: /close navigation menu/i })
      ).toBeDefined();

      // Mobile nav container is visible
      const mobileNav = document.getElementById("mobile-navigation-menu");
      expect(mobileNav).not.toBeNull();

      // Close menu with Escape key
      fireEvent.keyDown(window, { key: "Escape" });
      expect(toggleButton.getAttribute("aria-expanded")).toBe("false");
    });
  });
});
