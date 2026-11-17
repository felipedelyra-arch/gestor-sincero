import { defineConfig, devices } from "@playwright/test";

// Papo reto: specs próprios (fora de tests/e2e para não misturar com a suíte da landing).
// 1 worker, chromium sem interface. O servidor sobe por scripts/servidor.sh, nunca por aqui.
export default defineConfig({
  testDir: ".",
  testMatch: /.*\.spec\.ts/,
  workers: 1,
  fullyParallel: false,
  reporter: "line",
  outputDir: "../../test-results/papo-reto",
  use: { baseURL: "http://localhost:3000", headless: true },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
