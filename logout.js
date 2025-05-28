// logout.js
const performAttendance = require('./login'); // reusing the same function

if (require.main === module) {
  performAttendance('#divEndDay', 'Logout');  // replace '#LogoutButtonId' with actual ID for logout button
}
