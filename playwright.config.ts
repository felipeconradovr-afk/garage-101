import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests", timeout: 60000, fullyParallel: true,
  forbidOnly: Boolean(process.env.CI), retries: process.env.CI ? 1 : 0,
  workers: 2, reporter: [["list"], ["html", { open: "never" }]],
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3101", trace: "retain-on-failure", screenshot: "only-on-failure", reducedMotion: "reduce" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"], channel: process.env.PLAYWRIGHT_CHANNEL } }],
  webServer: { command: "npm run dev -- --port 3101", url: "http://127.0.0.1:3101", reuseExistingServer: !process.env.CI, timeout: 120000 },
});