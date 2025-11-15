import { CartSheet } from "@/components/cart-sheet";
import { Footer } from "@/components/common/footer";
import { Header } from "@/components/common/header";
import { CartProvider } from "@/contexts/cart-context";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "NOFC - Votre boutique en ligne",
    template: "%s | NOFC",
  },
  description: "Découvrez notre sélection de produits de qualité",
  keywords: ["boutique en ligne", "e-commerce", "produits", "achat en ligne"],
  authors: [{ name: "NOFC" }],
  creator: "NOFC",
  publisher: "NOFC",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    siteName: "NOFC",
    title: "NOFC - Votre boutique en ligne",
    description: "Découvrez notre sélection de produits de qualité",
  },
  twitter: {
    card: "summary_large_image",
    title: "NOFC - Votre boutique en ligne",
    description: "Découvrez notre sélection de produits de qualité",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen flex-col`}
      >
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartSheet />
        </CartProvider>
      </body>
    </html>
  );
}
