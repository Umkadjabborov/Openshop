const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
  rejectUnauthorized: false,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
