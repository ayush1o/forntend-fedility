const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'password must be at least 6 characters' });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    db.run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name.trim(), email.trim().toLowerCase(), hash],
      function (err) {
        if (err) {
          console.error('Signup failed', err.message);
          if (err.message.includes('UNIQUE')) {
            return res.status(409).json({ message: 'email already exists' });
          }
          return res.status(500).json({ message: 'unable to signup' });
        }
        console.log(`✅ User signed up: ${email}`);
        return res.status(201).json({ message: 'signup successful' });
      }
    );
  } catch (error) {
    return res.status(500).json({ message: 'unable to signup' });
  }
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email.trim().toLowerCase()], async (err, user) => {
    if (err) {
      console.error('Login query failed', err.message);
      return res.status(500).json({ message: 'unable to login' });
    }

    if (!user) {
      return res.status(401).json({ message: 'invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET || 'fidelity-secret-key',
      { expiresIn: '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });

    console.log(`✅ User logged in: ${email}`);
    return res.json({
      message: 'login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  });
});

router.get('/me', requireAuth, (req, res) => {
  db.get('SELECT id, name, email FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err) return res.status(500).json({ message: 'unable to fetch profile' });
    if (!user) return res.status(404).json({ message: 'user not found' });

    res.json({ user });
  });
});

router.post('/logout', (_req, res) => {
  res.clearCookie('token');
  console.log('✅ User logged out');
  return res.json({ message: 'logout successful' });
});

module.exports = router;
