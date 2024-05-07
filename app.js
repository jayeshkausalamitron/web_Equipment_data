// app.js
const express = require('express');
const usersRoutes = require('./routes/users'); // Import the routes

const app = express();
const port = process.env.PORT || 3000; // Use an environment variable for the port

// Middleware (optional)
app.use(express.json()); // Parse JSON bodies

// Set up routes
app.use('/users', usersRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
