const express = require('express');
const db = require('../db');
const { requireAuth, authMiddleware } = require('../middleware/auth');
const router = express.Router();

router.use(authMiddleware);

// Create order (authenticated users)
router.post('/', requireAuth, async (req, res) => {
  const { items, delivery_name, delivery_phone, delivery_address, payment_method } = req.body;
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'No items' });

  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    // calculate subtotal
    let subtotal = 0;
    for (const it of items) {
      subtotal += Number(it.unit_price || 0) * Number(it.quantity || 0);
    }
    const total = subtotal; // no fees for now

    const orderInsert = `INSERT INTO public.orders (user_id, subtotal, total_amount, delivery_name, delivery_phone, delivery_address, payment_method) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`;
    const orderRes = await client.query(orderInsert, [req.user.id, subtotal, total, delivery_name || null, delivery_phone || null, delivery_address || null, payment_method || null]);
    const orderId = orderRes.rows[0].id;

    const insertItem = `INSERT INTO public.order_items (order_id, product_id, product_name, quantity, unit_price, total_price) VALUES ($1,$2,$3,$4,$5,$6)`;
    for (const it of items) {
      await client.query(insertItem, [orderId, it.id, it.name_uz || it.name || null, it.quantity, it.unit_price, Number(it.unit_price) * Number(it.quantity)]);
    }

    await client.query('COMMIT');
    res.json({ orderId });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Create order error', err);
    res.status(500).json({ error: 'Unable to create order' });
  } finally {
    client.release();
  }
});

module.exports = router;
