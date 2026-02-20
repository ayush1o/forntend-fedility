(async () => {
  try {
    await window.apiFetch('/api/auth/me');
    window.location.href = 'dashboard.html';
  } catch (_err) {
    // not logged in; keep buttons visible
  }
})();
