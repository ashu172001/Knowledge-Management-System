// routes/auth.js
const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Login endpoint
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Log the incoming credentials for debugging
        console.log('Login attempt for username:', username);

        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            console.log('User not found:', username); 
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Validate the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log('Invalid password for user:', username);
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Log the token and role being returned
        console.log('Token generated for user:', username);
        console.log('Token:', token);
        console.log('Role:', user.role);

        // Send the response with token and role
        res.json({ token, role: user.role });
    } catch (error) {
        console.log('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Export the auth router
module.exports = router;
