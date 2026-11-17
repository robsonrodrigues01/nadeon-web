// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const {
  accountProviderMock,
  petProfileProviderMock,
  redirectMock,
  revalidateMock,
} = vi.hoisted(() => ({
  accountProviderMock: {
    getSession: vi.fn(),
    getCustomer: vi.fn(),
    signInUrl: vi.fn(),
  },
  petProfileProviderMock: {
    getPets: vi.fn(),
    savePet: vi.fn(),
    removePet: vi.fn(),
  },
  redirectMock: vi.fn((path: string) => {
    throw new Error(`REDIRECT:${path}`);
  }),
  revalidateMock: vi.fn(),
}));

vi.mock("@/lib/providers", () => ({
  accountProvider: accountProviderMock,
  petProfileProvider: petProfileProviderMock,
}));
vi.mock("next/navigation", () => ({ redirect: redirectMock }));
vi.mock("next/cache", () => ({ revalidatePath: revalidateMock }));
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => undefined }),
}));

import AccountPetsPage from "@/app/(account)/account/pets/page";
import {
  removePetAction,
  savePetAction,
} from "@/app/(account)/account/pets/_components/actions";

const owner = {
  id: "customer_TEST_owner",
  firstName: "TEST",
  lastName: "Owner",
  email: "owner@example.test",
};
const pet = {
  id: "pet_TEST_owned",
  name: "TEST Companion",
  species: "dog" as const,
  breed: "To be confirmed",
  concerns: [],
};

function form(values: Record<string, string>) {
  const data = new FormData();
  Object.entries(values).forEach(([key, value]) => data.set(key, value));
  return data;
}

beforeEach(() => {
  accountProviderMock.getSession.mockResolvedValue({
    accessToken: "TEST-token",
    expiresAt: "2099-01-01T00:00:00.000Z",
    customerId: owner.id,
  });
  accountProviderMock.getCustomer.mockResolvedValue(owner);
  accountProviderMock.signInUrl.mockResolvedValue("/account/login");
  petProfileProviderMock.getPets.mockResolvedValue([pet]);
  petProfileProviderMock.savePet.mockResolvedValue(pet);
  petProfileProviderMock.removePet.mockResolvedValue(undefined);
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("W5-09 /account/pets", () => {
  it("requires an authenticated account owner", async () => {
    accountProviderMock.getSession.mockResolvedValue(null);
    await expect(AccountPetsPage()).rejects.toThrow("REDIRECT:/account/login");
    expect(petProfileProviderMock.getPets).not.toHaveBeenCalled();
  });

  it("renders provider pet data without unconfirmed health or dose recommendations", async () => {
    render(await AccountPetsPage());

    expect(screen.getByRole("heading", { name: "My pets" })).toBeTruthy();
    expect(screen.getByText("TEST Companion")).toBeTruthy();
    expect(screen.getAllByText("To be confirmed").length).toBeGreaterThan(0);
    expect(
      screen.queryByText(/recommended for|daily dose|suggested dose/i)
    ).toBeNull();
    expect(petProfileProviderMock.getPets).toHaveBeenCalledOnce();
  });

  it("validates pet fields and only saves pets owned by the signed-in account", async () => {
    const invalid = await savePetAction(
      { status: "idle" },
      form({ name: "Test", species: "bird", breed: "Unknown" })
    );
    expect(invalid.status).toBe("invalid");
    expect(petProfileProviderMock.savePet).not.toHaveBeenCalled();

    accountProviderMock.getSession.mockResolvedValue(null);
    const unauthenticated = await savePetAction(
      { status: "idle" },
      form({ name: "TEST Pet", species: "cat", breed: "To be confirmed" })
    );
    expect(unauthenticated.status).toBe("error");
    expect(petProfileProviderMock.savePet).not.toHaveBeenCalled();
    accountProviderMock.getSession.mockResolvedValue({
      accessToken: "TEST-token",
      expiresAt: "2099-01-01T00:00:00.000Z",
      customerId: owner.id,
    });

    const foreign = await savePetAction(
      { status: "idle" },
      form({
        id: "pet_TEST_foreign",
        name: "Test",
        species: "cat",
        breed: "To be confirmed",
      })
    );
    expect(foreign.status).toBe("error");
    expect(petProfileProviderMock.savePet).not.toHaveBeenCalled();

    const saved = await savePetAction(
      { status: "idle" },
      form({ name: "TEST Added", species: "cat", breed: "To be confirmed" })
    );
    expect(saved.status).toBe("success");
    expect(petProfileProviderMock.savePet).toHaveBeenCalledWith({
      name: "TEST Added",
      species: "cat",
      breed: "To be confirmed",
      concerns: [],
    });
  });

  it("rejects unauthenticated and foreign-pet deletes before mutation", async () => {
    const removeSpy = petProfileProviderMock.removePet;
    accountProviderMock.getSession.mockResolvedValue(null);
    expect(
      await removePetAction({ status: "idle" }, form({ id: pet.id }))
    ).toMatchObject({ status: "error" });
    expect(removeSpy).not.toHaveBeenCalled();

    accountProviderMock.getSession.mockResolvedValue({
      accessToken: "TEST-token",
      expiresAt: "2099-01-01T00:00:00.000Z",
      customerId: owner.id,
    });
    expect(
      await removePetAction(
        { status: "idle" },
        form({ id: "pet_TEST_foreign" })
      )
    ).toMatchObject({ status: "error" });
    expect(removeSpy).not.toHaveBeenCalled();

    expect(
      await removePetAction({ status: "idle" }, form({ id: pet.id }))
    ).toMatchObject({ status: "success" });
    expect(removeSpy).toHaveBeenCalledWith(pet.id);
  });

  it("returns generic failures without logging pet data", async () => {
    petProfileProviderMock.savePet.mockRejectedValue(
      new Error(`storage failure for ${pet.name}`)
    );
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    const result = await savePetAction(
      { status: "idle" },
      form({ name: pet.name, species: pet.species, breed: pet.breed })
    );

    expect(result).toEqual({
      status: "error",
      message: "To be confirmed",
    });
    expect(consoleError).not.toHaveBeenCalled();
    expect(JSON.stringify(result)).not.toContain(pet.name);
  });
});
