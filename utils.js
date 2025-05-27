// utils.js
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

async function takeScreenshot(page, name = 'screenshot') {
  const dir = 'screenshots';
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  const filePath = path.join(dir, `${name}.png`);
  await page.screenshot({ path: filePath });
  return filePath;
}

async function sendMail({ subject, body, attachmentPath = null }) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  });

  const mailOptions = {
    from: `"Attendance Bot" <${process.env.EMAIL_USER}>`,
    to: process.env.NOTIFY_EMAIL,
    subject,
    text: body,
    attachments: attachmentPath ? [{ filename: path.basename(attachmentPath), path: attachmentPath }] : []
  };

  await transporter.sendMail(mailOptions);
  console.log('📧 Email sent:', subject);
}

module.exports = { takeScreenshot, sendMail };
