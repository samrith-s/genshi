/* eslint-disable no-undef */
import { resolve } from "path";

import { defineConfig } from "vite";
import dtsPlugin from "vite-plugin-dts";

export function viteConfig(path) {
  console.log("path:", path);
  return defineConfig({
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
        compress: false,
        mangle: false,
        keep_classnames: true,
        format: true,
      },
      rollupOptions: {
        preserveEntrySignatures: "allow-extension",
        cache: false,
      },
      lib: {
        name: "Hali",
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        entry: resolve(...path),
        formats: ["es", "cjs"],
        fileName: "index",
      },
    },
  });
}
