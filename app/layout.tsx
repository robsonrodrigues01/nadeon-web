import type { Metadata } from "next";
import { Archivo, DM_Sans } from "next/font/google";
import { MarketProvider } from "@/lib/market/context";
import { getVisitorMarket } from "@/lib/market/visitor";
import "./globals.css";
import "../styles/tokens.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Nadeon Labs",
  description: "Cellular Longevity for Humans and Pets",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialMarket = await getVisitorMarket();

  return (
    <html
      lang="en"
      className={`${archivo.variable} ${dmSans.variable} h-full antialiased`}
      data-theme="human"
    >
      <body className="min-h-full flex flex-col bg-bg text-fg">
        <MarketProvider initialMarket={initialMarket}>
          {children}
        </MarketProvider>
      </body>
    </html>
  );
}
