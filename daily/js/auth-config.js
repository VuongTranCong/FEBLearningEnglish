/**
 * Login gate config. Edit this file to enable/disable or change credentials.
 *
 * To DISABLE login (allow everyone): set enabled to false.
 * To change password: edit the users array (username + password).
 * Note: This is client-side only – for light access control, not real security.
 */
window.AUTH_CONFIG = {
  enabled: true,
  users: [
    { username: 'admin', password: '123' }
  ]
};
