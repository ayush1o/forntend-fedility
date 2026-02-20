const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/save', requireAuth, (req, res) => {
  const {
    account_holder,
    bank_name,
    branch_name,
    account_number,
    ifsc_code,
    upi_id,
  } = req.body;

  const values = [
    account_holder || '',
    bank_name || '',
    branch_name || '',
    account_number || '',
    ifsc_code || '',
    upi_id || '',
    req.user.id,
  ];

  const query = `
    INSERT INTO bank_details (account_holder, bank_name, branch_name, account_number, ifsc_code, upi_id, user_id, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(user_id) DO UPDATE SET
      account_holder=excluded.account_holder,
      bank_name=excluded.bank_name,
      branch_name=excluded.branch_name,
      account_number=excluded.account_number,
      ifsc_code=excluded.ifsc_code,
      upi_id=excluded.upi_id,
      updated_at=CURRENT_TIMESTAMP
  `;

  db.run(query, values, function (err) {
    if (err) {
      console.error('Profile save failed', err.message);
      return res.status(500).json({ message: 'unable to save bank details' });
    }

    console.log(`✅ Bank details saved for user ${req.user.id}`);
    return res.json({ message: 'bank details saved' });
  });
});

router.get('/me', requireAuth, (req, res) => {
  db.get('SELECT id, name, email FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err) return res.status(500).json({ message: 'unable to fetch user' });
    if (!user) return res.status(404).json({ message: 'user not found' });

    db.get('SELECT account_holder, bank_name, branch_name, account_number, ifsc_code, upi_id FROM bank_details WHERE user_id = ?', [req.user.id], (bankErr, bank) => {
      if (bankErr) return res.status(500).json({ message: 'unable to fetch bank details' });
      return res.json({ user, bank: bank || {} });
    });
  });
});

module.exports = router;
