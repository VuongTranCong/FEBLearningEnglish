(function () {
  var STORAGE_KEY = 'learnenglish_auth';

  function getConfig() {
    return typeof window.AUTH_CONFIG !== 'undefined' ? window.AUTH_CONFIG : { enabled: false };
  }

  function isLoggedIn() {
    return sessionStorage.getItem(STORAGE_KEY) === '1';
  }

  function setLoggedIn() {
    sessionStorage.setItem(STORAGE_KEY, '1');
  }

  function logout() {
    sessionStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  }

  function checkCredentials(username, password) {
    var config = getConfig();
    if (!config.users || !config.users.length) return false;
    for (var i = 0; i < config.users.length; i++) {
      if (config.users[i].username === username && config.users[i].password === password) {
        return true;
      }
    }
    return false;
  }

  function showLoginOverlay() {
    var overlay = document.createElement('div');
    overlay.id = 'auth-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', 'Đăng nhập');
    overlay.innerHTML = [
      '<div class="auth-box">',
      '  <h2 class="auth-title">Đăng nhập</h2>',
      '  <p class="auth-hint">Nhập tài khoản và mật khẩu để tiếp tục.</p>',
      '  <form id="auth-form" class="auth-form">',
      '    <label for="auth-username">Tài khoản</label>',
      '    <input type="text" id="auth-username" name="username" autocomplete="username" required autofocus>',
      '    <label for="auth-password">Mật khẩu</label>',
      '    <input type="password" id="auth-password" name="password" autocomplete="current-password" required>',
      '    <p id="auth-error" class="auth-error" style="display:none;"></p>',
      '    <button type="submit" class="auth-submit">Đăng nhập</button>',
      '  </form>',
      '</div>'
    ].join('');

    var style = document.createElement('style');
    style.textContent = [
      '#auth-overlay { position: fixed; inset: 0; z-index: 9999; background: rgba(30,41,59,0.85); display: flex; align-items: center; justify-content: center; padding: 1rem; }',
      '.auth-box { background: #fff; border-radius: 16px; padding: 2rem; max-width: 360px; width: 100%; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }',
      '.auth-title { font-size: 1.5rem; color: #1e293b; margin-bottom: 0.5rem; }',
      '.auth-hint { color: #64748b; font-size: 0.9rem; margin-bottom: 1.5rem; }',
      '.auth-form label { display: block; font-weight: 600; color: #334155; margin-bottom: 0.35rem; font-size: 0.9rem; }',
      '.auth-form input { width: 100%; padding: 0.65rem 0.75rem; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 1rem; margin-bottom: 1rem; box-sizing: border-box; }',
      '.auth-form input:focus { outline: none; border-color: #667eea; }',
      '.auth-error { color: #dc2626; font-size: 0.9rem; margin-bottom: 0.5rem; }',
      '.auth-submit { width: 100%; padding: 0.75rem 1rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; border: none; border-radius: 10px; font-size: 1rem; font-weight: 600; cursor: pointer; }',
      '.auth-submit:hover { opacity: 0.95; }',
      '.auth-logout { position: absolute; top: 1rem; right: 1rem; padding: 0.4rem 0.75rem; background: rgba(255,255,255,0.2); color: #fff; border: 1px solid rgba(255,255,255,0.4); border-radius: 8px; font-size: 0.85rem; cursor: pointer; text-decoration: none; }',
      '.auth-logout:hover { background: rgba(255,255,255,0.3); }'
    ].join('\n');
    document.head.appendChild(style);
    document.body.appendChild(overlay);

    var form = document.getElementById('auth-form');
    var errEl = document.getElementById('auth-error');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var user = document.getElementById('auth-username').value.trim();
      var pass = document.getElementById('auth-password').value;
      if (checkCredentials(user, pass)) {
        setLoggedIn();
        overlay.remove();
        addLogoutButton();
      } else {
        errEl.textContent = 'Sai tài khoản hoặc mật khẩu.';
        errEl.style.display = 'block';
      }
    });
  }

  function addLogoutButton() {
    if (!document.getElementById('auth-logout-btn')) {
      var btn = document.createElement('a');
      btn.id = 'auth-logout-btn';
      btn.href = '#';
      btn.className = 'auth-logout';
      btn.textContent = 'Đăng xuất';
      btn.addEventListener('click', function (e) { e.preventDefault(); logout(); });
      var header = document.querySelector('header');
      if (header) {
        header.style.position = 'relative';
        header.appendChild(btn);
      }
    }
  }

  function init() {
    var config = getConfig();
    if (!config.enabled) return;
    if (isLoggedIn()) {
      addLogoutButton();
      return;
    }
    showLoginOverlay();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.authLogout = logout;
})();
