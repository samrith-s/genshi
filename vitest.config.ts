import { defineConfig } from "vitest/config";

export default defineConfig({
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
      include: ["src/**"],
      exclude: ["src/**/index.ts", "**/example.ts", "**/*.decl.ts"],
      clean: true,
      reportsDirectory: ".test/coverage",
    },
  },
});
