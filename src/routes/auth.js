const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv').config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRES = '7d';

// Register user
router.post('/register', async (req, res) => {
  const { phone, full_name, email, password } = req.body;
  if (!phone || !password) return res.status(400).json({ error: 'Phone and password required' });

  try {
    const hashed = await bcrypt.hash(password, 10);
    const result = await db.query(
      `INSERT INTO public.users (phone, full_name, email, password_hash, role, is_active) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, phone, full_name, email, role`,
      [phone, full_name || null, email || null, hashed, 'customer', true]
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, phone: user.phone, role: 'customer' }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.json({ token, user });
  } catch (err) {
    console.error('Register error', err);
    res.status(500).json({ error: 'Unable to register' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) return res.status(400).json({ error: 'Phone and password required' });

  try {
    const result = await db.query('SELECT id, phone, password_hash, full_name, email, role FROM public.users WHERE phone = $1', [phone]);
    if (result.rows.length === 0) return res.status(400).json({ error: 'Invalid credentials' });
    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash || '');
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, phone: user.phone, role: user.role || 'customer' }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.json({ token, user: { id: user.id, phone: user.phone, full_name: user.full_name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ error: 'Unable to login' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.json({ user: null });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const result = await db.query('SELECT id, phone, full_name, email, role FROM public.users WHERE id = $1', [payload.id]);
    if (result.rows.length === 0) return res.json({ user: null });
    res.json({ user: result.rows[0] });
  } catch (err) {
    res.json({ user: null });
  }
});

module.exports = router;
