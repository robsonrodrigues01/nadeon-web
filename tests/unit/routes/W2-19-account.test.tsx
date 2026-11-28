// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";

const redirectMock = vi.fn((url: string) => {
  throw new Error(`NEXT_REDIRECT:${url}`);
});
const revalidatePathMock = vi.fn();

vi.mock("next/navigation", () => ({
  redirect: (url: string) => redirectMock(url),
  useRouter: () => ({ push: vi.fn() }),
}));
vi.mock("next/cache", () => ({
  revalidatePath: (path: string) => revalidatePathMock(path),
}));
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => undefined }),
}));

import AccountPage, { generateMetadata } from "@/app/(account)/account/page";
import { AccountDashboard } from "@/app/(account)/account/_components/dashboard-view";
import {
  buildAccountDashboard,
  type AccountDashboardView,
} from "@/app/(account)/account/_components/view-model";
import {
  skipNextDeliveryAction,
  signOutAction,
} from "@/app/(account)/account/_components/actions";
import { accountProvider, subscriptionProvider } from "@/lib/providers";
import { SUPPORTED_MARKETS, DEFAULT_MARKET } from "@/lib/market/markets";
import { formatMoneyWithMarket } from "@/lib/market/formatter";
import { CustomerProfileSchema, OrderSchema } from "@/lib/contracts/account";
import {
  SubscriptionCapabilitiesSchema,
  SubscriptionSchema,
} from "@/lib/contracts/subscription";

const VIEW: AccountDashboardView = {
  firstName: "Alex",
  fullName: "Alex Morgan",
  initial: "A",
  nextDelivery: {
    subscriptionId: "sub_biohack_001",
    dateLabel: "Dec 2, 2026",
    shipsTo: "Austin, TX",
    lines: [
      {
        id: "sub_line_biohack",
        title: "BioHack - 1 Jar",
        quantity: 1,
        priceLabel: "$55.25",
      },
    ],
    totalLabel: "$55.25",
  },
  activeSubscriptions: [
    { id: "sub_biohack_001", title: "BioHack - 1 Jar", intervalDays: 30 },
    { id: "sub_mgy_002", title: "More Good Years - 2 Jars", intervalDays: 60 },
  ],
  recentOrder: {
    id: "ord_100234",
    orderNumber: "NL-100234",
    statusLabel: "Delivered",
    firstTitle: "BioHack - 2 Jars (60 days)",
    itemCount: 1,
    totalLabel: "$118.00",
  },
  canSkip: true,
  canReschedule: true,
  canEditItems: true,
};

describe("Route /account (W2-19)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe("Metadata", () => {
    it("usa título do dashboard e noindex (área logada)", async () => {
      const metadata = await generateMetadata();
      expect(metadata.title).toBe("My account | Nadeon Labs");
      expect(metadata.robots).toEqual(
        expect.objectContaining({ index: false })
      );
    });
  });

  describe("Dashboard view (catálogo 5.4, Dashboard)", () => {
    it("renderiza títulos da página, saudação e subtítulo do design", () => {
      render(<AccountDashboard view={VIEW} />);
      expect(
        screen.getByRole("heading", { level: 1, name: "My account" })
      ).toBeTruthy();
      expect(
        screen.getByRole("heading", { level: 2, name: "Hi, Alex" })
      ).toBeTruthy();
      expect(
        screen.getByText("Next delivery", { selector: "h3" })
      ).toBeTruthy();
    });

    it("botão Skip this delivery é <button type=submit> de form com o id da assinatura", () => {
      render(<AccountDashboard view={VIEW} />);
      const button = screen.getByRole("button", {
        name: "Skip this delivery",
      });
      expect(button.getAttribute("type")).toBe("submit");
      const form = button.closest("form");
      expect(form).not.toBeNull();
      const hidden = form!.querySelector('input[name="subscriptionId"]');
      expect(hidden?.getAttribute("value")).toBe("sub_biohack_001");
    });

    it("link Change date navega para /account/subscriptions", () => {
      render(<AccountDashboard view={VIEW} />);
      expect(
        screen.getByRole("link", { name: "Change date" }).getAttribute("href")
      ).toBe("/account/subscriptions");
    });

    it("link Edit items navega para /account/subscriptions", () => {
      render(<AccountDashboard view={VIEW} />);
      expect(
        screen.getByRole("link", { name: "Edit items" }).getAttribute("href")
      ).toBe("/account/subscriptions");
    });

    it("link View order aponta para o pedido mais recente", () => {
      render(<AccountDashboard view={VIEW} />);
      expect(
        screen.getByRole("link", { name: "View order" }).getAttribute("href")
      ).toBe("/account/orders/ord_100234");
    });

    it("link Manage subscriptions → navega para /account/subscriptions", () => {
      render(<AccountDashboard view={VIEW} />);
      expect(
        screen
          .getByRole("link", { name: "Manage subscriptions →" })
          .getAttribute("href")
      ).toBe("/account/subscriptions");
    });

    it("oculta botões de ação quando a capacidade do provider não permite", () => {
      render(
        <AccountDashboard
          view={{
            ...VIEW,
            canSkip: false,
            canReschedule: false,
            canEditItems: false,
          }}
        />
      );
      expect(
        screen.queryByRole("button", { name: "Skip this delivery" })
      ).toBeNull();
      expect(screen.queryByRole("link", { name: "Change date" })).toBeNull();
      expect(screen.queryByRole("link", { name: "Edit items" })).toBeNull();
    });

    it("não renderiza Reorder nem Copy link sem dado (contrato não traz variante nem link)", () => {
      render(<AccountDashboard view={VIEW} />);
      expect(screen.queryByRole("button", { name: "Reorder" })).toBeNull();
      expect(screen.queryByRole("button", { name: "Copy link" })).toBeNull();
    });

    it("sair é botão de form, e a navegação da conta tem Overview como página atual", () => {
      render(<AccountDashboard view={VIEW} />);
      const signOut = screen.getByRole("button", { name: "Sign out" });
      expect(signOut.closest("form")).not.toBeNull();

      const nav = screen.getByRole("navigation", { name: "Account" });
      const overview = within(nav).getByRole("link", { name: "Overview" });
      expect(overview.getAttribute("aria-current")).toBe("page");
      expect(
        within(nav).getByRole("link", { name: "Orders" }).getAttribute("href")
      ).toBe("/account/orders");
    });

    it("mostra preços e dados vindos da view, sem textos de exemplo do design", () => {
      const { container } = render(<AccountDashboard view={VIEW} />);
      const text = container.textContent ?? "";
      expect(text).toContain("$55.25");
      expect(text).toContain("Ships to Austin, TX");
      expect(text).toContain("BioHack - 1 Jar · every 30 days");
      expect(text).not.toMatch(/\(example\)|\[X\]|\$XX/);
    });

    it("oculta a seção de próxima entrega quando não há assinatura ativa", () => {
      render(<AccountDashboard view={{ ...VIEW, nextDelivery: null }} />);
      expect(
        screen.queryByRole("heading", { name: "Next delivery" })
      ).toBeNull();
      expect(
        screen.getByRole("heading", { name: "Active subscriptions" })
      ).toBeTruthy();
    });
  });

  describe("buildAccountDashboard", () => {
    const customer = CustomerProfileSchema.parse({
      id: "cust_1",
      firstName: "Alex",
      lastName: "Morgan",
      email: "alex@example.com",
      profileType: "Both",
    });
    const capabilities = SubscriptionCapabilitiesSchema.parse({
      canSkip: true,
      canReschedule: true,
      canChangeFrequency: true,
      canSwapProduct: false,
      canChangeQuantity: false,
      canPause: true,
      canResume: true,
      canCancel: true,
      allowedIntervalDays: [30],
      cancelReasons: [],
    });
    const sub = (id: string, status: "active" | "paused", next: string) =>
      SubscriptionSchema.parse({
        id,
        status,
        nextBillingDate: next,
        intervalDays: 30,
        lines: [
          {
            id: `line_${id}`,
            variantId: "var_1",
            productTitle: `Product ${id}`,
            quantity: 1,
            price: { amount: 10, currencyCode: "USD" },
          },
        ],
        estimatedTotal: { amount: 10, currencyCode: "USD" },
        createdAt: "2026-01-01T00:00:00.000Z",
      });
    const order = (id: string, createdAt: string, amount: number) =>
      OrderSchema.parse({
        id,
        orderNumber: `NL-${id}`,
        createdAt,
        financialStatus: "paid",
        fulfillmentStatus: "in_transit",
        items: [
          {
            title: `Item ${id}`,
            quantity: 2,
            price: { amount, currencyCode: "USD" },
          },
        ],
        total: { amount, currencyCode: "USD" },
      });

    it("escolhe a assinatura ativa com cobrança mais próxima e ignora pausadas", () => {
      const view = buildAccountDashboard({
        customer,
        subscriptions: [
          sub("late", "active", "2026-12-20T00:00:00.000Z"),
          sub("paused", "paused", "2026-11-20T00:00:00.000Z"),
          sub("soon", "active", "2026-12-02T00:00:00.000Z"),
        ],
        orders: [],
        capabilities,
        market: DEFAULT_MARKET,
      });
      expect(view.nextDelivery?.subscriptionId).toBe("soon");
      expect(view.activeSubscriptions.map((s) => s.id)).toEqual([
        "soon",
        "late",
      ]);
      expect(view.recentOrder).toBeNull();
    });

    it("usa o pedido mais recente e soma as quantidades dos itens", () => {
      const view = buildAccountDashboard({
        customer,
        subscriptions: [],
        orders: [
          order("old", "2026-01-01T00:00:00.000Z", 40),
          order("new", "2026-10-24T00:00:00.000Z", 108),
        ],
        capabilities,
        market: DEFAULT_MARKET,
      });
      expect(view.recentOrder?.orderNumber).toBe("NL-new");
      expect(view.recentOrder?.itemCount).toBe(2);
      expect(view.recentOrder?.statusLabel).toBe("In transit");
      expect(view.recentOrder?.totalLabel).toBe(
        formatMoneyWithMarket(
          { amount: 108, currencyCode: "USD" },
          DEFAULT_MARKET
        )
      );
    });

    it("formata preço em USD mesmo quando o mercado do visitante é internacional", () => {
      const gb = SUPPORTED_MARKETS.find((m) => m.countryCode === "GB");
      expect(gb).toBeDefined();
      const view = buildAccountDashboard({
        customer,
        subscriptions: [sub("s1", "active", "2026-12-02T00:00:00.000Z")],
        orders: [order("o1", "2026-10-24T00:00:00.000Z", 100)],
        capabilities,
        market: gb!,
      });
      expect(view.nextDelivery?.totalLabel).toBe("$10.00");
      expect(view.recentOrder?.totalLabel).toBe("$100.00");
    });
  });

  describe("Server Actions", () => {
    it("skipNextDeliveryAction pula a próxima entrega e revalida /account", async () => {
      const skipSpy = vi.spyOn(subscriptionProvider, "skip");
      const formData = new FormData();
      formData.set("subscriptionId", "sub_biohack_001");

      await skipNextDeliveryAction(formData);

      expect(skipSpy).toHaveBeenCalledWith("sub_biohack_001");
      expect(revalidatePathMock).toHaveBeenCalledWith("/account");
      skipSpy.mockRestore();
    });

    it("skipNextDeliveryAction rejeita id ausente sem chamar o provider", async () => {
      const skipSpy = vi.spyOn(subscriptionProvider, "skip");
      await expect(skipNextDeliveryAction(new FormData())).rejects.toThrow(
        "subscriptionId is required"
      );
      expect(skipSpy).not.toHaveBeenCalled();
      skipSpy.mockRestore();
    });

    it("signOutAction encerra a sessão e redireciona para o login", async () => {
      // Mockado para não zerar a sessão do provider mock nos testes seguintes.
      const signOutSpy = vi
        .spyOn(accountProvider, "signOut")
        .mockResolvedValueOnce(undefined);
      await expect(signOutAction()).rejects.toThrow("NEXT_REDIRECT:");
      expect(signOutSpy).toHaveBeenCalled();
      expect(redirectMock).toHaveBeenCalledWith(
        "/account/login?returnTo=%2Faccount"
      );
      signOutSpy.mockRestore();
    });
  });

  describe("Page (Server Component)", () => {
    it("renderiza o dashboard com os mocks dos providers", async () => {
      const element = await AccountPage();
      render(element);
      expect(
        screen.getByRole("heading", { level: 1, name: "My account" })
      ).toBeTruthy();
      expect(
        screen.getByRole("heading", { level: 2, name: "Hi, TEST Alex" })
      ).toBeTruthy();
      expect(
        screen.getByRole("button", { name: "Skip this delivery" })
      ).toBeTruthy();
      expect(screen.getByRole("button", { name: "Sign out" })).toBeTruthy();
    });

    it("sem sessão, redireciona para o login sem renderizar", async () => {
      const sessionSpy = vi
        .spyOn(accountProvider, "getSession")
        .mockResolvedValueOnce(null);
      await expect(AccountPage()).rejects.toThrow("NEXT_REDIRECT:");
      expect(redirectMock).toHaveBeenCalledWith(
        "/account/login?returnTo=%2Faccount"
      );
      sessionSpy.mockRestore();
    });
  });
});
