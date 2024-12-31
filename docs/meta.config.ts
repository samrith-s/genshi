import type { StarlightUserConfig } from "@astrojs/starlight/types";

export const meta: (site: string) => StarlightUserConfig["head"] = (_site) => [
  {
    tag: "meta",
    attrs: {
      property: "og:image",
      content: "/banner.png",
    },
  },

  // Twitter
  {
    tag: "meta",
    attrs: {
      name: "twitter:card",
      content: "summary_large_image",
    },
  },
  {
    tag: "meta",
    attrs: {
      name: "twitter:image",
      content: "/banner.png",
    },
  },
];
