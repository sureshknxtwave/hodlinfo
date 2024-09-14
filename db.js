const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'hodlinfo',
  password: 'Sureshk@9226',
  port: 5432,
});

module.exports = pool;
