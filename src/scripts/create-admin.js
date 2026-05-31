const bcrypt = require('bcryptjs');
const db = require('../db');

const ADMIN_PHONE = '998901234567';
const ADMIN_PASSWORD = 'admin123';
const ADMIN_NAME = 'Admin User';

(async () => {
  try {
    const existing = await db.query('SELECT id FROM public.users WHERE phone = $1', [ADMIN_PHONE]);
    if (existing.rows.length > 0) {
      console.log(`Admin user already exists with phone ${ADMIN_PHONE}`);
      process.exit(0);
    }

    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const result = await db.query(
      'INSERT INTO public.users (phone, full_name, email, password_hash, role, is_active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [ADMIN_PHONE, ADMIN_NAME, null, hashed, 'admin', true]
    );
    console.log('Admin user created:', { id: result.rows[0].id, phone: ADMIN_PHONE, password: ADMIN_PASSWORD });
    process.exit(0);
  } catch (err) {
    console.error('Failed to create admin user', err);
    process.exit(1);
  }
})();
