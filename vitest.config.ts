import { InlineConfig } from "vitest";
import { defineConfig } from "vitest/config";

const CI = process.env.CI === "true";

const reporters: InlineConfig["reporters"] = [
  [
    "default",
    {
      outputFile: ".test/test-output.json",
      includeConsoleOutput: false,
    },
  ],
];

!CI &&
  reporters.push([
    "html",
    {
      outputFile: ".test/html/index.html",
    },
  ]);

export function vitestConfig(config?: InlineConfig) {
  return defineConfig({
    test: {
      reporters,
      ...config,
      coverage: {
        ...config?.coverage,
        provider: "v8",
        include: ["src/**"],
        exclude: [
          "src/**/index.ts",
          "**/example.ts",
          "**/*.decl.ts",
          ...(config?.coverage?.exclude || []),
        ],
        clean: true,
        reportsDirectory: ".test/coverage",
      },
    },
  });
}

export const DEFAULT_CONFIG = vitestConfig();

export default vitestConfig();
