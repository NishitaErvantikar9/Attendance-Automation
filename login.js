// login.js OR logout.js
require('dotenv').config();
const { chromium } = require('playwright');
const { takeScreenshot, sendMail } = require('./utils');


async function performAttendance(actionButtonSelector, actionName) {

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  const attendanceUrl = 'https://www.peopleworks.ind.in/';

  await page.goto(attendanceUrl, { waitUntil: 'networkidle' });



  console.log('Filling username:', process.env.shUSERNAME);
  await page.fill('#userId', process.env.shUSERNAME);
  await page.press('#userId', 'Enter');
  await page.locator('#userId').blur();

  // Wait for Continue to be enabled
  await page.waitForFunction(() => {
    const btn = document.querySelector('#validateUser');
    return btn && !btn.disabled;
  });




  // Wait for password field to appear (AJAX — no full navigation!)
  console.log('Waiting for password field...');
  const pwdVisible = await page.waitForSelector('#pwd', { timeout: 15000 }).catch(() => null);

  if (!pwdVisible) {
    console.log('❌ Password field did not appear. Something went wrong.');
    await browser.close();
    return;
  }


  await page.fill('#pwd', process.env.shPASSWORD);

 await page.press('#Markatt', 'Enter');

  await page.waitForLoadState('networkidle');
 // Small delay to allow UI to render
 await page.waitForTimeout(1000);

// Try to find the login (start day) button
const loginBtn = await page.$(actionButtonSelector);

if (loginBtn) {
  const isVisible = await loginBtn.isVisible();
  const hasDisabledClass = await loginBtn.evaluate(node =>
    node.classList.contains('pw-btn-disabled')
  );

  console.log(`Login button visible: ${isVisible}, has 'pw-btn-disabled' class: ${hasDisabledClass}`);

  if (isVisible && !hasDisabledClass) {
    console.log('🟢 Login (Start Day) button is visible and enabled. Clicking it...');
    await loginBtn.click();
    console.log('✅ Successfully started your day (logged in).');
  } else {
    console.log('ℹ️ Start Day button found, but it\'s either hidden or disabled (maybe already logged in).');
    await page.screenshot({ path: 'already-logged-in.png', fullPage: true });
    console.log('📸 Screenshot saved: already-logged-in.png');
    await browser.close();
    return;
  }
} else {
  console.log('❌ Start Day button not found.');
}

};
// For login:
if (require.main === module) {
  performAttendance('#divStartDay', 'Login');  // <-- login button id and label
}


//   try {
//     await page.goto('https://www.peopleworks.ind.in/', { waitUntil: 'networkidle' });
//     console.log('Page loaded.');

//     await page.fill('#userId', process.env.shUSERNAME);
//     await page.press('#userId', 'Enter');
//     await page.locator('#userId').blur();

//     await page.waitForFunction(() => {
//       const btn = document.querySelector('#validateUser');
//       return btn && !btn.disabled;
//     });
//     console.log('Continue button enabled.');

//     await page.click('#validateUser');
//     console.log('Clicked Continue.');

//     const pwdVisible = await page.waitForSelector('#pwd', { timeout: 15000 }).catch(() => null);
//     if (!pwdVisible) {
//       throw new Error('Password field did not appear.');
//     }

//     await page.fill('#pwd', process.env.shPASSWORD);
//     console.log('Password filled.');

//     // Detect error message (password expired or invalid login)
//     const errorLocator = page.locator('.validation-summary-errors, .error-msg, .alert-danger');
//     if (await errorLocator.isVisible()) {
//       const errorText = await errorLocator.textContent();
//       console.log('❌ Login error detected:', errorText);
//       const screenshotPath = await takeScreenshot(page, `${actionName}-failed`);
//       await sendMail({
//         subject: `🚨 Attendance ${actionName} Failed - Password Expired or Login Error`,
//         body: `Error message:\n${errorText}`,
//         attachmentPath: screenshotPath
//       });
//       await browser.close();
//       return;
//     }

//     // Wait for action button (Login or Logout) to be enabled
//     await page.waitForFunction(selector => {
//       const btn = document.querySelector(selector);
//       return btn && !btn.disabled;
//     }, actionButtonSelector);

//     console.log(`Clicking ${actionName} button...`);
//     await page.click(actionButtonSelector);

//     await page.waitForLoadState('networkidle');
//     console.log(`✅ Attendance ${actionName} successful.`);

//     const screenshotPath = await takeScreenshot(page, `${actionName}-success`);
//     await sendMail({
//       subject: `✅ Attendance ${actionName} Successful`,
//       body: `Attendance ${actionName} was marked successfully.`,
//       attachmentPath: screenshotPath
//     });

//   } catch (err) {
//     console.error('❌ Error during attendance:', err.message);
//     const screenshotPath = await takeScreenshot(page, `${actionName}-error`);
//     await sendMail({
//       subject: `🚨 Attendance ${actionName} Script Error`,
//       body: `An error occurred:\n${err.message}`,
//       attachmentPath: screenshotPath
//     });
//   } finally {
//     await browser.close();
//   }
// }

// // For login:
// if (require.main === module) {
//   performAttendance('#Markatt', 'Login');  // <-- login button id and label
// }

module.exports = performAttendance;
