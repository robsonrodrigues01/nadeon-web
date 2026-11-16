import type { Metadata } from "next";
import { Archivo, DM_Sans } from "next/font/google";
import { MarketProvider } from "@/lib/market/context";
import { SkipLink } from "@/components/layout/skip-link";
import "./globals.css";
import "../styles/tokens.css";

const archivo = Archivo({
  variable: "--font-archivo-next",
  subsets: ["latin"],
  axes: ["wdth"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans-next",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Nadeon Labs",
  description: "Cellular Longevity for Humans and Pets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${dmSans.variable} h-full antialiased`}
      data-theme="human"
    >
      <body className="min-h-full flex flex-col bg-bg text-fg">
        <SkipLink />
        <MarketProvider>{children}</MarketProvider>
      </body>
    </html>
  );
}
