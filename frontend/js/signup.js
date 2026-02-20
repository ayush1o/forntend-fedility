const signupForm = document.getElementById('signupForm');
const errorMsg = document.getElementById('errorMsg');

signupForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorMsg.textContent = '';

  const payload = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    password: document.getElementById('password').value,
  };

  try {
    await window.apiFetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    window.location.href = 'login.html';
  } catch (err) {
    errorMsg.textContent = err.message;
  }
});
