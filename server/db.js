const mysql = require("mysql2/promise");
require("dotenv").config();

// Parse the connection URL
const parseDbUrl = (url) => {
  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    port: parsed.port,
    user: parsed.username,
    password: parsed.password,
    database: parsed.pathname.replace('/', ''),
    ssl: { rejectUnauthorized: false } // Required for Railway
  };
};

// Database configuration
const dbConfig = parseDbUrl(process.env.DATABASE_URL);

// Create connection pool
let pool;

// Initialize database connection
async function init() {
  try {
    pool = mysql.createPool(dbConfig);

    // Test connection
    const connection = await pool.getConnection();
    console.log("Database connection established successfully");
    connection.release();

    return pool;
  } catch (error) {
    console.error("Error initializing database connection:", error);
    throw error;
  }
}

// Close database connection
async function close() {
  if (pool) {
    return pool.end()
  }
}

// Execute query with parameters
async function query(sql, params = []) {
  try {
    const [results] = await pool.execute(sql, params)
    return results
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Get a single row
async function getOne(sql, params = []) {
  const results = await query(sql, params)
  return results[0]
}

// Get multiple rows
async function getAll(sql, params = []) {
  return await query(sql, params)
}

// Insert a record
async function insert(table, data) {
  const keys = Object.keys(data)
  const values = Object.values(data)
  const placeholders = keys.map(() => "?").join(", ")

  const sql = `INSERT INTO ${table} (${keys.join(", ")}) VALUES (${placeholders})`

  const result = await query(sql, values)
  return result.insertId
}

// Update a record
async function update(table, data, whereClause, whereParams = []) {
  const setClause = Object.keys(data)
    .map((key) => `${key} = ?`)
    .join(", ")
  const values = [...Object.values(data), ...whereParams]

  const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`

  const result = await query(sql, values)
  return result.affectedRows
}

// Delete a record
async function remove(table, whereClause, whereParams = []) {
  const sql = `DELETE FROM ${table} WHERE ${whereClause}`

  const result = await query(sql, whereParams)
  return result.affectedRows
}

module.exports = {
  init,
  close,
  query,
  getOne,
  getAll,
  insert,
  update,
  remove,
}
