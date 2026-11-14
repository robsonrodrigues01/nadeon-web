// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import AccountSettingsPage, {
  generateMetadata,
} from "@/app/(account)/account/settings/page";
import {
  saveProfileAction,
  signOutAction,
} from "@/app/(account)/account/settings/_components/actions";
import {
  formatBirthday,
  parseBirthday,
} from "@/app/(account)/account/settings/_components/birthday";
import { mockAccountProvider } from "@/lib/providers/mock/account";
import type { Address, CustomerProfile } from "@/lib/contracts/account";

const redirectMock = vi.hoisted(() =>
  vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT ${url}`);
  })
);
const revalidatePathMock = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
  useRouter: () => ({
    refresh: vi.fn(),
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
}));
vi.mock("next/cache", () => ({ revalidatePath: revalidatePathMock }));
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => undefined }),
}));
// Cabeçalho, rodapé e faixa são componentes da onda 1 com testes próprios;
// aqui só custariam renderização pesada em cada caso.
vi.mock("@/components/layout/header", () => ({ Header: () => null }));
vi.mock("@/components/layout/footer", () => ({ Footer: () => null }));
vi.mock("@/components/layout/announcement-bar", () => ({
  AnnouncementBar: () => null,
}));

async function renderPage() {
  const ui = await AccountSettingsPage();
  return render(ui);
}

function input(name: string): HTMLInputElement {
  return screen.getByRole("textbox", { name }) as HTMLInputElement;
}

function button(scope: HTMLElement, name: string): HTMLButtonElement {
  return within(scope).getByRole("button", { name }) as HTMLButtonElement;
}

const SECOND_ADDRESS: Address = {
  id: "addr_office",
  firstName: "Alex",
  lastName: "Morgan",
  address1: "1200 Sample Ave",
  address2: "Floor 3",
  city: "Austin",
  province: "TX",
  zip: "78702",
  country: "US",
  isDefault: false,
};

describe("W2-22 /account/settings", () => {
  beforeEach(() => {
    redirectMock.mockClear();
    revalidatePathMock.mockClear();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  describe("metadata", () => {
    it("usa título da página e fica fora do índice", async () => {
      const meta = await generateMetadata();
      expect(meta.title).toContain("Profile & addresses");
      expect(meta.robots).toMatchObject({ index: false });
    });
  });

  describe("cabeçalho e navegação", () => {
    it("mostra o título, o subtítulo e o breadcrumb do design", async () => {
      await renderPage();

      screen.getByRole("heading", { level: 1, name: "Profile & addresses" });
      screen.getByText("Your details, where we ship and how we contact you.");

      const breadcrumb = screen.getByRole("navigation", { name: "Breadcrumb" });
      const account = within(breadcrumb).getByRole("link", { name: "Account" });
      expect(account.getAttribute("href")).toBe("/account");
      expect(
        breadcrumb.querySelector('[aria-current="page"]')?.textContent
      ).toBe("Profile");
    });

    it("mostra o nome do cliente vindo do provider, sem texto de exemplo", async () => {
      await renderPage();
      screen.getByText("Alex Morgan", { selector: "p" });
    });

    it("tem os links da conta e o botão Sign out", async () => {
      await renderPage();
      const nav = screen.getByRole("navigation", { name: "Account" });

      const href = (name: string) =>
        within(nav).getByRole("link", { name }).getAttribute("href");

      expect(href("Overview")).toBe("/account");
      expect(href("Orders")).toBe("/account/orders");
      expect(href("Subscriptions")).toBe("/account/subscriptions");
      expect(href("Addresses")).toBe("#addresses");
      expect(href("Profile")).toBe("/account/settings");
      expect(
        within(nav)
          .getByRole("link", { name: "Profile" })
          .getAttribute("aria-current")
      ).toBe("page");

      expect(button(nav.parentElement!, "Sign out").type).toBe("submit");
    });
  });

  describe("Profile (campos e botão)", () => {
    it("tem os campos do catálogo preenchidos com o cliente do provider", async () => {
      await renderPage();

      expect(input("First name").value).toBe("Alex");
      expect(input("Last name").value).toBe("Morgan");
      expect(input("Email").value).toBe("alex.morgan@example.com");
      expect(input("Phone").value).toBe("+1 (555) 234-5678");
      expect(input("Birthday (optional)").value).toBe("05 / 14");
      const shoppingFor = screen.getByRole("combobox", {
        name: "Shopping for",
      }) as HTMLSelectElement;
      expect(shoppingFor.value).toBe("Both");
    });

    it("o e-mail é do tipo email e o nome é obrigatório", async () => {
      await renderPage();
      expect(input("Email").type).toBe("email");
      expect(input("First name").required).toBe(true);
    });

    it("o botão Save changes envia o formulário de perfil", async () => {
      await renderPage();
      const save = screen.getByRole("button", {
        name: "Save changes",
      }) as HTMLButtonElement;
      expect(save.type).toBe("submit");
      const form = save.closest("form");
      expect(form).not.toBeNull();
      expect(form!.contains(input("First name"))).toBe(true);
    });
  });

  describe("Addresses", () => {
    it("lista os endereços do provider com o rótulo DEFAULT", async () => {
      await renderPage();
      const section = screen.getByRole("region", { name: "Addresses" });

      within(section).getByText("DEFAULT");
      within(section).getByText("742 Evergreen Terrace");
      within(section).getByText("Apt 4B");
      within(section).getByText("Austin, TX 78701, United States");
    });

    it("botões de endereço: + Add address, Edit, Remove e Set as default", async () => {
      const [primary] = await mockAccountProvider.getAddresses();
      vi.spyOn(mockAccountProvider, "getAddresses").mockResolvedValueOnce([
        primary,
        SECOND_ADDRESS,
      ]);
      await renderPage();
      const section = screen.getByRole("region", { name: "Addresses" });

      expect(button(section, "+ Add address").disabled).toBe(true);
      const edits = within(section).getAllByRole("button", { name: "Edit" });
      const removes = within(section).getAllByRole("button", {
        name: "Remove",
      });
      expect(edits).toHaveLength(2);
      expect(removes).toHaveLength(2);
      expect(edits.every((b) => (b as HTMLButtonElement).disabled)).toBe(true);
      expect(removes.every((b) => (b as HTMLButtonElement).disabled)).toBe(
        true
      );

      // Só o endereço que não é padrão recebe Set as default.
      const setDefault = within(section).getAllByRole("button", {
        name: "Set as default",
      });
      expect(setDefault).toHaveLength(1);
      expect((setDefault[0] as HTMLButtonElement).disabled).toBe(true);
      within(section).getByText("1200 Sample Ave");
    });

    it("o endereço usa a tag address semântica", async () => {
      await renderPage();
      const section = screen.getByRole("region", { name: "Addresses" });
      expect(section.querySelector("address")).not.toBeNull();
    });

    it("exibe a nota sobre assinaturas", async () => {
      await renderPage();
      screen.getByText(
        /Changing your default address also updates where active subscriptions/
      );
    });
  });

  describe("Delete account", () => {
    it("tem o texto de exclusão e o botão desabilitado Request account deletion", async () => {
      await renderPage();
      const section = screen.getByRole("region", { name: "Delete account" });

      within(section).getByText(
        /Order records we must keep by law are retained/
      );
      expect(button(section, "Request account deletion").disabled).toBe(true);
    });
  });

  describe("conteúdo", () => {
    it("não mostra placeholders do design nem texto de exemplo", async () => {
      const { container } = await renderPage();
      const text = container.textContent ?? "";
      expect(text).not.toMatch(/\(example\)/i);
      expect(text).not.toMatch(/\[/);
      expect(text).not.toMatch(/\$XX/i);
      expect(text).not.toMatch(/Member since/);
    });
  });

  describe("sessão", () => {
    it("sem sessão, redireciona para o login da conta", async () => {
      vi.spyOn(mockAccountProvider, "getSession").mockResolvedValueOnce(null);
      await expect(AccountSettingsPage()).rejects.toThrow("NEXT_REDIRECT");
      expect(redirectMock).toHaveBeenCalledWith(
        "/account/login?returnTo=%2Faccount%2Fsettings"
      );
    });
  });

  describe("Server Actions", () => {
    function profileForm(values: Record<string, string>): FormData {
      const data = new FormData();
      for (const [key, value] of Object.entries(values)) data.set(key, value);
      return data;
    }

    const VALID = {
      firstName: "Alex",
      lastName: "Morgan",
      email: "alex.morgan@example.com",
      phone: "+1 (555) 234-5678",
      birthDate: "05 / 14",
      profileType: "Both",
    };

    it("salva o perfil pelo provider com aniversário sem ano", async () => {
      const update = vi
        .spyOn(mockAccountProvider, "updateProfile")
        .mockResolvedValue({} as CustomerProfile);

      await saveProfileAction(profileForm(VALID));

      expect(update).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: "Alex",
          lastName: "Morgan",
          email: "alex.morgan@example.com",
          birthDate: "--05-14",
          profileType: "Both",
        })
      );
      expect(revalidatePathMock).toHaveBeenCalledWith("/account/settings");
    });

    it("não grava quando o e-mail é inválido", async () => {
      const update = vi
        .spyOn(mockAccountProvider, "updateProfile")
        .mockResolvedValue({} as CustomerProfile);
      await saveProfileAction(profileForm({ ...VALID, email: "não-é-email" }));
      expect(update).not.toHaveBeenCalled();
    });

    it("não grava quando o aniversário é inválido", async () => {
      const update = vi
        .spyOn(mockAccountProvider, "updateProfile")
        .mockResolvedValue({} as CustomerProfile);
      await saveProfileAction(profileForm({ ...VALID, birthDate: "13 / 40" }));
      expect(update).not.toHaveBeenCalled();
    });

    it("não grava quando o primeiro nome está vazio", async () => {
      const update = vi
        .spyOn(mockAccountProvider, "updateProfile")
        .mockResolvedValue({} as CustomerProfile);
      await saveProfileAction(profileForm({ ...VALID, firstName: "   " }));
      expect(update).not.toHaveBeenCalled();
    });

    it("sign out encerra a sessão e volta para a home", async () => {
      const signOut = vi
        .spyOn(mockAccountProvider, "signOut")
        .mockResolvedValue();
      await expect(signOutAction()).rejects.toThrow("NEXT_REDIRECT /");
      expect(signOut).toHaveBeenCalled();
    });
  });

  describe("aniversário", () => {
    it("formata a data guardada como MM / DD", () => {
      expect(formatBirthday("1988-05-14")).toBe("05 / 14");
      expect(formatBirthday("--12-01")).toBe("12 / 01");
      expect(formatBirthday(undefined)).toBe("");
    });

    it("converte MM / DD para --MM-DD e aceita vazio", () => {
      expect(parseBirthday("5 / 4")).toBe("--05-04");
      expect(parseBirthday("  ")).toBeUndefined();
      expect(parseBirthday("13 / 1")).toBeNull();
      expect(parseBirthday("abc")).toBeNull();
    });
  });
});
