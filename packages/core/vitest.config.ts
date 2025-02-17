import { vitestConfig } from "../../vitest.config";

export default vitestConfig({
  coverage: {
    exclude: ["src/config.ts"],
  },
});
