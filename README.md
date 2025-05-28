# Attendance Automation

A simple Node.js automation script to log attendance on a website and send email notifications with screenshots. Designed to run scheduled tasks for login and logout at specified times.

---

## Features

- **Automated attendance login/logout** on a specified website.
- **Screenshot capture** of the login/logout status for verification.
- **Email notifications** with optional screenshot attachments.
- **Scheduled execution** using GitHub Actions cron workflows (e.g., 9 AM and 8 PM daily).
- **Error handling and reporting** via email.
- Easy configuration through environment variables.

---

## How it works

1. Script opens the attendance website and performs login/logout.
2. Captures a screenshot of the status page.
3. Sends an email with the screenshot as confirmation.
4. Deletes the screenshot after sending to keep storage clean.
5. Scheduled to run automatically via GitHub Actions.

---

## Setup

- Clone the repo.
- Add your credentials and email info in GitHub repository secrets.
- Configure scheduled runs via GitHub Actions workflow.
- Enjoy automated attendance logging and notifications without manual intervention.

---

## Technologies

- Node.js with [Playwright](https://github.com/playwright) for browser automation.
- [Nodemailer](https://nodemailer.com/about/) for email delivery.
- GitHub Actions for scheduling and CI.

---

## Notes

- Make sure to use an app-specific password if using Gmail with 2FA.
- Check your email spam folder if you don’t see notifications.
- Screenshots are temporary and deleted after emailing.

---

## License

MIT License

---

*Created by Nishita Ervantikar*
