import { defineConfig } from "vitest/config";

import { DEFAULT_CONFIG } from "../../vitest.config";

export default defineConfig({
  ...DEFAULT_CONFIG,
  test: {
    ...DEFAULT_CONFIG.test,
    environment: "jsdom",
  },
});
