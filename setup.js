import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const APP_URL = 'https://mindbowser.epico.ai/';
const AUTH_PATH = path.resolve(process.cwd(), 'auth/user.json');

export default async function setup() {
  if (fs.existsSync(AUTH_PATH)) {
    console.log('✅ Auth state found. Skipping login.');
    return;
  }

  console.log('🔐 Auth state not found. Starting manual login...');
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(APP_URL);
  console.log(' Wait until project page is visible.');

  try {
  await page.waitForURL('**/project/card', {
    timeout: 120000, 
  });
} catch {
  await browser.close();
  throw new Error('❌ Login not completed in time. Auth state not saved.');
}

  // Save authenticated state
  fs.mkdirSync(path.dirname(AUTH_PATH), { recursive: true });
  await context.storageState({ path: AUTH_PATH });

  await browser.close();
  console.log('✅ Auth state saved successfully.');
}
