# 🔄 PeopleWorks Attendance Automation Script

Automate your **PeopleWorks login and logout** (Start Day / End Day) process with this powerful script built using **Node.js** and **Playwright**.

> ✨ Perfect for developers and employees using the [PeopleWorks HRMS platform](https://www.peopleworks.in/) who want a hassle-free way to mark attendance.

---

## 📌 Features

- ✅ Automates **PeopleWorks login** ("Start Day") and logout ("End Day")
- 🧠 Detects if the **PeopleWorks button is already clicked or disabled**
- 📸 Takes screenshots of attendance state
- 📧 Sends you an email notification with screenshot (already included via `utils.js`)
- 🛡 Secure credentials via `.env` file
- 🧪 Built using **Playwright** for reliable browser automation

---

## 🚀 Setup & Usage

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/peopleworks-attendance-automation.git
cd peopleworks-attendance-automation
