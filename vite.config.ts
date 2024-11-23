/* eslint-disable no-undef */
import { resolve } from "path";

import { defineConfig, UserConfig } from "vite";
import dtsPlugin from "vite-plugin-dts";

export function viteConfig(path: string[], config?: UserConfig) {
  return defineConfig({
    plugins: [
      dtsPlugin({
        insertTypesEntry: true,
        outDir: "lib/types",
        include: ["src/**/*.ts", "src/**/*.tsx", "../core/src/**/*.ts"],
        exclude: ["**/__tests__", "**/example"],
      }),
      ...(config?.plugins || []),
    ],
    resolve: {
      preserveSymlinks: true,
    },
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
        external: [
          ...((config?.build?.rollupOptions?.external || []) as string[]),
        ],
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

export default viteConfig([]);
