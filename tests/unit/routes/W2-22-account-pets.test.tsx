// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  cleanup,
  within,
  fireEvent,
} from "@testing-library/react";
import AccountSettingsPage from "@/app/(account)/account/settings/page";
import { savePetAction } from "@/app/(account)/account/settings/_components/actions";
import { mockAccountProvider } from "@/lib/providers/mock/account";
import { cartProvider } from "@/lib/providers/client";
import type { Cart, Pet } from "@/lib/contracts/account";

const redirectMock = vi.hoisted(() =>
  vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT ${url}`);
  })
);

vi.mock("next/navigation", () => ({ redirect: redirectMock }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => undefined }),
}));
vi.mock("@/components/layout/header", () => ({ Header: () => null }));
vi.mock("@/components/layout/footer", () => ({ Footer: () => null }));
vi.mock("@/components/layout/announcement-bar", () => ({
  AnnouncementBar: () => null,
}));

const MISO: Pet = {
  id: "pet_miso",
  name: "Miso",
  species: "cat",
  breed: "Domestic Shorthair",
  weightLbs: 9,
  activityLevel: "low",
  concerns: [],
};

async function renderPage() {
  const ui = await AccountSettingsPage();
  return render(ui);
}

function petsSection() {
  return screen.getByRole("region", { name: "My pets" });
}

describe("W2-22 /account/settings: perfil pet", () => {
  beforeEach(() => {
    redirectMock.mockClear();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("mostra o título, o texto de dose e os cards dos pets do provider", async () => {
    await renderPage();
    const section = petsSection();

    within(section).getByRole("heading", { level: 2, name: "My pets" });
    within(section).getByText(
      "Save each pet so we can suggest the right dose."
    );
    within(section).getByRole("heading", { level: 3, name: "Cooper" });
    within(section).getByText("Golden Retriever");
    within(section).getByText("68 lb");
    within(section).getByText("Activity: Moderate · Focus: Joint comfort");
    expect(within(section).getByText(/^\d+ yrs$/)).toBeTruthy();
  });

  it("cada pet tem Edit profile e Remove (desabilitado, sem contrato)", async () => {
    await renderPage();
    const section = petsSection();
    const edit = within(section).getByRole("button", { name: "Edit profile" });
    expect(edit.getAttribute("type")).toBe("button");
    expect(
      (
        within(section).getByRole("button", {
          name: "Remove",
        }) as HTMLButtonElement
      ).disabled
    ).toBe(true);
  });

  it("+ Add pet abre e fecha o formulário com todos os campos", async () => {
    await renderPage();
    const section = petsSection();
    const add = within(section).getByRole("button", { name: "+ Add pet" });
    expect(add.getAttribute("aria-expanded")).toBe("false");

    fireEvent.click(add);
    expect(add.getAttribute("aria-expanded")).toBe("true");
    within(section).getByRole("heading", { level: 3, name: "Add a pet" });
    within(section).getByText("All fields editable later");

    const name = within(section).getByRole("textbox", {
      name: "Pet name",
    }) as HTMLInputElement;
    expect(name.required).toBe(true);
    expect(name.value).toBe("");
    within(section).getByRole("textbox", { name: "Breed" });
    within(section).getByLabelText("Birth date (or best guess)");
    within(section).getByRole("spinbutton", { name: "Weight" });
    within(section).getByText("lb");
    within(section).getByText("Used to work out the suggested dose.");

    const upload = within(section).getByRole("button", {
      name: "Upload photo",
    }) as HTMLButtonElement;
    expect(upload.disabled).toBe(true);
    within(section).getByText("JPG or PNG");

    const species = within(section).getByRole("group", { name: "Species" });
    expect(
      (within(species).getByRole("radio", { name: "Dog" }) as HTMLInputElement)
        .checked
    ).toBe(true);
    ["Cat", "Horse"].forEach((label) =>
      within(species).getByRole("radio", { name: label })
    );

    const activity = within(section).getByRole("group", {
      name: "Activity level",
    });
    ["Low", "Moderate", "High"].forEach((label) =>
      within(activity).getByRole("radio", { name: label })
    );

    const focus = within(section).getByRole("group", {
      name: "Health focus (pick any)",
    });
    expect(
      within(focus).getAllByRole("checkbox").length
    ).toBeGreaterThanOrEqual(9);
    within(focus).getByRole("checkbox", { name: "Joints and mobility" });

    const save = within(section).getByRole("button", {
      name: "Save pet",
    }) as HTMLButtonElement;
    expect(save.type).toBe("submit");

    fireEvent.click(within(section).getByRole("button", { name: "Cancel" }));
    expect(add.getAttribute("aria-expanded")).toBe("false");
    expect(
      within(section).queryByRole("heading", { level: 3, name: "Add a pet" })
    ).toBeNull();
  });

  it("Edit profile preenche o formulário com o pet e mantém o foco salvo", async () => {
    await renderPage();
    const section = petsSection();
    fireEvent.click(
      within(section).getByRole("button", { name: "Edit profile" })
    );

    within(section).getByRole("heading", { level: 3, name: "Edit profile" });
    expect(
      (
        within(section).getByRole("textbox", {
          name: "Pet name",
        }) as HTMLInputElement
      ).value
    ).toBe("Cooper");
    expect(
      (
        within(section).getByRole("textbox", {
          name: "Breed",
        }) as HTMLInputElement
      ).value
    ).toBe("Golden Retriever");
    expect(
      (
        within(section).getByRole("spinbutton", {
          name: "Weight",
        }) as HTMLInputElement
      ).value
    ).toBe("68");
    expect(
      (
        within(section).getByLabelText(
          "Birth date (or best guess)"
        ) as HTMLInputElement
      ).value
    ).toBe("2019-06-15");
    expect(
      (
        within(section).getByRole("checkbox", {
          name: "Joint comfort",
        }) as HTMLInputElement
      ).checked
    ).toBe(true);
    expect(
      (
        within(section).getByRole("radio", {
          name: "Moderate",
        }) as HTMLInputElement
      ).checked
    ).toBe(true);
  });

  it("recomendações: produtos da espécie com preço do mercado e botão Add", async () => {
    await renderPage();
    const section = petsSection();
    const heading = within(section).getByRole("heading", {
      level: 3,
      name: "Recommended for Cooper",
    });
    expect(heading).toBeTruthy();
    within(section).getByText("Picked by weight");
    within(section).getByText(
      /Based on Cooper's weight \(68 lb\), age and health focus\./
    );
    within(section).getByText(/Suggested dose uses the weight you entered/);
    within(section).getByText(/For animal use only/);

    const addButtons = within(section).getAllByRole("button", {
      name: /^Add .* to cart$/,
    });
    expect(addButtons.length).toBeGreaterThan(0);
    // Preço vem do catálogo e é formatado pelo mercado (com símbolo de moeda gerado pelo Intl).
    expect(section.textContent).toMatch(/\$\d/);
  });

  it("Add de uma recomendação chama o cartProvider com a variante", async () => {
    const addLines = vi
      .spyOn(cartProvider, "addLines")
      .mockResolvedValue({} as Cart);
    await renderPage();
    const section = petsSection();
    const button = within(section).getAllByRole("button", {
      name: /^Add .* to cart$/,
    })[0];
    fireEvent.click(button);
    await vi.waitFor(() => expect(addLines).toHaveBeenCalledTimes(1));
    const [lines] = addLines.mock.calls[0];
    expect(lines).toHaveLength(1);
    expect(lines[0].quantity).toBe(1);
    expect(typeof lines[0].variantId).toBe("string");
  });

  it("Switch pet troca a recomendação para o outro pet", async () => {
    const [cooper] = await mockAccountProvider.getPets();
    vi.spyOn(mockAccountProvider, "getPets").mockResolvedValueOnce([
      cooper,
      MISO,
    ]);
    await renderPage();
    const section = petsSection();

    const switcher = within(section).getByRole("combobox", {
      name: "Switch pet",
    }) as HTMLSelectElement;
    expect(switcher.value).toBe(cooper.id);
    fireEvent.change(switcher, { target: { value: MISO.id } });

    within(section).getByRole("heading", {
      level: 3,
      name: "Recommended for Miso",
    });
    within(section).getByText(/Based on Miso's age and health focus\./);
  });

  it("não mostra Rewards em lugar nenhum da página", async () => {
    const { container } = await renderPage();
    expect(container.textContent ?? "").not.toMatch(/reward/i);
  });
});

describe("W2-22 savePetAction", () => {
  function petForm(values: Record<string, string | string[]>): FormData {
    const data = new FormData();
    for (const [key, value] of Object.entries(values)) {
      if (Array.isArray(value)) value.forEach((v) => data.append(key, v));
      else data.set(key, value);
    }
    return data;
  }

  const VALID = {
    name: "Cooper",
    species: "dog",
    breed: "Golden Retriever",
    birthDate: "2019-06-15",
    weightLbs: "68",
    activityLevel: "moderate",
    concerns: ["Joint comfort", "Healthy aging"],
    photoUrl: "/images/pets/cooper.webp",
  };

  it("salva o pet pelo provider e devolve true", async () => {
    const save = vi
      .spyOn(mockAccountProvider, "savePet")
      .mockResolvedValue({} as Pet);
    const ok = await savePetAction(petForm(VALID));
    expect(ok).toBe(true);
    expect(save).toHaveBeenCalledWith({
      name: "Cooper",
      species: "dog",
      breed: "Golden Retriever",
      birthDate: "2019-06-15",
      weightLbs: 68,
      activityLevel: "moderate",
      concerns: ["Joint comfort", "Healthy aging"],
      photoUrl: "/images/pets/cooper.webp",
    });
  });

  it("edição envia o id para atualizar o mesmo pet", async () => {
    const save = vi
      .spyOn(mockAccountProvider, "savePet")
      .mockResolvedValue({} as Pet);
    await savePetAction(petForm({ ...VALID, id: "pet_cooper" }));
    expect(save).toHaveBeenCalledWith(
      expect.objectContaining({ id: "pet_cooper" })
    );
  });

  it("não salva e devolve false sem nome, sem raça ou com espécie inválida", async () => {
    const save = vi
      .spyOn(mockAccountProvider, "savePet")
      .mockResolvedValue({} as Pet);
    expect(await savePetAction(petForm({ ...VALID, name: "" }))).toBe(false);
    expect(await savePetAction(petForm({ ...VALID, breed: "" }))).toBe(false);
    expect(await savePetAction(petForm({ ...VALID, species: "fish" }))).toBe(
      false
    );
    expect(save).not.toHaveBeenCalled();
  });

  it("peso vazio vira ausente, não zero", async () => {
    const save = vi
      .spyOn(mockAccountProvider, "savePet")
      .mockResolvedValue({} as Pet);
    await savePetAction(petForm({ ...VALID, weightLbs: "" }));
    expect(save.mock.calls[0][0].weightLbs).toBeUndefined();
  });
});
