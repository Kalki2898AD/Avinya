// Import the sqlite3 module
const sqlite3 = require('sqlite3').verbose();

// Create a new database file
let db = new sqlite3.Database('./my_database.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the my_database database.');
});

// Create a users table
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  password TEXT,
  email TEXT
)`, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('User table created.');
});

// Create a blogs table
db.run(`CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  title TEXT,
  content TEXT,
  attachments TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
)`, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Posts table created.');
});

// Create a follows table
db.run(`CREATE TABLE IF NOT EXISTS follows (
  follower_id INTEGER,
  following_id INTEGER,
  PRIMARY KEY(follower_id, following_id),
  FOREIGN KEY(follower_id) REFERENCES users(id),
  FOREIGN KEY(following_id) REFERENCES users(id)
)`, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Follows table created.');
});

// Export the database object
module.exports = db;
