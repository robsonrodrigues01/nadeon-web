// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import AboutPage, { generateMetadata } from "@/app/(shared)/about/page";

async function renderAbout() {
  render(await AboutPage());
  return document.body;
}

afterEach(() => cleanup());

describe("W2-25 /about metadata", () => {
  it("builds title and canonical path from lib/seo", async () => {
    const meta = await generateMetadata();
    expect(meta.title).toContain("About");
    expect(meta.title).toContain("Nadeon");
    expect(String(meta.alternates?.canonical)).toMatch(/\/about$/);
  });
});

describe("W2-25 /about content", () => {
  it("renders the design hero heading", async () => {
    await renderAbout();
    expect(
      screen.getByRole("heading", { level: 1, name: "Small lots. Big care." })
    ).toBeTruthy();
  });

  it("renders the design section headings", async () => {
    await renderAbout();
    for (const name of [
      "Made by people who read labels",
      "Six things we never skip",
      "Make NAD + support simple, honest and easy to verify.",
      "What we stand for",
      "From raw material to jar",
      "For people and pets",
      "Ready to try Nadeon?",
    ]) {
      expect(screen.getByRole("heading", { name })).toBeTruthy();
    }
  });

  it("lists the human and pet products from the catalog provider", async () => {
    const body = await renderAbout();
    for (const name of [
      "BioHack",
      "Full Charge",
      "Renew",
      "Glow",
      "More Good Years",
      "Golden Years",
      "Still Sharp",
      "Shine On",
    ]) {
      expect(within(body).getAllByText(name).length).toBeGreaterThan(0);
    }
  });

  it("shows the pet notice and the FDA disclaimer", async () => {
    await renderAbout();
    expect(
      screen.getByText(
        "For animal use only. Equine products: not for horses intended for food."
      )
    ).toBeTruthy();
    expect(
      screen.getAllByText(/These statements have not been evaluated/).length
    ).toBeGreaterThan(0);
  });

  it("renders the sixth board-backed quality item", async () => {
    await renderAbout();
    expect(
      screen.getByRole("heading", { name: "NMN purity ≥99%" })
    ).toBeTruthy();
    expect(
      screen.getByText("Purity confirmed on each lot report.")
    ).toBeTruthy();
  });

  it("does not render design placeholders or fixed example text", async () => {
    const body = await renderAbout();
    const text = body.textContent ?? "";
    expect(text).not.toContain("[X]");
    expect(text).not.toContain("$XX");
    expect(text).not.toContain("(example)");
    expect(text).not.toContain("Lab photo goes here");
  });

  it("does not hard-code a dollar price in the route content", async () => {
    await renderAbout();
    // Barra de anúncio e rodapé são componentes compartilhados; checamos só o conteúdo desta rota.
    const main = document.querySelector("main")!;
    expect(main.textContent).not.toMatch(/\$\d/);
  });
});

describe("W2-25 /about buttons and fields (catalog 5.7)", () => {
  const main = () => document.querySelector("main") as HTMLElement;

  const links: Array<[string, string]> = [
    ["Shop the human line", "/human/shop"],
    ["Shop for pets", "/pet"],
    ["See our lab results", "/lab-results"],
    ["Visit Nadeon Human →", "/human"],
    ["Visit Nadeon Pet →", "/pet"],
  ];

  for (const [name, href] of links) {
    it(`"${name}" is a link (<a>) to ${href}`, async () => {
      await renderAbout();
      const link = within(main()).getByRole("link", { name });
      expect(link.tagName).toBe("A");
      expect(link.getAttribute("href")).toBe(href);
    });
  }

  it('vitrines "Shop Human" and "Shop Pet" are links', async () => {
    await renderAbout();
    const shopHuman = within(main()).getByRole("link", { name: "Shop Human" });
    const shopPet = within(main()).getByRole("link", { name: "Shop Pet" });
    expect(shopHuman.getAttribute("href")).toBe("/human");
    expect(shopPet.getAttribute("href")).toBe("/pet");
  });

  it("newsletter field is a labelled input", async () => {
    await renderAbout();
    const inputs = screen.getAllByLabelText(/email address/i);
    expect(inputs.length).toBeGreaterThan(0);
    for (const input of inputs) expect(input.tagName).toBe("INPUT");
  });
});
