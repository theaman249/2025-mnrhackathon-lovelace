const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.PG_USER_NAME,
  host: process.env.PG_HOST,
  password: process.env.PG_PASSWORD,
  port: process.PG_PORT,
  database: 'genesis',
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};