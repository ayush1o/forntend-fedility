const logoutBtn = document.getElementById('logoutBtn');
const userName = document.getElementById('userName');

(async () => {
  try {
    const data = await window.apiFetch('/api/auth/me');
    userName.textContent = data.user.name;
  } catch (_err) {
    window.location.href = 'login.html';
  }
})();

logoutBtn?.addEventListener('click', async () => {
  await window.apiFetch('/api/auth/logout', { method: 'POST' });
  localStorage.removeItem('token');
  window.location.href = 'index.html';
});
