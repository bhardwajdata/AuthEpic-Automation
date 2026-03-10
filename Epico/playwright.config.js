// @ts-check
import { defineConfig, devices } from '@playwright/test';
import path from 'path';

export default defineConfig({
  testDir: './tests',
  timeout: 150000,

  // 🔐 GLOBAL AUTH SETUP
  globalSetup: './tests/setup.js',

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only */
  workers: process.env.CI ? 3 : 4,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  // reporter: 'html',

  reporter: [
    ['list'],
    ['playwright-smart-reporter', {
      outputFolder: 'test-results',
      filename: 'report.html',
      open: 'never'
    }]
  ],



  /* Shared settings */
  use: {
    /* Base URL (recommended) */
    baseURL: 'https://mindbowser.epico.ai',
    headless: true,

    /* 🔑 Reuse saved authenticated session */
    storageState: 'auth/user.json',

    /* Tracing */
    trace: 'on-first-retry',
    screenshot: 'on',
    video: 'retain-on-failure'
  },

  // @ts-ignore
  globalSetup: './tests/setup.js',

  /* Configure projects */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    /*
        {
          name: 'firefox',
          use: { ...devices['Desktop Firefox'] },
        },
    
        {
          name: 'webkit',
          use: { ...devices['Desktop Safari'] },
        },
    
        /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

