/** @vitest-environment jsdom */
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import EntrancePage from "@/app/(shared)/page";

afterEach(cleanup);

describe("W3-56 home landmark", () => {
  it("places the home link in a named navigation landmark", async () => {
    render(await EntrancePage());
    const navigation = screen.getByRole("navigation", {
      name: "Home",
    });

    expect(
      within(navigation)
        .getByRole("link", { name: "Nadeon Labs Homepage" })
        .getAttribute("href")
    ).toBe("/");
  });
});
