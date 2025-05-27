// logout.js
const performAttendance = require('./login'); // reusing the same function

if (require.main === module) {
  performAttendance('#LogoutButtonId', 'Logout');  // replace '#LogoutButtonId' with actual ID for logout button
}
