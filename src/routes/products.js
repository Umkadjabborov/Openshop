const express = require('express');
const db = require('../db');
const { requireAdmin, authMiddleware } = require('../middleware/auth');
const router = express.Router();

// attach auth middleware so req.user is available
router.use(authMiddleware);

const productSelect = `
  SELECT
    p.*,
    COALESCE(
      json_agg(
        json_build_object(
          'id', pi.id,
          'image_url', pi.image_url,
          'is_main', pi.is_main,
          'sort_order', pi.sort_order
        ) ORDER BY pi.sort_order, pi.id
      ) FILTER (WHERE pi.id IS NOT NULL),
      '[]'
    ) AS images
  FROM public.products p
  LEFT JOIN public.product_images pi ON pi.product_id = p.id
`;

router.get('/', async (req, res) => {
  try {
    const result = await db.query(`${productSelect} GROUP BY p.id ORDER BY p.created_at DESC`);
    res.json(result.rows);
  } catch (error) {
    console.error('GET /products error:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ error: error.message || 'Unable to fetch products' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(`${productSelect} WHERE p.id = $1 GROUP BY p.id`, [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`GET /products/${req.params.id} error`, error);
    res.status(500).json({ error: 'Unable to fetch product' });
  }
});

router.post('/', requireAdmin, async (req, res) => {
  const {
    category_id,
    brand_id,
    name_uz,
    name_ru,
    slug,
    description_uz,
    price,
    old_price,
    discount_pct,
    sku,
    stock_qty,
    is_active = true,
    is_new = false,
    is_featured = false,
    warranty_months = 12,
    product_images = [],
  } = req.body;

  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    const insertProduct = `
      INSERT INTO public.products(
        category_id, brand_id, name_uz, name_ru, slug, description_uz,
        price, old_price, discount_pct, sku, stock_qty,
        is_active, is_new, is_featured, warranty_months
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      RETURNING *
    `;
    const productResult = await client.query(insertProduct, [
      category_id,
      brand_id,
      name_uz,
      name_ru,
      slug,
      description_uz,
      price,
      old_price,
      discount_pct,
      sku,
      stock_qty,
      is_active,
      is_new,
      is_featured,
      warranty_months,
    ]);
    const product = productResult.rows[0];

    if (product_images.length > 0) {
      const insertImageText = `
        INSERT INTO public.product_images(product_id, image_url, is_main, sort_order)
        VALUES ($1, $2, $3, $4)
      `;
      for (const image of product_images) {
        await client.query(insertImageText, [
          product.id,
          image.image_url,
          image.is_main || false,
          image.sort_order || 0,
        ]);
      }
    }

    await client.query('COMMIT');
    res.status(201).json({ product_id: product.id });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('POST /products error', error);
    res.status(500).json({ error: 'Unable to create product' });
  } finally {
    client.release();
  }
});

router.put('/:id', requireAdmin, async (req, res) => {
  const {
    category_id,
    brand_id,
    name_uz,
    name_ru,
    slug,
    description_uz,
    price,
    old_price,
    discount_pct,
    sku,
    stock_qty,
    is_active,
    is_new,
    is_featured,
    warranty_months,
    product_images,
  } = req.body;

  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    const updateFields = [];
    const values = [];
    let idx = 1;

    const fields = {
      category_id,
      brand_id,
      name_uz,
      name_ru,
      slug,
      description_uz,
      price,
      old_price,
      discount_pct,
      sku,
      stock_qty,
      is_active,
      is_new,
      is_featured,
      warranty_months,
    };

    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        updateFields.push(`${key} = $${idx}`);
        values.push(value);
        idx += 1;
      }
    }

    if (updateFields.length > 0) {
      values.push(req.params.id);
      await client.query(`UPDATE public.products SET ${updateFields.join(', ')} WHERE id = $${idx}`, values);
    }

    if (Array.isArray(product_images)) {
      await client.query('DELETE FROM public.product_images WHERE product_id = $1', [req.params.id]);
      const insertImageText = `
        INSERT INTO public.product_images(product_id, image_url, is_main, sort_order)
        VALUES ($1, $2, $3, $4)
      `;
      for (const image of product_images) {
        await client.query(insertImageText, [
          req.params.id,
          image.image_url,
          image.is_main || false,
          image.sort_order || 0,
        ]);
      }
    }

    await client.query('COMMIT');
    res.json({ message: 'Product updated' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`PUT /products/${req.params.id} error`, error);
    res.status(500).json({ error: 'Unable to update product' });
  } finally {
    client.release();
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM public.product_images WHERE product_id = $1', [req.params.id]);
    const result = await client.query('DELETE FROM public.products WHERE id = $1 RETURNING id', [req.params.id]);
    await client.query('COMMIT');

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`DELETE /products/${req.params.id} error`, error);
    res.status(500).json({ error: 'Unable to delete product' });
  } finally {
    client.release();
  }
});

module.exports = router;
