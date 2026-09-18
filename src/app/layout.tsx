import type { Metadata } from "next";
import { Noto_Sans_Georgian, Noto_Serif_Georgian } from "next/font/google";
import { Navigation } from "@/components/navigation/Navigation";
import { NavUIProvider } from "@/components/navigation/NavUIContext";
import { SiteEffects } from "@/components/effects/SiteEffects";
import { siteConfig } from "@/data/site";
import "./globals.css";

const editorial = Noto_Serif_Georgian({
  variable: "--font-editorial",
  subsets: ["georgian"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const ui = Noto_Sans_Georgian({
  variable: "--font-ui",
  subsets: ["georgian"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `ბოლო ზარი · ${siteConfig.className}`,
  description: siteConfig.tagline,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ka" className={`${editorial.variable} ${ui.variable}`}>
      <body className="min-h-screen bg-ivory font-ui text-charcoal antialiased">
        <NavUIProvider>
          <SiteEffects />
          <Navigation />
          <main>{children}</main>
        </NavUIProvider>
      </body>
    </html>
  );
}
