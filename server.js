import express from "express";
import mysql from "mysql";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(cors());

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3307,
  user: 'lyssa',
  password: 'lilialimos09',
  database: 'barangay_capayang'
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL database: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

// Register a new user
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
  
    connection.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password], (err, result) => {
      if (err) {
        console.error('Error registering user: ' + err.stack);
        res.json({ message: 'Failed to register user' });
      } else {
        res.json({ message: 'User registered successfully' });
      }
    });
  });

  //Login User
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    connection.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
          res.json({ message: 'Failed to fetch user' });
        } else {
          if (results.length > 0) {
            const storedPassword = results[0].password;
            if (password === storedPassword) {
              res.json({ message: 'Login successful' });
            } else {
              res.json({ message: 'Invalid credentials' });
            }
          } else {
            res.json({ message: 'User not found' });
          }
        }
      });
    });

//Inquiry
app.post('/contact', (req, res) => {
    const { name, telephone, email, message } = req.body;
  
    connection.query('INSERT INTO inquiries (name, telephone, email, message) VALUES (?, ?, ?, ?)', [name, telephone, email, message], (err, result) => {
      if (err) {
        console.error('Error sending inquiry: ' + err.stack);
        res.json({ message: 'Failed to send' });
      } else {
        res.json({ message: 'Inquiry sent' });
      }
    });
  });
  
  const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});