import type { NextConfig } from "next";
import { getSecurityHeaders, legacyRedirects } from "./src/config/http";

const securityHeaders = getSecurityHeaders(process.env.NODE_ENV === "development");

const nextConfig: NextConfig = {
  async redirects() {
    return legacyRedirects.map((redirect) => ({ ...redirect }));
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders.map((header) => ({ ...header })),
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
    ],
  },
};

export default nextConfig;
