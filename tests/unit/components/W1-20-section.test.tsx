// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import W1_20Section from "@/app/(shared)/dev/kit/sections/W1-20";

describe("W1-20 Dev Kit Section - Shopify Handles & Renders", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders showcase section with ID and master title", async () => {
    const jsx = await W1_20Section();
    render(jsx);

    const section = screen.getByRole("region", {
      name: /shopify handles & label renders/i,
    });
    expect(section).toBeTruthy();
    expect(section.getAttribute("id")).toBe("w1-20-showcase");

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /shopify handles & label renders/i,
      })
    ).toBeTruthy();
  });

  it("renders both Human and Pet line theme variants", async () => {
    const jsx = await W1_20Section();
    render(jsx);

    const humanBlock = document.querySelector('[data-theme="human"]');
    const petBlock = document.querySelector('[data-theme="pet"]');

    expect(humanBlock).toBeTruthy();
    expect(petBlock).toBeTruthy();

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: /human longevity & cellular health/i,
      })
    ).toBeTruthy();

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: /pet longevity \(dogs, cats & horses\)/i,
      })
    ).toBeTruthy();
  });

  it("covers all semantic input fields, select menus, and action buttons in Human line", async () => {
    const jsx = await W1_20Section();
    render(jsx);

    // Search input with associated label
    const humanSearchInput = screen.getByLabelText(/search human handles/i);
    expect(humanSearchInput).toBeTruthy();
    expect(humanSearchInput.getAttribute("type")).toBe("search");
    expect(humanSearchInput.getAttribute("id")).toBe("human-search-input");

    // Format select with associated label
    const formatSelect = screen.getByLabelText(/filter by format/i);
    expect(formatSelect).toBeTruthy();
    expect(formatSelect.tagName.toLowerCase()).toBe("select");
    expect(formatSelect.getAttribute("id")).toBe("human-format-select");

    // Action buttons
    const exportBtn = screen.getByRole("button", {
      name: /export human handles/i,
    });
    expect(exportBtn).toBeTruthy();
    expect(exportBtn.getAttribute("type")).toBe("button");

    const copyBiohackBtn = screen.getByRole("button", {
      name: /copy handle for biohack/i,
    });
    expect(copyBiohackBtn).toBeTruthy();
    expect(copyBiohackBtn.getAttribute("type")).toBe("button");
  });

  it("covers all semantic input fields, select menus, and action buttons in Pet line", async () => {
    const jsx = await W1_20Section();
    render(jsx);

    // Search input with associated label
    const petSearchInput = screen.getByLabelText(/search pet handles/i);
    expect(petSearchInput).toBeTruthy();
    expect(petSearchInput.getAttribute("type")).toBe("search");
    expect(petSearchInput.getAttribute("id")).toBe("pet-search-input");

    // Species select with associated label
    const speciesSelect = screen.getByLabelText(/filter by species/i);
    expect(speciesSelect).toBeTruthy();
    expect(speciesSelect.tagName.toLowerCase()).toBe("select");
    expect(speciesSelect.getAttribute("id")).toBe("pet-species-select");

    // Action buttons
    const exportPetBtn = screen.getByRole("button", {
      name: /export pet handles/i,
    });
    expect(exportPetBtn).toBeTruthy();
    expect(exportPetBtn.getAttribute("type")).toBe("button");

    const copyMgyBtn = screen.getByRole("button", {
      name: /^copy handle for more good years$/i,
    });
    expect(copyMgyBtn).toBeTruthy();
    expect(copyMgyBtn.getAttribute("type")).toBe("button");
  });

  it("enforces AGENTS.md Rule 8 regulatory compliance notices", async () => {
    const jsx = await W1_20Section();
    render(jsx);

    // FDA claim disclaimer for Human line
    expect(
      screen.getByText(
        /\*These statements have not been evaluated by the Food and Drug Administration/i
      )
    ).toBeTruthy();

    // Animal use only & Equine disclaimer for Pet line
    expect(screen.getByText(/for animal use only\./i)).toBeTruthy();
    expect(
      screen.getByText(/equine products: not for horses intended for food\./i)
    ).toBeTruthy();
  });

  it("displays product images with next/image for existing renders and badges for pending", async () => {
    const jsx = await W1_20Section();
    render(jsx);

    // BioHack has a render in public/renders/biohack.png
    const biohackImg = screen.getByAltText(/biohack label render artwork/i);
    expect(biohackImg).toBeTruthy();

    // More Good Years has a render in public/renders/more-good-years.png
    const mgyImg = screen.getByAltText(/more good years label render artwork/i);
    expect(mgyImg).toBeTruthy();

    // Pending render badges appear for products without renders (e.g. Glow, Prime, Good Days, etc.)
    const pendingBadges = screen.getAllByText(/render pendente/i);
    expect(pendingBadges.length).toBeGreaterThan(0);
  });
});
