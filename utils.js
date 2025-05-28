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
  console.log('📧 Preparing to send email:', subject, process.env.EMAIL_USER, process.env.EMAIL_PASSWORD);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    }
  });

  const mailOptions = {
    from: `"Attendance Bot" <${process.env.EMAIL_USER}>`,
    to: process.env.NOTIFY_EMAIL,
    subject,
    text: body,
    attachments: attachmentPath
      ? [{ filename: path.basename(attachmentPath), path: attachmentPath }]
      : [],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('📧 Email sent:', subject);

    // ✅ Delete the attachment after successful email
    if (attachmentPath && fs.existsSync(attachmentPath)) {
      fs.unlinkSync(attachmentPath);
      console.log('🧹 Deleted screenshot:', attachmentPath);
    }
  } catch (err) {
    console.error('❌ Failed to send email:', err);
  }
}


module.exports = { takeScreenshot, sendMail };
