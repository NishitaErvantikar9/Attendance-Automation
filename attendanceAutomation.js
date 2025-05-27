

require('dotenv').config();
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  const attendanceUrl = 'https://www.peopleworks.ind.in/';
  console.log('Navigating to attendance page...');
  await page.goto(attendanceUrl, { waitUntil: 'networkidle' });

  console.log('Page loaded.');

  console.log('Filling username:', process.env.shUSERNAME);
  await page.fill('#userId', process.env.shUSERNAME);
  await page.press('#userId', 'Enter');
  await page.locator('#userId').blur();

  // Wait for Continue to be enabled
  await page.waitForFunction(() => {
    const btn = document.querySelector('#validateUser');
    return btn && !btn.disabled;
  });
  console.log('Continue button enabled.');

  // Click "Continue"
  console.log('Clicking "Continue"...');
//   await page.click('#validateUser');
  console.log('Clicked Continue.');

  // Wait for password field to appear (AJAX — no full navigation!)
  console.log('Waiting for password field...');
  const pwdVisible = await page.waitForSelector('#pwd', { timeout: 15000 }).catch(() => null);

  if (!pwdVisible) {
    console.log('❌ Password field did not appear. Something went wrong.');
    await browser.close();
    return;
  }

  console.log('Password field is now visible.');

  await page.fill('#pwd', process.env.shPASSWORD);
  console.log('Password filled.');

 await page.press('#Markatt', 'Enter');




  console.log('✅ Attendance marked.');

  await page.waitForLoadState('networkidle');
  await browser.close();
})();

