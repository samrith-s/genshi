/* eslint-disable no-undef */
import { resolve } from "path";

import { defineConfig } from "vite";
import dtsPlugin from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dtsPlugin({
      outDir: "lib/types",
      exclude: "**/__tests__",
    }),
  ],
  build: {
    outDir: "lib",
    minify: false,
    reportCompressedSize: true,
    terserOptions: {
      compress: true,
    },
    lib: {
      name: "Hali",
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es", "cjs"],
      fileName: "index",
    },
  },
});
