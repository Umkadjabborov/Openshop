const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT id, parent_id, name_uz, name_ru, slug FROM public.categories WHERE is_active = true ORDER BY sort_order, id');
    res.json(result.rows);
  } catch (err) {
    console.error('GET /categories error', err);
    res.status(500).json({ error: 'Unable to fetch categories' });
  }
});

module.exports = router;
