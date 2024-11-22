import { viteConfig } from "../../vite.config";

export default viteConfig([import.meta.dirname, "src/create-store.ts"], {
  build: {
    rollupOptions: {
      external: ["react"],
    },
  },
});
