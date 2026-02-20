const loginForm = document.getElementById('loginForm');
const errorMsg = document.getElementById('errorMsg');

(async () => {
  try {
    await window.apiFetch('/api/auth/me');
    window.location.href = 'dashboard.html';
  } catch (_err) {}
})();

loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorMsg.textContent = '';

  const payload = {
    email: document.getElementById('email').value.trim(),
    password: document.getElementById('password').value,
  };

  try {
    const result = await window.apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    localStorage.setItem('token', result.token);
    window.location.href = 'dashboard.html';
  } catch (err) {
    errorMsg.textContent = err.message;
  }
});
