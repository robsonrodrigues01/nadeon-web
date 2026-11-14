import React from "react";
import type { Metadata } from "next";
import { catalogProvider } from "@/lib/providers";
import { buildMetadata } from "@/lib/seo";
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
  const products = await catalogProvider.getProducts({ line: "human" });
  const catalog = products.map(toCartCatalogProduct);

  return (
    <>
      <AnnouncementBar line="human" />
      <Header variant="human" />

      <main id="main-content" className="flex-1">
        <CartView catalog={catalog} />
      </main>

      <TrustStrip line="human" />
      <Newsletter variant="human" />
      <Footer line="human" />
    </>
  );
}
