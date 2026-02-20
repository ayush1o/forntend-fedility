const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/add', requireAuth, (req, res) => {
  const { review_text } = req.body;

  if (!review_text || !review_text.trim()) {
    return res.status(400).json({ message: 'review_text is required' });
  }

  db.run(
    'INSERT INTO reviews (user_id, review_text) VALUES (?, ?)',
    [req.user.id, review_text.trim()],
    function (err) {
      if (err) {
        console.error('Review insert failed', err.message);
        return res.status(500).json({ message: 'unable to save review' });
      }
      console.log(`✅ Review added by user ${req.user.id}`);
      return res.status(201).json({ message: 'Commission Earned 💰', reviewId: this.lastID });
    }
  );
});

router.get('/user', requireAuth, (req, res) => {
  db.all(
    'SELECT id, review_text, created_at FROM reviews WHERE user_id = ? ORDER BY id DESC',
    [req.user.id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: 'unable to fetch reviews' });
      }
      return res.json({ reviews: rows });
    }
  );
});

module.exports = router;
