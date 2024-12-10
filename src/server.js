// server.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 5000; // You can choose any port

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// PostgreSQL connection
const pool = new Pool({
    user: 'your_username',
    host: 'localhost',
    database: 'your_database',
    password: 'your_password',
    port: 5432,
});

// Sample route to get ingredients
app.get('/ingredients', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM ingredients');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});