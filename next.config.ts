import type { NextConfig } from "next";

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
  },
};

export default nextConfig;
