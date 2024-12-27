// @ts-check
import react from "@astrojs/react";
import starlight from "@astrojs/starlight";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  output: "static",
  integrations: [
    starlight({
      title: "Genshi",
      pagination: true,
      titleDelimiter: "/",
      description:
        "Simple, composable, and effective state management for JavaScript.",
      logo: {
        dark: "./src/assets/logo-dark.svg",
        light: "./src/assets/logo-light.svg",
        alt: "Genshi Logo",
        replacesTitle: true,
      },
      social: {
        github: "https://github.com/samrith-s/genshi",
      },
      sidebar: [
        {
          label: "Project",
          autogenerate: { directory: "project" },
        },
        {
          label: "Guides",
          autogenerate: {
            directory: "guides",
          },
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
      ],
      customCss: ["./src/tailwind.css", "@fontsource-variable/inter"],
    }),
    tailwind({ applyBaseStyles: false }),
    react(),
  ],
});
