import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

// Read from default .env file if available
dotenv.config();

/**
 * ParaBank Automation Configuration
 * Site: https://parabank.parasoft.com/parabank
 */
export default defineConfig({
  // Root directory where test files are located
  testDir: './tests',

  // Maximum time one test can run for (in milliseconds)
  timeout: 30 * 1000,

  // Assertion timeout
  expect: {
    timeout: 5000,
  },

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only, or set to 1 for local retries if desired
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI if needed, or customize worker count
  workers: process.env.CI ? 1 : undefined,

  // Reporter configuration: HTML report + list view in terminal
 reporter: [
    ['list'],
    [
      'html',
      {
        outputFolder: 'playwright-report',
        open: 'always',
      },
    ],
    [
      'allure-playwright',
      {
        outputFolder: 'allure-results',
        detail: true,
        suiteTitle: true,
      },
    ],
  ],

  // Shared settings for all projects below
  use: {
    // Base URL to use in actions like `await page.goto('/')` or API `request.get('/...')`
    baseURL: process.env.BASE_URL || 'https://parabank.parasoft.com/parabank/',



    // Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer
    trace: 'on-first-retry',

    // Capture screenshot only on failure
    screenshot: 'only-on-failure',

    // Record video only on failure
    video: 'retain-on-failure',

    // Ignore HTTPS errors if testing against local/staging environments
    ignoreHTTPSErrors: true,
  },

  // Configure projects for major browsers and test types (UI, API, Hybrid)
  projects: [
    // ----------------------------------------------------
    // Test Type Specific Projects (Run via npm run test:api / ui / hybrid)
    // ----------------------------------------------------
    {
      name: 'api-tests',
      testDir: './tests/api',
      use: {
        // Headless API context
        baseURL: process.env.BASE_URL || 'https://parabank.parasoft.com/parabank',
        extraHTTPHeaders: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      },
    },
    {
      name: 'ui-tests',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'hybrid-tests',
      testDir: './tests/hybrid',
      use: {
        ...devices['Desktop Chrome'],
      },
    },

    // ----------------------------------------------------
    // Cross-Browser UI Testing Projects
    // ----------------------------------------------------
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  // Folder for test artifacts such as screenshots, videos, traces, etc.
  outputDir: 'test-results/',
});
