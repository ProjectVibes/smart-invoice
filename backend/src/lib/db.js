// src/lib/db.js or db.ts
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POOLED_DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // required by Supabase
});

module.exports = pool;
