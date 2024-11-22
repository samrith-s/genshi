import { defineConfig } from "vitest/config";

export function vitestConfig() {
  return defineConfig({
    test: {
      reporters: [
        [
          "default",
          {
            outputFile: ".test/test-output.json",
          },
        ],
        [
          "html",
          {
            outputFile: ".test/html/index.html",
          },
        ],
      ],
      coverage: {
        provider: "v8",
        include: ["src/**"],
        exclude: ["src/**/index.ts", "**/example.ts", "**/*.decl.ts"],
        clean: true,
        reportsDirectory: ".test/coverage",
      },
    },
  });
}

export const DEFAULT_CONFIG = vitestConfig();

export default vitestConfig();
