const fields = ['account_holder', 'bank_name', 'branch_name', 'account_number', 'ifsc_code', 'upi_id'];
const form = document.getElementById('bankForm');
const statusMsg = document.getElementById('statusMsg');
const logoutBtn = document.getElementById('logoutBtn');
const aboutBtn = document.getElementById('aboutBtn');
const helpBtn = document.getElementById('helpBtn');

async function loadProfile() {
  const data = await window.apiFetch('/api/profile/me');
  document.getElementById('name').textContent = data.user.name;
  document.getElementById('email').textContent = data.user.email;

  fields.forEach((id) => {
    document.getElementById(id).value = data.bank[id] || '';
  });
}

form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const payload = {};
  fields.forEach((id) => {
    payload[id] = document.getElementById(id).value.trim();
  });

  try {
    const result = await window.apiFetch('/api/profile/save', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    statusMsg.className = 'success';
    statusMsg.textContent = result.message;
  } catch (err) {
    statusMsg.className = '';
    statusMsg.textContent = err.message;
  }
});

logoutBtn?.addEventListener('click', async () => {
  await window.apiFetch('/api/auth/logout', { method: 'POST' });
  localStorage.removeItem('token');
  window.location.href = 'index.html';
});

aboutBtn?.addEventListener('click', () => alert('Fidelity Trading platform for secure investing.'));
helpBtn?.addEventListener('click', () => alert('Contact support@fidelity.local for help.'));

loadProfile();
