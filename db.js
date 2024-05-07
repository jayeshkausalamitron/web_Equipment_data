// models/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.HOST, // e.g., 'localhost'
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
};

// Create a connection pool for better performance and connection management
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10, // You can adjust the limit
  queueLimit: 0, // No limit on queue length
});

module.exports = pool;
