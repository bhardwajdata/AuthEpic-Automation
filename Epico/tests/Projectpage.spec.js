import { expect, test } from '@playwright/test';

test.describe('Full Page UI Verification', () => {
  test('Project Page UI Verification', async ({ page }) => {
    await page.goto('/project/card');
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL('/project/card');
    console.log('Url page found!');

    const projectName = page.locator('//span[text()="Mocingbird"]');
    await expect(projectName).toBeVisible();
    await expect(projectName).toHaveText('Mocingbird');
    console.log('Project Page Verified!');

    await projectName.click();
    console.log('Project page opened!');
    const Description = page.locator('//span[text()="Description"]');
    await expect(Description).toHaveText('Description');
    console.log("Page Verified!");
  });

  test('Mentee Page UI Verification', async ({ page }) => {
    await page.goto('/mentees/direct');
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL('/mentees/direct');
    console.log('Mentee page opened!')

    const MName = page.locator('(//div[@class="w-full overflow-hidden truncate MuiBox-root css-0"])[3]');
    await expect(MName).toHaveText('Nikeeta Soni');
    console.log('Mentee Name Verified!')

    const MEmail = page.locator('(//div[@class="w-full overflow-hidden truncate MuiBox-root css-0"])[4]');
    await expect(MEmail).toHaveText('nikeeta.soni@mindbowser.com');
    console.log('Mentee mail verified!');
  });

  test('Inbox Page UI Verification', async ({ page }) => {
    await page.goto('/inbox/monthly');
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL('/inbox/monthly');
    console.log('Inbox page opened!');
    /*
        await expect(page.getByText('To-do')).toBeVisible();
        await expect(page.getByRole('main')).toMatchAriaSnapshot(`- text: No results found!`);
        console.log('To-do tab verified!');
        */

    page.getByRole('combobox', { name: 'To-do' }).click();
    await page.getByRole('option', { name: 'Submitted' }).click();
    console.log('Submitted option selected!');

    await expect(page.getByRole('main')).toContainText('Monthly Feedback');
    await expect(page.getByRole('main')).toContainText('Mentee: Nikeeta Soni');
    console.log('Mentee verified!');

    await expect(page.getByRole('main')).toContainText('Hi Suraj , form submission successful. Thank you, we appreciate your time and effort');
    console.log('Feedback text verified!');

    await page.getByRole('combobox', { name: 'Submitted' }).click();
    await page.getByRole('option', { name: 'Ignored' }).click();
    await expect(page.getByRole('main')).toContainText('No results found!');
    console.log('Ignored tab verified!');

    page.locator('div').filter({ hasText: /^Project$/ }).click();
    await expect(page.getByRole('main')).toContainText('No results found!');
    console.log('Project filter verified!');

    await page.locator('div').filter({ hasText: /^WFH$/ }).click();
    await expect(page.getByRole('main')).toContainText('No results found!');
    console.log('WFH filter verified!');

  });

  test('Goals Page UI Verification', async ({ page }) => {
    await page.goto('/goals/13/2025/QUARTER_THREE');
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL('/goals/13/2025/QUARTER_THREE');
    console.log('Goals page opened!');

    /* await expect(page.getByRole('main')).toContainText('Total Weightage : 100');
    console.log('Total Weightage verified!');

     await expect(page.getByRole('main')).toContainText('Learning appium automation tool -');
    console.log('Goal Name verified!');

    await expect(page.getByRole('main')).toContainText('Not Submitted');
    console.log('Goal Status verified!'); */
  });

  test('WFH Page UI Verification', async ({ page }) => {
    await page.goto('/wfh-request');
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL('/wfh-request');
    console.log('WFH page opened!');

    await page.getByText('My Requests').click();
    await expect(page.getByRole('main')).toContainText('No results found!');
    console.log('My Requests tab verified!');

    await page.getByText('Summary').click();
    await expect(page.getByRole('main')).toContainText('Date');
    await expect(page.getByRole('main')).toContainText('Employee Name');
    console.log('Summary tab verified!');
  });

  test('Leave Page UI Verification', async ({ page }) => {
    await page.goto('/leave-request/summary');
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL('/leave-request/summary');
    console.log('Leave page opened!');

    await expect(page.getByRole('main')).toContainText('Employee Name');
    await expect(page.getByRole('main')).toContainText('Date');
    console.log('Leave Summary verified!');
  });

  test('LMS Page UI Verification', async ({ page }) => {
    await page.goto('/learning-bot/lms');
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL('/learning-bot/lms');
    console.log('LMS page opened!');

    await page.waitForTimeout(7000);
    await expect(page.getByRole('main')).toContainText('No courses assigned or complete at least one course to proceed.');
    console.log('LMS verified!');
  });

  test('Meetings Page UI Verification', async ({ page }) => {
    await page.goto('/meeting');
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL('/meeting');
    console.log('Meetings page opened!');

    await page.getByRole('link', { name: 'invoice-icon Meetings' }).click();
    await expect(page.getByRole('img', { name: 'DataNotFound' })).toBeVisible();
    console.log('Meetings verified!');

    await page.getByRole('button', { name: 'card view' }).click();
    await expect(page.getByRole('img', { name: 'DataNotFound' })).toBeVisible();
    console.log('Meetings card view verified!');
  });

  test('Dashboard Page UI Verification', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');
    expect(page).toHaveURL('/dashboard');
    console.log('Dashboard page opened!');

    const AwardsWidget = page.locator('//span[text()="Award - Nominations"]');
    await expect(AwardsWidget).toBeVisible();
    console.log('Awards Nomination verified!');

    const NominationButton = page.locator('//span[text()="Nominate"]');
    await expect(NominationButton).toBeEnabled();

    await expect(page.getByRole('img', { name: 'DataNotFound' })).toBeVisible();
    console.log('Nomination card view verified!');
  });

});