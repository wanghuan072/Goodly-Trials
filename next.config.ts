import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/wiki/gear/iron-sword-of-brawn", destination: "/wiki/gear/iron-sword", permanent: true },
      { source: "/wiki/gear/wand-of-wit", destination: "/wiki/gear/wand", permanent: true },
      { source: "/wiki/gear/boots-axe", destination: "/wiki/gear/boots-war-axe", permanent: true },
      { source: "/wiki/gear/bow-of-grace", destination: "/wiki/gear/bow", permanent: true },
      { source: "/wiki/gear/iron-shield-of-brawn", destination: "/wiki/gear/iron-shield", permanent: true },
      { source: "/wiki/gear/dignified-shield-of-balance", destination: "/wiki/gear", permanent: true },
      { source: "/wiki/gear/feather-charm-of-reflex", destination: "/wiki/gear", permanent: true },
      { source: "/wiki/gear/ruby-charm-of-wit", destination: "/wiki/gear", permanent: true },
      { source: "/wiki/gear/frostfall-of-lore", destination: "/wiki/gear", permanent: true },
      { source: "/wiki/gear/fire-palm-of-balance", destination: "/wiki/gear", permanent: true },
      { source: "/wiki/gear/thin-blood", destination: "/wiki/gear", permanent: true },
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
