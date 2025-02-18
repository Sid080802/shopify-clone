require('dotenv').config(); // Load .env file
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET; // Use secret key from .env

// Signup Route
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error, please try again later' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Received login request:', req.body);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ message: 'Login successful', user, token });
  } catch (err) {
    console.log('Error during login:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
