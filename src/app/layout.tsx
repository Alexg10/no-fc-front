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
  title: "NOFC - Votre boutique en ligne",
  description: "Découvrez notre sélection de produits de qualité",
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
