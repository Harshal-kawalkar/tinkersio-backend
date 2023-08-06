const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const secretKey = require('../config/secretKey')
const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const accessToken = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: '1h',
    });
    
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 3600000, // 1 hour
    });

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.status(409).json({ message: 'email already exists' });
    }

    const newUser = new User({ email, password });

    newUser.save()
        .then(() => res.json({ success: true }))
        .catch(error => res.status(400).json({ success: false, error }));
})

module.exports = router;
