// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import {
  WeightSelector,
  WeightCalculator,
} from "@/components/commerce/weight-selector";

describe("WeightSelector Component Suite (W1-13)", () => {
  afterEach(() => {
    cleanup();
  });

  describe("WeightSelector", () => {
    it("renders accessible semantic fieldset, legend and radio inputs", () => {
      render(
        <WeightSelector
          legend="Your dog weighs"
          helperText="2 chews a day · we picked the plan that matches"
        />
      );

      // Semantic fieldset
      const fieldset = screen.getByRole("group", { name: /your dog weighs/i });
      expect(fieldset).toBeTruthy();

      // Semantic legend
      expect(screen.getByText("Your dog weighs")).toBeTruthy();

      // Helper text
      expect(
        screen.getByText("2 chews a day · we picked the plan that matches")
      ).toBeTruthy();

      // Radio inputs
      const radios = screen.getAllByRole("radio");
      expect(radios).toHaveLength(4);

      // Radio labels
      expect(screen.getByLabelText("Up to 20 lbs")).toBeTruthy();
      expect(screen.getByLabelText("21 to 50 lbs")).toBeTruthy();
      expect(screen.getByLabelText("51 to 90 lbs")).toBeTruthy();
      expect(screen.getByLabelText("Over 90 lbs")).toBeTruthy();
    });

    it("selects default band (21 to 50 lbs) and allows user interaction", () => {
      const handleChange = vi.fn();
      render(
        <WeightSelector defaultSelectedId="21-to-50" onChange={handleChange} />
      );

      const defaultRadio = screen.getByLabelText(
        "21 to 50 lbs"
      ) as HTMLInputElement;
      expect(defaultRadio.checked).toBe(true);

      const over90Radio = screen.getByLabelText(
        "Over 90 lbs"
      ) as HTMLInputElement;
      expect(over90Radio.checked).toBe(false);

      // Select Over 90 lbs
      fireEvent.click(over90Radio);
      expect(over90Radio.checked).toBe(true);
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({ id: "over-90", labelLbs: "Over 90 lbs" }),
        3
      );
    });

    it("supports controlled selectedId prop", () => {
      const { rerender } = render(<WeightSelector selectedId="up-to-20" />);

      const upTo20 = screen.getByLabelText("Up to 20 lbs") as HTMLInputElement;
      expect(upTo20.checked).toBe(true);

      rerender(<WeightSelector selectedId="51-to-90" />);
      const band51to90 = screen.getByLabelText(
        "51 to 90 lbs"
      ) as HTMLInputElement;
      expect(band51to90.checked).toBe(true);
    });

    it("displays kg labels when unit is kg", () => {
      render(<WeightSelector unit="kg" />);

      expect(screen.getByLabelText("Up to 9 kg")).toBeTruthy();
      expect(screen.getByLabelText("9.5 to 23 kg")).toBeTruthy();
      expect(screen.getByLabelText("23 to 41 kg")).toBeTruthy();
      expect(screen.getByLabelText("Over 41 kg")).toBeTruthy();
    });

    it("renders unit toggle switch when showUnitToggle is true and handles toggles", () => {
      const handleUnitChange = vi.fn();
      render(
        <WeightSelector
          showUnitToggle
          unit="lb"
          onUnitChange={handleUnitChange}
        />
      );

      const lbButton = screen.getByRole("button", { name: /^lb$/i });
      const kgButton = screen.getByRole("button", { name: /^kg$/i });

      expect(lbButton).toBeTruthy();
      expect(kgButton).toBeTruthy();
      expect(lbButton.getAttribute("aria-pressed")).toBe("true");
      expect(kgButton.getAttribute("aria-pressed")).toBe("false");

      fireEvent.click(kgButton);
      expect(handleUnitChange).toHaveBeenCalledWith("kg");
    });

    it("meets touch target size requirements of at least 44px min height", () => {
      render(<WeightSelector />);
      const labels = document.querySelectorAll("label[data-weight-band]");
      expect(labels.length).toBe(4);
      labels.forEach((label) => {
        expect(label.className).toContain("min-h-[44px]");
      });
    });
  });

  describe("WeightCalculator", () => {
    it("renders semantic form controls for species, weight, age, and activity", () => {
      render(<WeightCalculator initialSpecies="dog" initialWeight={35} />);

      // Species radio group
      const dogRadio = screen.getByRole("radio", { name: /^dog$/i });
      const catRadio = screen.getByRole("radio", { name: /^cat$/i });
      const horseRadio = screen.getByRole("radio", { name: /^horse$/i });
      expect(dogRadio).toBeTruthy();
      expect(catRadio).toBeTruthy();
      expect(horseRadio).toBeTruthy();
      expect((dogRadio as HTMLInputElement).checked).toBe(true);

      // Weight input & unit toggles
      const weightInput = screen.getByLabelText(
        /pet weight in lb/i
      ) as HTMLInputElement;
      expect(weightInput).toBeTruthy();
      expect(weightInput.value).toBe("35");

      const lbBtn = screen.getByRole("button", { name: /^lb$/i });
      const kgBtn = screen.getByRole("button", { name: /^kg$/i });
      expect(lbBtn).toBeTruthy();
      expect(kgBtn).toBeTruthy();

      // Age radios
      const youngRadio = screen.getByRole("radio", { name: /^young$/i });
      const adultRadio = screen.getByRole("radio", { name: /^adult$/i });
      const seniorRadio = screen.getByRole("radio", { name: /^senior$/i });
      expect(youngRadio).toBeTruthy();
      expect(adultRadio).toBeTruthy();
      expect(seniorRadio).toBeTruthy();
      expect((seniorRadio as HTMLInputElement).checked).toBe(true);

      // Activity radios
      const lowRadio = screen.getByRole("radio", { name: /^low$/i });
      const modRadio = screen.getByRole("radio", { name: /^moderate$/i });
      const highRadio = screen.getByRole("radio", { name: /^high$/i });
      expect(lowRadio).toBeTruthy();
      expect(modRadio).toBeTruthy();
      expect(highRadio).toBeTruthy();
      expect((modRadio as HTMLInputElement).checked).toBe(true);
    });

    it("calculates dog dose result dynamically and displays daily schedule", () => {
      render(<WeightCalculator initialSpecies="dog" initialWeight={35} />);

      // Dose result
      expect(
        screen.getAllByText("2 chews daily").length
      ).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/per day · 21 to 50 lbs/i)).toBeTruthy();

      // Daily schedule
      expect(screen.getByText("1 chew with breakfast")).toBeTruthy();
      expect(screen.getByText("1 chew with dinner")).toBeTruthy();

      // Titration rule
      expect(
        screen.getByText(/start with half dose for the first 3 to 5 days/i)
      ).toBeTruthy();

      // Regulatory notice
      expect(screen.getByText("For animal use only.")).toBeTruthy();
      expect(screen.getByText(/check with your vet first/i)).toBeTruthy();
    });

    it("updates dose and switches to equine regulatory disclaimer when Horse is selected", () => {
      render(<WeightCalculator initialSpecies="dog" initialWeight={35} />);

      const horseRadio = screen.getByRole("radio", { name: /^horse$/i });
      fireEvent.click(horseRadio);

      // Equine regulatory text must appear
      expect(
        screen.getByText("Equine products: not for horses intended for food.")
      ).toBeTruthy();
    });

    it("renders Quick Reference semantic table with tab filtering", () => {
      render(<WeightCalculator />);

      expect(
        screen.getByRole("heading", { name: /dose by weight/i, level: 3 })
      ).toBeTruthy();

      // Table headers
      expect(screen.getByText("Weight Band")).toBeTruthy();
      expect(screen.getByText("Recommended Daily Dose")).toBeTruthy();
      expect(screen.getByText("Administration Guidelines")).toBeTruthy();

      // Species tabs
      const catTab = screen.getByRole("tab", { name: /^cats$/i });
      fireEvent.click(catTab);

      expect(screen.getByText("Up to 10 lbs")).toBeTruthy();
      expect(screen.getByText("0.5 mL daily")).toBeTruthy();
    });

    it("converts weight when unit button is toggled", () => {
      render(<WeightCalculator initialSpecies="dog" initialWeight={22} />);

      const kgBtn = screen.getByRole("button", { name: /^kg$/i });
      fireEvent.click(kgBtn);

      const weightInput = screen.getByLabelText(
        /pet weight in kg/i
      ) as HTMLInputElement;
      // 22 lbs ≈ 10 kg
      expect(weightInput.value).toBe("10");
    });
  });
});
