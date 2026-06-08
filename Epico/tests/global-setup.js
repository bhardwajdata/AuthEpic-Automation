const { chromium, expect } = require('@playwright/test');
const { ImapFlow } = require('imapflow');
const { simpleParser } = require('mailparser');

const APP_URL = process.env.EPICO_URL;
const EMAIL = process.env.EPICO_EMAIL_ADDRESS;
const EMAIL_PASS = process.env.EPICO_MAIL_APP_PASSWORD;

const OTP_SENDER_EMAIL = 'pm@mindbowser.com';

module.exports = async () => {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(APP_URL);

    await page.fill('input[id="email"]', EMAIL);

    await page.locator('//span[text()="Send OTP"]').click();

    const otp = await waitForOtp();

    console.log('OTP fetched successfully....')

    const inputs = page.locator('input[type="tel"]');

    for (let i = 0; i < otp.length; i++) {
        await inputs.nth(i).fill(otp[i]);
    }

    const verifyBtn = page.getByRole('button', { name: 'Verify' });
    await expect(verifyBtn).toBeVisible({ timeout: 60000 });
    await expect(verifyBtn).toBeEnabled({ timeout: 60000 });

    await verifyBtn.click();

    await page.waitForURL('**/project/card', { timeout: 60000 });
    await context.storageState({
        path: 'auth/user.json',
    });

    await browser.close();
};

async function waitForOtp(timeoutMs = 120000, interval = 2000) {
    const start = Date.now();

    while (Date.now() - start < timeoutMs) {
        const otp = await fetchLatestOtp();

        if (otp) return otp;

        await new Promise(r => setTimeout(r, interval));
    }

    throw new Error('OTP email was not received within 90 seconds');
}

async function fetchLatestOtp() {
    const client = new ImapFlow({
        host: 'imap.gmail.com',
        port: 993,
        secure: true,
        auth: {
            user: EMAIL,
            pass: EMAIL_PASS,
        },
        logger: false,
    });

    await client.connect();
    await client.mailboxOpen('INBOX');

    try {
        const lock = await client.getMailboxLock('INBOX');

        try {
            const total = client.mailbox.exists;
            if (!total) return null;

            const message = await client.fetchOne(total, {
                source: true,
            });

            if (!message?.source) return null;

            const parsed = await simpleParser(message.source);

            const fromEmail =
                parsed.from?.value?.[0]?.address?.toLowerCase() || '';

            if (!fromEmail.includes(OTP_SENDER_EMAIL)) {
                return null;
            }

            const body = `
                ${parsed.text || ''}
                ${parsed.html || ''}
            `.replace(/\s+/g, ' ');

            const otpMatch =
                body.match(/\b\d{6}\b/) ||
                body.replace(/\s/g, '').match(/\d{6}/);

            return otpMatch ? otpMatch[0] : null;

        } finally {
            lock.release();
        }

    } finally {
        await client.logout().catch(() => { });
    }
}