import { resolve } from "node:path";

import { viteConfig } from "../../vite.config";

export default viteConfig({
  entry: resolve(import.meta.dirname, "src/index.ts"),
  build: {
    rollupOptions: {
      external: ["react", "@genshi/core"],
    },
  },
});
