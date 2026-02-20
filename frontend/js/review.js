const loadingText = document.getElementById('loadingText');
const reviewForm = document.getElementById('reviewForm');
const statusMsg = document.getElementById('statusMsg');
const reviewList = document.getElementById('reviewList');
const logoutBtn = document.getElementById('logoutBtn');

setTimeout(() => {
  loadingText.classList.add('hidden');
  reviewForm.classList.remove('hidden');
}, 2300);

async function loadReviews() {
  const data = await window.apiFetch('/api/review/user');
  reviewList.innerHTML = '';
  data.reviews.forEach((r) => {
    const li = document.createElement('li');
    li.textContent = `${r.review_text} (${new Date(r.created_at).toLocaleString()})`;
    reviewList.appendChild(li);
  });
}

reviewForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const review_text = document.getElementById('review_text').value.trim();

  try {
    const result = await window.apiFetch('/api/review/add', {
      method: 'POST',
      body: JSON.stringify({ review_text }),
    });

    statusMsg.className = 'success';
    statusMsg.textContent = result.message;
    reviewForm.reset();
    await loadReviews();
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

loadReviews();
