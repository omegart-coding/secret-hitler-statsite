require('dotenv').config({path: __dirname + '/.env'})
const mariadb = require('mariadb')


const pool = mariadb.createPool({
     host: 'localhost', 
     user: process.env.DB_USER, 
     database: process.env.DB_DATABASE,
     password: process.env.DB_KEY,
     connectionLimit: 5
});


async function query(sql, params) {
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query(sql, params);
    return res;
  } catch (error) {
      console.log(error);
  } finally {
    if (conn) conn.release();
  }
}

module.exports = { query }
