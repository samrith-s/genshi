/* eslint-disable no-undef */
import { resolve } from "path";

import { defineConfig, UserConfig } from "vite";
import dtsPlugin from "vite-plugin-dts";

export function viteConfig(path: string[], config?: UserConfig) {
  return defineConfig({
    plugins: [
      dtsPlugin({
        outDir: "lib/types",
        include: ["src/**/*.ts", "src/**/*.tsx"],
        exclude: ["**/__tests__", "**/example"],
      }),
      ...(config?.plugins || []),
    ],
    build: {
      outDir: "lib",
      minify: false,
      reportCompressedSize: true,
      ...config?.build,
      terserOptions: {
        compress: false,
        mangle: false,
        keep_classnames: true,
        ...config?.build?.terserOptions,
      },
      rollupOptions: {
        preserveEntrySignatures: "allow-extension",
        cache: false,
        ...config?.build?.rollupOptions,
      },
      lib: {
        name: "Hali",
        formats: ["es", "cjs"],
        fileName: "index",
        ...config?.build?.lib,
        entry: resolve(...path),
      },
    },
  });
}
