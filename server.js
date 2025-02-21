// server.js
const express = require('express');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const port = 3000;

// Database setup
const db = new sqlite3.Database('./database.db');

// Create users table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      organization_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      organization_type TEXT CHECK(organization_type IN ('NGO', 'Hostel', 'Restaurant')) NOT NULL,
      address TEXT,
      phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set secure: true in production with HTTPS
}));

//registation endpont
// Registration endpoint
app.post('/register', async (req, res) => {
  try {
      const { 
          organizationName,
          email,
          password,
          organizationType,
          address = '',
          phone = ''
      } = req.body;

      // Validate required fields
      const requiredFields = {
          organizationName: 'Organization name is required',
          email: 'Email is required',
          password: 'Password is required',
          organizationType: 'Organization type is required'
      };

      const errors = [];
      for (const [field, message] of Object.entries(requiredFields)) {
          if (!req.body[field]) errors.push(message);
      }

      if (errors.length > 0) {
          return res.status(400).json({
              success: false,
              errors
          });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
          return res.status(400).json({
              success: false,
              errors: ['Invalid email format']
          });
      }

      // Validate password strength
      if (password.length < 8) {
          return res.status(400).json({
              success: false,
              errors: ['Password must be at least 8 characters']
          });
      }

      // Check for existing user
      db.get('SELECT email FROM users WHERE email = ?', [email], async (err, row) => {
          if (err) {
              console.error('Database error:', err);
              return res.status(500).json({
                  success: false,
                  errors: ['Database error']
              });
          }

          if (row) {
              return res.status(409).json({
                  success: false,
                  errors: ['Email already registered']
              });
          }

          try {
              // Hash password
              const hashedPassword = await bcrypt.hash(password, 10);

              // Insert new user
              db.run(
                  `INSERT INTO users 
                  (organization_name, email, password, organization_type, address, phone) 
                  VALUES (?, ?, ?, ?, ?, ?)`,
                  [organizationName, email, hashedPassword, organizationType, address, phone],
                  function(err) {
                      if (err) {
                          console.error('Registration error:', err);
                          return res.status(500).json({
                              success: false,
                              errors: ['Failed to create user']
                          });
                      }

                      // Create session
                      req.session.userId = this.lastID;
                      
                      res.status(201).json({
                          success: true,
                          message: 'Registration successful',
                          user: {
                              id: this.lastID,
                              organizationName,
                              email,
                              organizationType
                          }
                      });
                  }
              );
          } catch (hashError) {
              console.error('Password hash error:', hashError);
              res.status(500).json({
                  success: false,
                  errors: ['Server error']
              });
          }
      });
  } catch (error) {
      console.error('Registration process error:', error);
      res.status(500).json({
          success: false,
          errors: ['Internal server error']
      });
  }
});

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).send('Server error');
    if (!user) return res.status(400).send('Invalid credentials');

    try {
      if (await bcrypt.compare(password, user.password)) {
        req.session.userId = user.id;
        res.redirect('/');
      } else {
        res.status(400).send('Invalid credentials');
      }
    } catch (error) {
      res.status(500).send('Server error');
    }
  });
});

// Logout endpoint
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login.html');
});

// Serve static files
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Add this endpoint to get current user info
app.get('/api/me', (req, res) => {
  if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
  }
  
  db.get(
      'SELECT organization_name FROM users WHERE id = ?',
      [req.session.userId],
      (err, row) => {
          if (err || !row) {
              return res.status(404).json({ error: 'User not found' });
          }
          res.json({ organization_name: row.organization_name });
      }
  );
});