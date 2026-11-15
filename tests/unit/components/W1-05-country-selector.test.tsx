// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import {
  CountrySelector,
  CountrySelectorInline,
} from "@/components/layout/country-selector";
import {
  MarketProvider,
  MoneyDisplay,
  getMarketCookie,
  setMarketCookie,
  MARKET_COOKIE_NAME,
  SUPPORTED_MARKETS,
  useMarket,
} from "@/lib/market";
import W1_05_Section from "@/app/(shared)/dev/kit/sections/W1-05";

// Helper component to test useMarket hook outputs
function MarketInfoConsumer() {
  const { market, formatMoney, formatPrice } = useMarket();
  return (
    <div>
      <span data-testid="active-market-id">{market.id}</span>
      <span data-testid="active-currency-code">{market.currency.code}</span>
      <span data-testid="formatted-money">
        {formatMoney({ amount: 65, currencyCode: "USD" })}
      </span>
      <span data-testid="formatted-price">{formatPrice(100)}</span>
    </div>
  );
}

describe("W1-05: Country and Currency Selector & Market Context", () => {
  beforeEach(() => {
    // Clear cookies before each test
    document.cookie = `${MARKET_COOKIE_NAME}=; Path=/; Max-Age=0`;
  });

  afterEach(() => {
    cleanup();
  });

  describe("CountrySelector Component", () => {
    it("renders semantic trigger button with 44px min touch target and accessible aria attributes", () => {
      render(
        <MarketProvider>
          <CountrySelector />
        </MarketProvider>
      );

      const triggerBtn = screen.getByRole("button", {
        name: /Select country and currency/i,
      });
      expect(triggerBtn).toBeDefined();
      expect(triggerBtn.tagName.toLowerCase()).toBe("button");
      expect(triggerBtn.getAttribute("type")).toBe("button");
      expect(triggerBtn.getAttribute("aria-haspopup")).toBe("dialog");
      expect(triggerBtn.getAttribute("aria-expanded")).toBe("false");

      // Verify touch target class
      expect(triggerBtn.className).toContain("min-h-[44px]");
      expect(triggerBtn.className).toContain("min-w-[44px]");
    });

    it("opens dialog on click and displays semantic search input and region fieldsets", async () => {
      render(
        <MarketProvider>
          <CountrySelector />
        </MarketProvider>
      );

      const triggerBtn = screen.getByRole("button", {
        name: /Select country and currency/i,
      });
      fireEvent.click(triggerBtn);

      expect(triggerBtn.getAttribute("aria-expanded")).toBe("true");

      // Modal dialog exists
      const dialog = screen.getByRole("dialog");
      expect(dialog).toBeDefined();
      expect(dialog.getAttribute("aria-modal")).toBe("true");

      // Search input with associated label (Rule 5)
      const searchInput = screen.getByLabelText(
        /Search country or currency/i
      ) as HTMLInputElement;
      expect(searchInput).toBeDefined();
      expect(searchInput.tagName.toLowerCase()).toBe("input");
      expect(searchInput.type).toBe("search");

      // Close button with aria-label
      const closeBtn = screen.getByRole("button", {
        name: /Close country selector dialog/i,
      });
      expect(closeBtn).toBeDefined();

      // Fieldsets for regions
      const fieldsets = dialog.querySelectorAll("fieldset");
      expect(fieldsets.length).toBeGreaterThan(0);
      const legend = fieldsets[0].querySelector("legend");
      expect(legend).toBeDefined();
      expect(legend?.textContent).toBeTruthy();
    });

    it("filters countries when typing in search input", async () => {
      render(
        <MarketProvider>
          <CountrySelector />
        </MarketProvider>
      );

      fireEvent.click(
        screen.getByRole("button", {
          name: /Select country and currency/i,
        })
      );

      const searchInput = screen.getByLabelText(/Search country or currency/i);
      fireEvent.change(searchInput, { target: { value: "Japan" } });

      expect(screen.getByText("Japan")).toBeDefined();
      expect(screen.queryByText("United Kingdom")).toBeNull();
    });

    it("updates selected market and sets cookie when country option button is clicked", () => {
      render(
        <MarketProvider>
          <CountrySelector />
          <MarketInfoConsumer />
        </MarketProvider>
      );

      expect(screen.getByTestId("active-market-id").textContent).toBe("us");

      // Open dialog
      fireEvent.click(
        screen.getByRole("button", {
          name: /Select country and currency/i,
        })
      );

      // Click European Union market button
      const euBtn = screen.getByRole("button", {
        name: /European Union/i,
      });
      fireEvent.click(euBtn);

      // Verify market changed in context
      expect(screen.getByTestId("active-market-id").textContent).toBe("eu");
      expect(screen.getByTestId("active-currency-code").textContent).toBe(
        "EUR"
      );

      // Verify cookie was persisted
      expect(getMarketCookie()).toBe("eu");
    });

    it("closes modal when Escape key is pressed", () => {
      render(
        <MarketProvider>
          <CountrySelector />
        </MarketProvider>
      );

      const triggerBtn = screen.getByRole("button", {
        name: /Select country and currency/i,
      });
      fireEvent.click(triggerBtn);

      expect(screen.getByRole("dialog")).toBeDefined();

      fireEvent.keyDown(window, { key: "Escape" });
      expect(screen.queryByRole("dialog")).toBeNull();
    });
  });

  describe("CountrySelectorInline Component", () => {
    it("renders semantic form with associated label and select input", () => {
      render(
        <MarketProvider>
          <CountrySelectorInline />
        </MarketProvider>
      );

      const select = screen.getByLabelText(
        /Country & Currency/i
      ) as HTMLSelectElement;
      expect(select).toBeDefined();
      expect(select.tagName.toLowerCase()).toBe("select");
      expect(select.value).toBe("us");

      // Check option count matches supported markets
      expect(select.options.length).toBe(SUPPORTED_MARKETS.length);
    });

    it("updates market when select value is changed", () => {
      render(
        <MarketProvider>
          <CountrySelectorInline />
          <MarketInfoConsumer />
        </MarketProvider>
      );

      const select = screen.getByLabelText(/Country & Currency/i);
      fireEvent.change(select, { target: { value: "gb" } });

      expect(screen.getByTestId("active-market-id").textContent).toBe("gb");
      expect(screen.getByTestId("active-currency-code").textContent).toBe(
        "GBP"
      );
      expect(getMarketCookie()).toBe("gb");
    });
  });

  describe("MoneyDisplay & Price Formatting (Rule 7)", () => {
    it("formats Money according to active market currency and locale using Intl.NumberFormat", () => {
      render(
        <MarketProvider initialMarket="eu">
          <MoneyDisplay amount={65} currencyCode="USD" />
        </MarketProvider>
      );

      // 65 USD * 0.92 = 59.8 EUR
      const text = screen.getByText(/59,80|59.80/);
      expect(text).toBeDefined();
      expect(text.textContent).toContain("€");
    });

    it("formats JPY with 0 decimal places per currency standard", () => {
      render(
        <MarketProvider initialMarket="jp">
          <MoneyDisplay amount={65} currencyCode="USD" />
        </MarketProvider>
      );

      // 65 USD * 155 = 10075 JPY
      const text = screen.getByText(/10,075|10.075/);
      expect(text).toBeDefined();
      expect(text.textContent).toMatch(/¥|￥/);
    });
  });

  describe("Cookie Persistence", () => {
    it("initializes from cookie when cookie exists", async () => {
      setMarketCookie("ca");
      expect(getMarketCookie()).toBe("ca");

      render(
        <MarketProvider>
          <MarketInfoConsumer />
        </MarketProvider>
      );

      // W2-37: o cookie é aplicado após a hidratação (useEffect), não no primeiro render.
      await waitFor(() =>
        expect(screen.getByTestId("active-market-id").textContent).toBe("ca")
      );
      expect(screen.getByTestId("active-currency-code").textContent).toBe(
        "CAD"
      );
    });
  });

  describe("Dev Kit Showroom Section (W1-05.tsx)", () => {
    it("renders showroom section with Human and Pet theme containers", () => {
      const { container } = render(<W1_05_Section />);

      const section = container.querySelector("section");
      expect(section).toBeDefined();
      expect(section?.getAttribute("aria-labelledby")).toBe("w1-05-heading");

      // Verify Human theme container
      const humanContainer = container.querySelector('[data-theme="human"]');
      expect(humanContainer).toBeDefined();
      expect(humanContainer?.textContent).toContain("Human Line Theme");

      // Verify Pet theme container and Pet compliance notice (Rule 8)
      const petContainer = container.querySelector('[data-theme="pet"]');
      expect(petContainer).toBeDefined();
      expect(petContainer?.textContent).toContain("Pet Line Theme");
      expect(petContainer?.textContent).toContain(
        "For animal use only. Keep out of reach of children."
      );
    });
  });
});
