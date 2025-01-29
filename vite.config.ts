import { defineConfig, UserConfig } from "vite";
import dtsPlugin from "vite-plugin-dts";

export function viteConfig(
  config: Partial<UserConfig> & {
    entry: Record<string, string> | string[] | string;
  }
) {
  return defineConfig({
    plugins: [
      dtsPlugin({
        entryRoot: "./src",
        outDir: "./lib/types",
        include: ["src/**/*.ts", "src/**/*.tsx"],
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
        name: "Genshi",
        formats: ["es", "cjs"],
        fileName:
          typeof config.entry === "object"
            ? (format, entryName) =>
                `${entryName}/index.${format == "es" ? "js" : format}`
            : undefined,
        ...config?.build?.lib,
        entry: config.entry,
      },
    },
  });
}

export default viteConfig({
  entry: {
    index: "",
  },
});
