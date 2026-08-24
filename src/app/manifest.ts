import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Goodly Trials Wiki",
    short_name: "Goodly Trials",
    description: "Goodly Trials units, gear, guides, editable builds, and patch changes for players.",
    start_url: "/",
    display: "standalone",
    background_color: "#0e0c09",
    theme_color: "#181410",
    icons: [{ src: "/icon.png", sizes: "32x32", type: "image/png", purpose: "any" }],
  };
}
