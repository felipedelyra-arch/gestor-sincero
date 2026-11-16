import { defineConfig, devices } from "@playwright/test";

// Pouca memória: 1 worker, só chromium, sem interface. O servidor sobe por scripts/servidor.sh, nunca por aqui.
export default defineConfig({
  testDir: "tests/e2e",
  workers: 1,
  fullyParallel: false,
  reporter: "line",
  use: { baseURL: "http://localhost:3000", headless: true },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
