(async () => {
  const protectedPages = ['dashboard.html', 'profile.html', 'review.html'];
  const page = window.location.pathname.split('/').pop();

  if (!protectedPages.includes(page)) return;

  try {
    await window.apiFetch('/api/auth/me');
  } catch (_err) {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  }
})();
