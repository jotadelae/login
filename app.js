const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
const secretKey = 'your_secret_key'; // Use a strong, unique key for your JWT

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Dummy user storage (In real applications, use a database)
const users = [];

// Register route
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    
    // Check if user already exists
    const user = users.find(u => u.username === username);
    if (user) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully' });
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    // Find user
    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid password' });
    }

    // Create JWT token
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
    res.json({ token });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
