const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const bcrypt = require('bcrypt');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session); // Add this line

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // To handle JSON payloads
app.set('trust proxy', 1);

// Add these lines
app.use(session({
  store: new SQLiteStore, // Use SQLite for session storage
  secret: '06@Rishikesh#07varma!2006',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: 'auto', sameSite: 'none' } // Set to 'auto'
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Initialize the database
let db = new sqlite3.Database('./my_database.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Register endpoint
app.post('/register', async (req, res) => {
    const username = req.body.username;
    const password = await bcrypt.hash(req.body.password, 10);

    db.run(`INSERT INTO users(username, password) VALUES(?, ?)`, [username, password], function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).send('Registration failed, please try again');
        } else {
            console.log(`A row has been inserted with rowid ${this.lastID}`);
            res.status(200).send('User registered successfully');
        }
    });
});

// Login endpoint
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Login failed, please try again');
        } else if (row && await bcrypt.compare(password, row.password)) {
            req.session.user_id = row.id; // Add this line
            req.session.save(err => { // Add this block
                if(err) {
                    console.error(err.message);
                    res.status(500).send('Session save failed, please try again');
                } else {
                    res.status(200).send('Login successful');
                }
            });
        } else {
            res.status(401).send('Invalid username or password');
        }
    });
});


// Blog post creation endpoint
app.post('/posts/create', upload.array('attachments', 4), (req, res) => {
    console.log(req.session);
    if (req.session && req.session.user_id) { // Add this line
        const user_id = req.session.user_id; // Get the user_id from the session
        const title = req.body.title;
        const content = req.body.content;
        const attachments = req.files.map(file => file.path).join(','); // Join attachment paths into a single string

        db.run(`INSERT INTO posts(user_id, title, content, attachments) VALUES(?, ?, ?, ?)`, [user_id, title, content, attachments], function(err) {
            if (err) {
                console.error(err.message);
                res.status(500).send('Failed to create post, please try again');
            } else {
                console.log(`A post has been inserted with rowid ${this.lastID}`);
                res.status(200).send('Post created successfully');
            }
        });
    } else {
        res.status(401).send('You must be logged in to create a post');
    }
});

// Fetch blogs endpoint
app.get('/blogs', (req, res) => {
    if (req.session && req.session.user_id) { // Check if the user is logged in
        const user_id = req.session.user_id; // Get the user_id from the session

        console.log(`Fetching blogs for user_id: ${user_id}`); 

        db.all(`SELECT * FROM posts WHERE user_id = ?`, [user_id], (err, rows) => {
            if (err) {
                console.error(err.message);
                res.status(500).send('Failed to fetch blogs, please try again');
            } else {
                res.status(200).json(rows);
            }
        });
    } else {
        res.status(401).send('You must be logged in to fetch blogs');
    }
});


// Start the server
app.listen(3000, () => console.log('Server running on port 3000'));
