// controllers/usersController.js
const pool = require('../models/db');

// Function to fetch all users
const getUsers = async (req, res) => {
  try {
    // Get a connection from the pool
    const connection = await pool.getConnection();

    // Execute a query to fetch users
    const [rows] = await connection.execute('SELECT * FROM users'); // Replace 'users' with your table name

    // Send the response
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getUsers, // Export the function for use in routes
};
