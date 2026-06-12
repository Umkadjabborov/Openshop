import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use('/images', express.static(path.join(__dirname, 'images')));

const DB_URL = process.env.DATABASE_URL || process.env.PG_CONNECTION_STRING;
if (!DB_URL) {
  console.error('ERROR: DATABASE_URL environment variable is not set.');
  process.exit(1);
}

const pool = new Pool({ 
  connectionString: DB_URL,
  ssl: DB_URL.includes('localhost') ? false : {
    rejectUnauthorized: false
  }
});

function normalizeImageUrl(url) {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return url.startsWith('/') ? url : `/${url}`;
}

function normalizeProduct(row) {
  return {
    id: row.id,
    name: row.name_uz,
    slug: row.slug,
    description: row.description_uz,
    price: Number(row.price),
    old_price: row.old_price ? Number(row.old_price) : null,
    discount_pct: row.discount_pct || 0,
    is_new: row.is_new,
    is_featured: row.is_featured,
    rating_avg: row.rating_avg ? Number(row.rating_avg) : 0,
    rating_count: row.rating_count || 0,
    stock_qty: row.stock_qty || 0,
    category_id: row.category_id,
    category_name: row.category_name,
    brand_id: row.brand_id,
    brand_name: row.brand_name,
    image_url: normalizeImageUrl(row.image_url),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name_uz, slug, icon FROM public.categories WHERE is_active = true ORDER BY sort_order'
    );
    res.json(result.rows.map(row => ({
      id: row.id,
      name: row.name_uz,
      slug: row.slug,
      icon: row.icon,
    })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load categories' });
  }
});

app.get('/api/brands', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, slug, logo_url FROM public.brands WHERE is_active = true ORDER BY name'
    );
    res.json(result.rows.map(row => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      logo_url: row.logo_url,
    })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load brands' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const { cat, search } = req.query;
    const where = ['p.is_active = true'];
    const params = [];

    if (cat) {
      params.push(cat);
      where.push(`c.name_uz = $${params.length}`);
    }
    if (search) {
      params.push(`%${search}%`);
      where.push(`p.name_uz ILIKE $${params.length}`);
    }

    const query = `
      SELECT p.*, c.name_uz AS category_name, b.name AS brand_name,
        (SELECT image_url FROM public.product_images WHERE product_id = p.id ORDER BY is_main DESC, sort_order LIMIT 1) AS image_url
      FROM public.products p
      LEFT JOIN public.categories c ON c.id = p.category_id
      LEFT JOIN public.brands b ON b.id = p.brand_id
      WHERE ${where.join(' AND ')}
      ORDER BY p.is_featured DESC, p.created_at DESC
    `;

    const result = await pool.query(query, params);
    res.json(result.rows.map(normalizeProduct));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load products' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, c.name_uz AS category_name, b.name AS brand_name
       FROM public.products p
       LEFT JOIN public.categories c ON c.id = p.category_id
       LEFT JOIN public.brands b ON b.id = p.brand_id
       WHERE p.id = $1 LIMIT 1`,
      [req.params.id]
    );
    if (!result.rows.length) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const images = await pool.query(
      'SELECT image_url FROM public.product_images WHERE product_id = $1 ORDER BY sort_order',
      [req.params.id]
    );

    const product = normalizeProduct({
      ...result.rows[0],
      image_url: images.rows.length ? images.rows[0].image_url : null,
    });

    res.json({ ...product, images: images.rows.map(row => normalizeImageUrl(row.image_url)) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load product details' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const {
      name_uz,
      description_uz,
      price,
      old_price,
      stock_qty,
      category_id,
      brand_id,
      image_url,
      is_new,
      is_featured,
    } = req.body;

    if (!name_uz || price === undefined || price === null || !category_id || !brand_id) {
      return res.status(400).json({ error: 'name_uz, price, category_id and brand_id are required' });
    }

    const finalPrice = Number(price);
    if (isNaN(finalPrice) || finalPrice < 0) {
      return res.status(400).json({ error: 'price must be a valid non-negative number' });
    }

    const baseSlug = name_uz
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s]+/g, '-')
      .replace(/^-+|-+$/g, '') || `product-${Date.now()}`;
    const slug = `${baseSlug}-${Date.now()}`;

    const productId = randomUUID();
    const finalOldPrice = old_price ? Number(old_price) : null;
    const discountPct = finalOldPrice && finalOldPrice > finalPrice
      ? Math.round((1 - (finalPrice / finalOldPrice)) * 100)
      : 0;

    await pool.query(
      `INSERT INTO public.products (
        id, category_id, brand_id, name_uz, slug, description_uz,
        price, old_price, discount_pct, sku, stock_qty, is_active, is_new, is_featured,
        rating_avg, rating_count, view_count, sold_count, warranty_months, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12, $13, $14,
        0, 0, 0, 0, 12, now(), now()
      )`,
      [
        productId, category_id, brand_id, name_uz, slug,
        description_uz || name_uz, finalPrice, finalOldPrice, discountPct,
        `SKU-${slug}`, stock_qty || 0, true, !!is_new, !!is_featured,
      ]
    );

    if (image_url) {
      await pool.query(
        'INSERT INTO public.product_images (product_id, image_url, is_main, sort_order) VALUES ($1, $2, true, 1)',
        [productId, image_url]
      );
    }

    const created = await pool.query(
      `SELECT p.*, c.name_uz AS category_name, b.name AS brand_name,
        (SELECT image_url FROM public.product_images WHERE product_id = p.id ORDER BY is_main DESC, sort_order LIMIT 1) AS image_url
       FROM public.products p
       LEFT JOIN public.categories c ON c.id = p.category_id
       LEFT JOIN public.brands b ON b.id = p.brand_id
       WHERE p.id = $1 LIMIT 1`,
      [productId]
    );

    res.status(201).json(normalizeProduct(created.rows[0]));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save product' });
  }
});

// AUTH: Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email va password majburiy' });
    }
    const exists = await pool.query('SELECT id FROM public.users WHERE email = $1', [email.toLowerCase()]);
    if (exists.rows.length) {
      return res.status(409).json({ error: 'Bu email allaqachon ro\'yxatdan o\'tgan' });
    }
    const hash = await bcrypt.hash(password, 10);
    const id = randomUUID();
    await pool.query(
      `INSERT INTO public.users (id, full_name, email, password_hash, role, is_active, is_verified, created_at)
       VALUES ($1, $2, $3, $4, 'customer', true, true, now())`,
      [id, name.trim(), email.toLowerCase(), hash]
    );
    res.status(201).json({ id, name: name.trim(), email: email.toLowerCase(), role: 'customer' });
  } catch (err) {
    console.error(err);
    
    // Ma'lumotlar bazasida majburiy maydon to'ldirilmagan bo'lsa (NOT NULL violation)
    if (err.code === '23502') {
      return res.status(400).json({ error: `Majburiy maydon to'ldirilmadi: ${err.column}` });
    }

    // Ma'lumotlar bazasida takroriy qiymat bo'lsa (Unique constraint violation)
    if (err.code === '23505') {
      return res.status(409).json({ 
        error: 'Bu email yoki telefon raqami allaqachon ro\'yxatdan o\'tgan' 
      });
    }
    
    // Boshqa barcha xatolar uchun aniqroq ma'lumot qaytaramiz
    res.status(500).json({ error: `Server xatosi: ${err.message}` });
  }
});

// AUTH: Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email va password majburiy' });
    }
    const result = await pool.query(
      'SELECT id, full_name, email, password_hash, role, is_active FROM public.users WHERE email = $1 LIMIT 1',
      [email.toLowerCase()]
    );
    if (!result.rows.length) {
      return res.status(401).json({ error: 'Email yoki parol noto\'g\'ri' });
    }
    const user = result.rows[0];
    if (!user.is_active) {
      return res.status(403).json({ error: 'Hisob faol emas' });
    }
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Email yoki parol noto\'g\'ri' });
    }
    res.json({ id: user.id, name: user.full_name, email: user.email, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kirishda xatolik' });
  }
});

// Barcha foydalanuvchilarni (mijozlarni) olish
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, full_name AS name, email, role, created_at FROM public.users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load users' });
  }
});

// POST category
app.post('/api/categories', async (req, res) => {
  try {
    const { name, icon } = req.body;
    if (!name) return res.status(400).json({ error: 'name majburiy' });
    const slug = name.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/^-+|-+$/g, '') || `cat-${Date.now()}`;
    const result = await pool.query(
      `INSERT INTO public.categories (name_uz, name_ru, slug, icon, is_active, sort_order)
       VALUES ($1, $1, $2, $3, true, (SELECT COALESCE(MAX(sort_order),0)+1 FROM public.categories))
       RETURNING id, name_uz AS name, slug, icon`,
      [name.trim(), slug, icon || '📦']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kategoriya qo\'shishda xatolik' });
  }
});

// POST brand
app.post('/api/brands', async (req, res) => {
  try {
    const { name, logo_url } = req.body;
    if (!name) return res.status(400).json({ error: 'name majburiy' });
    const slug = name.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/^-+|-+$/g, '') || `brand-${Date.now()}`;
    const result = await pool.query(
      `INSERT INTO public.brands (name, slug, logo_url, is_active)
       VALUES ($1, $2, $3, true)
       RETURNING id, name, slug, logo_url`,
      [name.trim(), slug, logo_url || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Brend qo\'shishda xatolik' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT id FROM public.products WHERE id = $1', [id]);
    if (!result.rows.length) {
      return res.status(404).json({ error: 'Product not found' });
    }
    await pool.query('DELETE FROM public.product_images WHERE product_id = $1', [id]);
    await pool.query('DELETE FROM public.products WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

app.listen(process.env.PORT || 4001, () => {
  console.log('Server running on port', process.env.PORT || 4001);
});
