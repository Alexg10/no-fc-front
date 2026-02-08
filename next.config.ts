import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n.ts");

const strapiUrl = process.env.STRAPI_URL || "";
const strapiHostname = strapiUrl.replace(/^https?:\/\//, "").split("/")[0];

const remotePatterns: Array<{
  protocol: "http" | "https";
  hostname: string;
  port?: string;
  pathname?: string;
}> = [
  {
    protocol: "https",
    hostname: "cdn.shopify.com",
  },
  {
    protocol: "http",
    hostname: "localhost",
    port: "1337",
    pathname: "/uploads/**",
  },
  // Pattern plus permissif pour localhost avec port
  {
    protocol: "http",
    hostname: "127.0.0.1",
    port: "1337",
    pathname: "/uploads/**",
  },
  {
    protocol: "https",
    hostname: "sacred-dream-4825ee1b28.strapiapp.com",
    pathname: "/uploads/**",
  },
  {
    protocol: "https",
    hostname: "sacred-dream-4825ee1b28.media.strapiapp.com",
    pathname: "/**",
  },
];

// Ajouter le domaine Strapi en production si configuré
if (strapiHostname && strapiHostname !== "localhost:1337") {
  const protocol = strapiUrl.startsWith("https") ? "https" : "http";
  remotePatterns.push({
    protocol,
    hostname: strapiHostname.split(":")[0],
    pathname: "/uploads/**",
  });
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default withNextIntl(nextConfig);
