import { viteConfig } from "../../vite.config";

export default viteConfig([import.meta.dirname, "src/index.ts"], {
  build: {
    rollupOptions: {
      external: ["react"],
    },
  },
});
