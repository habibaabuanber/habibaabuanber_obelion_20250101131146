const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const organizerRoutes = require('./routes/organizerRoutes');
const attendeeRoutes = require('./routes/attendeeRoutes');

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', authRoutes);
app.use('/api', organizerRoutes);
app.use('/api', attendeeRoutes);

// Database connection
const db = mysql.createConnection({
  host: 'db',
  user: 'agent',
  password: 'agentpass',
  database: 'Obelien AI'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database.');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});