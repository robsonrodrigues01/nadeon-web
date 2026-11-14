import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { existsSync } from "node:fs";
import path from "node:path";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { accountProvider, catalogProvider } from "@/lib/providers";
import { getDefaultMarket, getMarket } from "@/lib/market/markets";
import { MARKET_COOKIE_NAME } from "@/lib/market/cookies";
import { buildMetadata } from "@/lib/seo";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AccountNav } from "./_components/account-nav";
import { ProfileForm } from "./_components/profile-form";
import { AddressList } from "./_components/address-list";
import { DeleteAccount } from "./_components/delete-account";
import { PetsSection } from "./_components/pets-section";
import {
  concernChoices,
  petConcernOptions,
  toPetView,
  toProductView,
} from "./_components/pet-views";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Profile & addresses",
    pathname: "/account/settings",
    noIndex: true,
  });
}

// Mesma leitura de tema do layout da conta: cookie, padrão human.
async function readTheme(): Promise<"human" | "pet"> {
  try {
    const store = await cookies();
    const value = store.get("nadeon_theme")?.value ?? store.get("theme")?.value;
    return value === "pet" ? "pet" : "human";
  } catch {
    return "human";
  }
}

// Mercado escolhido pelo cliente, para formatar o preço das recomendações.
async function readMarket() {
  try {
    const store = await cookies();
    return (
      getMarket(store.get(MARKET_COOKIE_NAME)?.value) ?? getDefaultMarket()
    );
  } catch {
    return getDefaultMarket();
  }
}

// Só fotos que existem em /public são exibidas; as demais caem na inicial.
function publicFileExists(src: string): boolean {
  return existsSync(path.join(process.cwd(), "public", src));
}

export default async function AccountSettingsPage() {
  const theme = await readTheme();
  const market = await readMarket();
  const session = await accountProvider.getSession();
  const customer = session ? await accountProvider.getCustomer() : null;

  if (!session || !customer) {
    redirect(await accountProvider.signInUrl("/account/settings"));
  }

  const addresses = await accountProvider.getAddresses();
  const [pets, petProducts] = await Promise.all([
    accountProvider.getPets(),
    catalogProvider.getProducts({ line: "pet" }),
  ]);
  const now = new Date();
  const petViews = pets.map((pet) => toPetView(pet, now, publicFileExists));
  const productViews = petProducts
    .map(toProductView)
    .filter((view) => view !== null);

  return (
    <>
      <AnnouncementBar line={theme} />
      <Header variant={theme} />

      <main
        id="main-content"
        className="mx-auto w-full max-w-[1280px] flex-1 px-4 pb-16 pt-8 sm:px-8 lg:px-[72px] lg:pb-24 lg:pt-11"
      >
        <nav aria-label="Breadcrumb" className="text-sm text-fg/70">
          <ol className="flex flex-wrap gap-2">
            <li>
              <Link
                href="/account"
                className="inline-flex min-h-11 items-center rounded-sm hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Account
              </Link>
            </li>
            <li aria-hidden="true" className="flex items-center">
              /
            </li>
            <li aria-current="page" className="flex items-center text-fg">
              Profile
            </li>
          </ol>
        </nav>

        <h1 className="mt-2 font-archivo text-3xl font-extrabold uppercase leading-none tracking-tight text-fg sm:text-5xl">
          Profile &amp; addresses
        </h1>
        <p className="mt-3 text-base text-fg/75">
          Your details, where we ship and how we contact you.
        </p>

        <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-start">
          <AccountNav
            firstName={customer.firstName}
            lastName={customer.lastName}
          />

          <div className="flex min-w-0 flex-1 flex-col gap-6">
            <ProfileForm customer={customer} />
            <PetsSection
              pets={petViews}
              products={productViews}
              concernOptions={concernChoices(petConcernOptions(), pets)}
              market={market}
            />
            <AddressList addresses={addresses} />
            <DeleteAccount />
          </div>
        </div>
      </main>

      <Footer line={theme} />
    </>
  );
}
