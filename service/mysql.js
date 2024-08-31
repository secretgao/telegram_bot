const mysql = require('mysql');
const util = require('util');
const env = require('dotenv');
const config = env.config();

// 创建连接池
const pool = mysql.createPool({
    connectionLimit:config.parsed.MYSQL_CONNECT_NUM,
    host: config.parsed.MYSQL_HOST,
    user: config.parsed.MYSQL_USERNAME,
    password: config.parsed.MYSQL_PASSWORD,
    database: config.parsed.MYSQL_DATABASE,
    port:config.parsed.MYSQL_PORT,
});

// 将 pool.query 方法转换为返回 Promise 的方法
pool.query = util.promisify(pool.query);

// 查询操作
async function query(sql, params) {
  try {
    const results = await pool.query(sql, params);
    return results;
  } catch (error) {
    throw error;
  }
}

// 添加操作
async function add(sql, params) {
  try {
    const results = await pool.query(sql, params);
    return results.insertId;
  } catch (error) {
    throw error;
  }
}
//更新操作
async function update(sql, params) {
  try {
    const results = await pool.query(sql, params);
    return results.affectedRows;
  } catch (error) {
    throw error;
  }
}
async function remove(sql, params) {
    try {
      const results = await pool.query(sql, params);
      return results.affectedRows;
    } catch (error) {
      throw error;
    }
  }
// 导出查询和添加操作
module.exports = {
  query,
  add,
  update,
  remove
};