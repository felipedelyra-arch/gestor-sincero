import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

const raiz = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  test: { include: ["tests/**/*.test.ts", "src/**/*.test.ts"], exclude: ["tests/e2e/**", "node_modules/**"] },
  resolve: {
    alias: [
      { find: /^@content$/, replacement: raiz("./content/index.ts") },
      { find: /^@content\//, replacement: raiz("./content/") },
      { find: /^@config\//, replacement: raiz("./config/") },
      { find: /^@\//, replacement: raiz("./src/") },
    ],
  },
});
