// auth-router.js
const express = require("express");
const router = express.Router();
const User = require("../models/user-model"); // Ensure this path is correct
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_TOKEN

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ msg: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_TOKEN,
            { expiresIn: '1d' } // Token expiry (1 day)
        );

        // Send JWT token as cookie
        res.cookie('token', token, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production', // Ensure cookies are only sent over HTTPS
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.json({ msg: 'Login successful', user });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ msg: 'Error during login', error });
    }
});

//registration
router.post('/registration', async (req, res) => {
     const { name, email,phone, password } = req.body;
 
     // Perform validation (optional)
     if (!name || !email ||!phone|| !password) {
         return res.status(400).json({ message: 'All fields are required.' });
     }
 
     try {
         const existingUser = await User.findOne({ email });
         if (existingUser) {
             return res.status(409).json({ message: 'User already exists.' });
         }
 
         const newUser = new User({ name, email,phone, password });
         await newUser.save();
 
         res.status(201).json({ message: 'User registered successfully' });
     } catch (error) {
         console.error('Error registering user:', error);
         res.status(500).json({ message: 'Server error', error: error.message });
     }
 });

module.exports = router;
