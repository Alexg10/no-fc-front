import type { Metadata } from "next";
import "./globals.css";

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
    <html className="font-polymath">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/ort3gwg.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
