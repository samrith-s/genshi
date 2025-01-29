import { viteConfig } from "../../vite.config";

export default viteConfig({
  entry: {
    immer: "./src/immer.ts",
  },
  build: {
    rollupOptions: {
      external: ["@genshi/core", "immer"],
    },
  },
});
