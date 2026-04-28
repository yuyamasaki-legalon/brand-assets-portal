import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["scripts/**/*.test.ts", "eslint-rules/**/*.spec.js", "src/**/*.test.ts", "src/**/*.test.tsx"],
    globals: true,
  },
});
