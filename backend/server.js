const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Create backend directory if it doesn't exist
const backendDir = path.join(__dirname, 'backend');
if (!fs.existsSync(backendDir)) {
  fs.mkdirSync(backendDir);
  console.log(`Created backend directory at ${backendDir}`);
}

// Database setup
const dbPath = path.join(backendDir, 'favorites.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log(`Connected to SQLite database at ${dbPath}`);
    
    // Create table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      location TEXT UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('Favorites table ready');
      }
    });
  }
});

// API Routes

// GET all favorites
app.get('/api/favorites', (req, res) => {
  console.log('GET request to /api/favorites');
  
  db.all('SELECT location FROM favorites ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      console.error('Error fetching favorites:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    
    const favorites = rows.map(row => row.location);
    console.log('Returning favorites:', favorites);
    res.json(favorites);
  });
});

// ADD a favorite
app.post('/api/favorites', (req, res) => {
  console.log('POST request to /api/favorites with body:', req.body);
  const { location } = req.body;
  
  if (!location) {
    console.log('Error: No location provided');
    return res.status(400).json({ error: 'Location is required' });
  }
  
  db.run('INSERT INTO favorites (location) VALUES (?)', [location], function(err) {
    if (err) {
      console.error('Error adding favorite:', err.message);
      
      // Check if it's a unique constraint error (location already exists)
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: 'Location already in favorites' });
      }
      
      return res.status(500).json({ error: 'Database error' });
    }
    
    console.log(`Added location to favorites: ${location} with ID ${this.lastID}`);
    res.status(201).json({ message: 'Location added to favorites', location });
  });
});

// DELETE a favorite
app.delete('/api/favorites/:location', (req, res) => {
  const locationToDelete = req.params.location;
  console.log('DELETE request to remove favorite:', locationToDelete);
  
  db.run('DELETE FROM favorites WHERE location = ?', [locationToDelete], function(err) {
    if (err) {
      console.error('Error removing favorite:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (this.changes === 0) {
      console.log('Error: Location not found in favorites');
      return res.status(404).json({ error: 'Location not found in favorites' });
    }
    
    console.log(`Removed location from favorites: ${locationToDelete}`);
    res.json({ message: 'Location removed from favorites', location: locationToDelete });
  });
});

// Debug endpoint to check server status
app.get('/api/debug', (req, res) => {
  console.log('DEBUG endpoint called');
  
  db.all('SELECT * FROM favorites ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      return res.json({
        server: 'running',
        dbPath,
        error: err.message
      });
    }
    
    res.json({
      server: 'running',
      dbPath,
      dbConnected: true,
      favorites: rows
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Database path: ${dbPath}`);
});

// Close database connection when app terminates
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed');
    }
    process.exit(0);
  });
});