import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function query(text, params) {
  const res = await pool.query(text, params);
  return res.rows;
}
