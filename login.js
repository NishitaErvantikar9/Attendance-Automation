require('dotenv').config();
const { chromium } = require('playwright');
const { takeScreenshot, sendMail } = require('./utils');

async function performAttendance(actionButtonSelector, actionName) {
  const browser = await chromium.launch({ headless: true }); // use headless: true in cron jobs
  const page = await browser.newPage();

  try {
    await page.goto('https://www.peopleworks.ind.in/', { waitUntil: 'networkidle' });

    await page.fill('#userId', process.env.shUSERNAME);
    await page.press('#userId', 'Enter');
    await page.locator('#userId').blur();

    await page.waitForFunction(() => {
      const btn = document.querySelector('#validateUser');
      return btn && !btn.disabled;
    });

    const pwdVisible = await page.waitForSelector('#pwd', { timeout: 15000 }).catch(() => null);
    if (!pwdVisible) throw new Error('Password field did not appear.');

    await page.fill('#pwd', process.env.shPASSWORD);
    await page.press('#Markatt', 'Enter');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const loginBtn = await page.$(actionButtonSelector);

    if (loginBtn) {
      const isVisible = await loginBtn.isVisible();
      const hasDisabledClass = await loginBtn.evaluate(node =>
        node.classList.contains('pw-btn-disabled')
      );

      console.log(`Login button visible: ${isVisible}, has 'pw-btn-disabled' class: ${hasDisabledClass}`);

      let message, screenshotPath;

      if (isVisible && !hasDisabledClass) {
        console.log('🟢 Clicking login button...');
        await loginBtn.click();
        message = `✅ Attendance ${actionName} successful.`;
        screenshotPath = await takeScreenshot(page, `${actionName}-success`);
      } else {
        message = `ℹ️ Attendance ${actionName} skipped. Button is disabled (already logged in?).`;
        screenshotPath = await takeScreenshot(page, `${actionName}-already-done`);
      }

      await sendMail({
        subject: `📅 AttendanceBot ${actionName} Status`,
        body: message,
        attachmentPath: screenshotPath
      });

    } else {
      const message = `❌ ${actionName} button not found.`;
      const screenshotPath = await takeScreenshot(page, `${actionName}-not-found`);
      await sendMail({
        subject: `🚨 Attendance ${actionName} Failed - Button Missing`,
        body: message,
        attachmentPath: screenshotPath
      });
    }

  } catch (err) {
    console.error(`❌ Error during ${actionName}:`, err.message);
    const screenshotPath = await takeScreenshot(page, `${actionName}-error`);
    await sendMail({
      subject: `🚨 Attendance ${actionName} Script Error`,
      body: `An error occurred during ${actionName}:\n\n${err.message}`,
      attachmentPath: screenshotPath
    });

  } finally {
    await browser.close();
  }
}

if (require.main === module) {
  performAttendance('#divStartDay', 'Login'); // or '#divEndDay', 'Logout'
}

module.exports = performAttendance;
