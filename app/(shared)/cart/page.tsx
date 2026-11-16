import React from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { catalogProvider } from "@/lib/providers";
import { buildMetadata } from "@/lib/seo";
import { MARKET_COOKIE_NAME, MarketProvider } from "@/lib/market";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { TrustStrip } from "@/components/brand/trust-strip";
import { Newsletter } from "@/components/brand/newsletter";
import { Footer } from "@/components/layout/footer";
import { CartView } from "./_components/cart-view";
import { toCartCatalogProduct } from "./_components/types";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Cart | Nadeon Labs",
    pathname: "/cart",
    noIndex: true,
  });
}

export default async function CartPage() {
  // Mercado escolhido pelo cliente, lido do cookie para o SSR bater com o navegador.
  const marketId = (await cookies()).get(MARKET_COOKIE_NAME)?.value;
  const [products, collection] = await Promise.all([
    catalogProvider.getProducts(),
    catalogProvider.getCollection(
      "dogs",
      {
        line: "pet",
        species: "dog",
      },
      "best-selling"
    ),
  ]);
  const bestSellers = collection?.products ?? [];
  const catalog = products.map(toCartCatalogProduct);
  const petBestSellers = bestSellers.map(toCartCatalogProduct);

  return (
    <>
      <AnnouncementBar line="human" />
      <Header variant="human" />

      <main id="main-content" className="flex-1" tabIndex={-1}>
        <MarketProvider initialMarket={marketId}>
          <CartView catalog={catalog} petBestSellers={petBestSellers} />
        </MarketProvider>
      </main>

      <TrustStrip line="human" />
      <Newsletter variant="human" />
      <Footer line="human" />
    </>
  );
}
