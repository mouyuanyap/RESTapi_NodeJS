const mysql = require('mysql2/promise');
const config = require('../../c180_building/config');
const pool = mysql.createPool(config.db);

async function query(sql, params) {
  const [rows, fields] = await pool.execute(sql, params);
  console.log(rows)
  return rows;
}

module.exports = {
  query
}