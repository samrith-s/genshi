import { exec } from "child_process";

import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";

export default defineConfig({
  input: ["src/index.ts"],
  output: {
    dir: "lib",
    compact: true,
    generatedCode: {
      arrowFunctions: true,
      constBindings: true,
      objectShorthand: true,
      reservedNamesAsProps: false,
    },
    preserveModules: true,
    preserveModulesRoot: ".",
  },
  cache: true,
  plugins: [
    {
      name: "delete-dist",
      resolveId: {
        order: "pre",
        handler() {
          exec("rm -rf lib");
        },
      },
    },
    typescript(),
  ],
});
